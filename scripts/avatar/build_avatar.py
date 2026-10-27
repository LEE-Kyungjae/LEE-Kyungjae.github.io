"""Original portfolio avatar: shaped surfaces, garment panels and a deforming skeleton.
Blender headless: blender -b -t 4 -P scripts/avatar/build_avatar.py
"""
import bpy, bmesh, math, json, os, random, sys
from mathutils import Vector
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'assets/projects/avatar-model-20261027'; OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
# All shape dimensions are authored in metres, Z up, facing -Y.
parts=[]
def material(name,color,rough=.62,metal=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
 return m
teal=material('soft_petrol_silicone',(.018,.18,.20),.62)
cream=material('ivory_canvas',(.86,.80,.64),.88)
face=material('warm_ivory_face',(.92,.86,.72),.73)
seam=material('ivory_stitch',(.68,.60,.44),.9)
eye=material('ink_eyes',(.018,.027,.028),.27)
brass=material('brushed_brass',(.61,.38,.10),.33,.65)
pocket=material('petrol_pocket',(.028,.19,.20),.8)
# Portable, baked weave normal map: not a Blender-only procedural shader.
size=256;im=bpy.data.images.new('canvas_weave',width=size,height=size,alpha=True)
pixels=[]
for y in range(size):
 for x in range(size):
  dx=.09*math.sin(x*math.pi/2)+.025*math.sin((x+y)*math.pi/3)
  dy=.09*math.sin(y*math.pi/2)+.025*math.cos((x-y)*math.pi/3)
  pixels.extend([.5+dx,.5+dy,.99,1])
im.pixels.foreach_set(pixels);im.filepath_raw=str(OUT/'canvas-normal.png');im.file_format='PNG';im.save();im.colorspace_settings.name='Non-Color';im.pack()
for m,strength in [(cream,.025),(pocket,.025)]:
 n=m.node_tree.nodes;l=m.node_tree.links;t=n.new('ShaderNodeTexImage');t.image=im
 normal=n.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=strength;l.new(t.outputs['Color'],normal.inputs['Color']);l.new(normal.outputs['Normal'],n.get('Principled BSDF').inputs['Normal'])
 if m==cream:n.get('Principled BSDF').inputs['Sheen Weight'].default_value=.22

def mesh(name,verts,faces,mat,sub=0):
 data=bpy.data.meshes.new(name);data.from_pydata(verts,[],faces);data.update();bm=bmesh.new();bm.from_mesh(data);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(data);bm.free();o=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(o);o.data.materials.append(mat)
 for poly in data.polygons:poly.use_smooth=True
 if sub:
  mod=o.modifiers.new('tailored_surface','SUBSURF');mod.levels=sub;mod.render_levels=sub
  bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=mod.name)
 parts.append(o);return o

def loft(name,centers,radii,mat,sides=32,sub=1):
 verts=[];faces=[]
 for i,((x,y,z),(rx,ry)) in enumerate(zip(centers,radii)):
  prev=Vector(centers[max(0,i-1)]);nxt=Vector(centers[min(len(centers)-1,i+1)]);axis=(nxt-prev).normalized();u=Vector((0,1,0));v=axis.cross(u).normalized()
  for j in range(sides):
   a=2*math.pi*j/sides;p=Vector((x,y,z))+v*math.cos(a)*rx+u*math.sin(a)*ry;verts.append(tuple(p))
 for i in range(len(centers)-1):
  for j in range(sides):faces.append((i*sides+j,i*sides+(j+1)%sides,(i+1)*sides+(j+1)%sides,(i+1)*sides+j))
 faces.extend([tuple(range(sides-1,-1,-1)),tuple((len(centers)-1)*sides+j for j in range(sides))]);return mesh(name,verts,faces,mat,sub)
profile=[(.42,.28,.3),(.55,.72,.52),(.8,.98,.67),(1.15,1.10,.75),(1.65,1.13,.79),(2.15,1.07,.76),(2.65,.99,.72),(3.05,.89,.65),(3.4,.74,.56),(3.65,.49,.39),(3.79,.17,.17),(3.81,.005,.005)]
def body_r(z):
 for i in range(len(profile)-1):
  a,b=profile[i:i+2]
  if a[0]<=z<=b[0]:
   t=(z-a[0])/(b[0]-a[0]);return (a[1]*(1-t)+b[1]*t,a[2]*(1-t)+b[2]*t)
 return profile[0][1:] if z<profile[0][0] else profile[-1][1:]
def front(x,z,offset=.0):
 rx,ry=body_r(z);return -ry*math.sqrt(max(.01,1-(x/rx)**2))-offset
body=loft('continuous_bean_body',[(0,0,p[0]) for p in profile],[(p[1],p[2]) for p in profile],teal,64,2)
# Smoothly fused feet, with an instep and a flattened contact sole.
feet=[]
for side in [-1,1]:
 feet.append(loft('foot_form',[(side*.49,-.16,.025),(side*.49,-.16,.06),(side*.49,-.16,.15),(side*.49,-.12,.3),(side*.49,-.025,.55),(side*.49,0,.74)],[(.2,.29),(.35,.47),(.37,.49),(.32,.42),(.24,.29),(.2,.22)],teal,40,1))
bpy.ops.object.select_all(action='DESELECT')
for o in [body]+feet:o.select_set(True)
bpy.context.view_layer.objects.active=body;bpy.ops.object.join()
r=body.modifiers.new('fused_soft_anatomy','REMESH');r.mode='VOXEL';r.voxel_size=.035;r.use_smooth_shade=True;bpy.ops.object.modifier_apply(modifier=r.name)
s=body.modifiers.new('sculpt_relax','SMOOTH');s.factor=.8;s.iterations=5;bpy.ops.object.modifier_apply(modifier=s.name)
# Individual inset eyes replace the franchise-like full-face oval mask.
# A shallow rounded rectangular sclera, upper lid and off-centre pupils give
# the same compact body its own quiet, curious expression.
def face_patch(name,cx,cz,rx,rz,offset,mat):
 verts=[];faces=[];N=48;R=8
 for k in range(R+1):
  r=max(.001,k/R)
  for j in range(N):
   a=2*math.pi*j/N
   u=math.copysign(abs(math.sin(a))**.8,math.sin(a))
   v=math.copysign(abs(math.cos(a))**.8,math.cos(a))
   x=cx+rx*r*u;z=cz+rz*r*v
   verts.append((x,front(x,z,offset+.022*(1-r*r)),z))
 for k in range(R):
  for j in range(N):faces.append((k*N+j,k*N+(j+1)%N,(k+1)*N+(j+1)%N,(k+1)*N+j))
 return mesh(name,verts,faces,mat,1)
for side in [-1,1]:
 x=side*.285;z=3.09+( .025 if side<0 else 0)
 face_patch('eye_socket_'+str(side),x,z,.251,.185,.025,pocket)
 face_patch('eye_white_'+str(side),x,z-.014,.218,.141,.050,face)
 face_patch('eye_pupil_'+str(side),x+.027,z-.028,.073,.087,.081,eye)
 face_patch('eye_glint_'+str(side),x+.010,z+.001,.016,.018,.108,face)
 # Thick upper lid, slightly lower at the outside corner.
 centers=[]
 for j in range(9):
  dx=-.235+.47*j/8;zz=z+.097+.050*math.sin(math.pi*j/8)-side*dx*.06
  centers.append((x+dx,front(x+dx,zz,.092),zz))
 loft('eye_lid_'+str(side),centers,[(.018,.024)]+[(.035,.039)]*7+[(.018,.024)],teal,16,1)
# Small sculpted nose rather than a flat mask; same body material.
loft('face_nose',[(0,front(0,2.88,.02),2.88),(0,front(0,2.93,.095),2.93),(0,front(0,2.99,.065),2.99)],[(.025,.025),(.105,.10),(.035,.035)],teal,24,2)
# Jacket shell is a tailored wrap surface with a front opening and rounded hem.
verts=[];faces=[];ANG=96;ROWS=13
for row in range(ROWS):
 t=row/(ROWS-1)
 for j in range(ANG+1):
  a=.025+(2*math.pi-.05)*j/ANG
  top=2.20+.19*(1-math.cos(a))/2
  z=1.04+(top-1.04)*t
  rx,ry=body_r(z);bulge=.062+.035*math.sin(math.pi*t)
  x=(rx+bulge)*math.sin(a);y=-(ry+bulge)*math.cos(a)
  # Slight fabric compression at the side seams, not uniform inflated tubing.
  y+=.016*math.sin(a*10)*math.sin(math.pi*t)
  verts.append((x,y,z))
for row in range(ROWS-1):
 for j in range(ANG):i=row*(ANG+1)+j;faces.append((i,i+1,i+ANG+2,i+ANG+1))
jacket=mesh('cropped_work_jacket',verts,faces,cream,2)
solid=jacket.modifiers.new('fabric_thickness','SOLIDIFY');solid.thickness=.035;bpy.context.view_layer.objects.active=jacket;bpy.ops.object.modifier_apply(modifier=solid.name)
# Tubular seam helper, exported as mesh.
def cord(name,points,radius,mat):
 curve=bpy.data.curves.new(name,'CURVE');curve.dimensions='3D';curve.resolution_u=12;curve.bevel_depth=radius;curve.bevel_resolution=3
 sp=curve.splines.new('POLY');sp.points.add(len(points)-1)
 for p,co in zip(sp.points,points):p.co=(*co,1)
 o=bpy.data.objects.new(name,curve);bpy.context.collection.objects.link(o);o.data.materials.append(mat)
 bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH');parts.append(o);return o
# Slightly asymmetric closed smile, following the curved skin surface.
cord('face_mouth',[(x,front(x,z,.047),z) for x,z in [(-.105,2.743),(-.05,2.726),(.015,2.724),(.08,2.736),(.13,2.765)]],.017,eye)
# One small raised brow lends expression without changing the head silhouette.
cord('face_brow',[(x,front(x,z,.043),z) for x,z in [(-.47,3.38),(-.37,3.405),(-.25,3.408),(-.14,3.39)]],.024,pocket)
# Two independent collar flaps, with folds and real thickness.
for side in [-1,1]:
 shape=[(.035,-.85,2.13),(.20,-.94,1.91),(.64,-.91,2.12),(.99,-.58,2.31),(.87,-.43,2.40),(.45,-.70,2.32)]
 vs=[(side*x,y,z) for x,y,z in shape];vs.append((side*.48,-.91,2.20));fs=[(i,(i+1)%6,6) for i in range(6)]
 collar=mesh('folded_collar_L' if side<0 else 'folded_collar_R',vs,fs,cream,1)
 so=collar.modifiers.new('folded_edge','SOLIDIFY');so.thickness=.035;bpy.context.view_layer.objects.active=collar;bpy.ops.object.modifier_apply(modifier=so.name)
# Double hem and central zipper.
for z in [1.075,1.13]:
 rx,ry=body_r(z);cord('hem_stitch',[( (rx+.072)*math.sin(a),-(ry+.072)*math.cos(a),z) for a in [.035+(2*math.pi-.07)*j/128 for j in range(129)]],.009,seam)
for side in [-1,1]:cord('zipper_tape',[(side*.035,front(side*.035,z,.105),z) for z in [1.08+i*.055 for i in range(19)]],.013,seam)
for i in range(25):
 z=1.14+i*.033;cord('zipper_tooth',[( -.021,front(0,z,.12),z),(.021,front(0,z,.12),z+.006)],.009,brass)
cord('zipper_pull',[(.047*math.sin(a),-1.0,2.05+.075*math.cos(a)) for a in [2*math.pi*i/32 for i in range(33)]],.021,brass)
# Slanted inset pocket as a stitched fabric panel, small enough not to dominate.
pv=[];pf=[]
for row in range(5):
 for col in range(13):
  x=.47+.39*col/12;z=1.61-.12*col/12-.13*row/4;rx,ry=body_r(z)
  pv.append((x,-(ry+.105)*math.sqrt(1-(x/(rx+.105))**2)-.035,z))
for row in range(4):
 for col in range(12):
  i=row*13+col;pf.append((i,i+1,i+14,i+13))
mesh('diagonal_pocket',pv,pf,pocket,0)
cord('pocket_stitch',[pv[i] for i in list(range(13))+[25,38,51,64]+list(range(63,51,-1))+[39,26,13,0]],.006,seam)
# Curved sleeves and mitten hands; vertex deformation is driven by shoulder bones.
arm_parts={}
for side,name in [(-1,'L'),(1,'R')]:
 centers=[(side*.87,0,2.18),(side*1.07,0,2.12),(side*1.30,-.01,1.96),(side*1.46,-.035,1.69),(side*1.49,-.045,1.57)]
 radii=[(.25,.29),(.35,.34),(.32,.32),(.28,.27),(.26,.26)]
 sleeve=loft('sleeve_'+name,centers,radii,cream,36,2)
 cuff=loft('cuff_'+name,[(side*1.455,-.035,1.70),(side*1.49,-.045,1.61),(side*1.51,-.05,1.55)],[(.29,.28),(.29,.28),(.267,.263)],cream,32,1)
 palm=loft('mitten_'+name,[(side*1.50,-.05,1.65),(side*1.55,-.08,1.48),(side*1.57,-.10,1.26),(side*1.53,-.11,1.14)],[(.21,.22),(.275,.255),(.24,.24),(.035,.04)],teal,32,2)
 thumb=loft('thumb_'+name,[(side*1.39,-.24,1.46),(side*1.36,-.27,1.39),(side*1.38,-.25,1.29)],[(.06,.07),(.12,.11),(.04,.04)],teal,24,1)
 bpy.ops.object.select_all(action='DESELECT');palm.select_set(True);thumb.select_set(True);bpy.context.view_layer.objects.active=palm;bpy.ops.object.join();r=palm.modifiers.new('soft_thumb_union','REMESH');r.mode='VOXEL';r.voxel_size=.025;r.use_smooth_shade=True;bpy.ops.object.modifier_apply(modifier=r.name);sm=palm.modifiers.new('palm_relax','SMOOTH');sm.factor=.8;sm.iterations=3;bpy.ops.object.modifier_apply(modifier=sm.name)
 arm_parts[name]=[sleeve,cuff,palm]
# UVs for portable cloth grain, small enough to remain subtle in the web render.
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
for o in meshes:
 bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
 bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=1.15,island_margin=.015);bpy.ops.object.mode_set(mode='OBJECT')
# Rig: separate torso/head softness, arms, and smoothly weighted feet.
arm_data=bpy.data.armatures.new('avatar_skeleton');rig=bpy.data.objects.new('avatar_rig',arm_data);bpy.context.collection.objects.link(rig);bpy.context.view_layer.objects.active=rig;rig.select_set(True);bpy.ops.object.mode_set(mode='EDIT')
def bone(name,head,tail,parent=None):
 b=arm_data.edit_bones.new(name);b.head=head;b.tail=tail
 if parent:b.parent=arm_data.edit_bones[parent]
 return b
bone('root',(0,0,0),(0,0,.5));bone('body',(0,0,1),(0,0,2),'root');bone('head',(0,0,2),(0,0,3.4),'body')
for side,name in [(-1,'L'),(1,'R')]:
 bone('arm_'+name,(side*.9,0,2.2),(side*1.55,-.06,1.3),'body');bone('leg_'+name,(side*.48,0,.85),(side*.48,-.16,.12),'root')
bpy.ops.object.mode_set(mode='OBJECT')
for o in meshes:
 groups={n:o.vertex_groups.new(name=n) for n in ['root','body','head','arm_L','arm_R','leg_L','leg_R']}
 arm_name=next((n for n,objects in arm_parts.items() if o in objects),None)
 for v in o.data.vertices:
  x,y,z=v.co
  if arm_name:weights={'arm_'+arm_name:1}
  elif o==body:
   leg=max(0,min(1,(1.05-z)/.5));head=max(0,min(1,(z-2.12)/.60));weights={'leg_'+('L' if x<0 else 'R'):leg,'head':head*(1-leg),'body':(1-head)*(1-leg)}
  elif o.name.startswith(('eye_','face_')):weights={'head':1}
  else:weights={'body':1}
  for n,w in weights.items():
   if w>0:groups[n].add([v.index],w,'REPLACE')
 mod=o.modifiers.new('soft_character_rig','ARMATURE');mod.object=rig;o.parent=rig
# Save an inspectable production source and portable skinned GLB.
bpy.ops.object.select_all(action='DESELECT');rig.select_set(True)
for o in meshes:o.select_set(True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'avatar.blend'))
bpy.ops.export_scene.gltf(filepath=str(OUT/'avatar.glb'),export_format='GLB',use_selection=True,export_animations=False,export_skins=True,export_yup=True,export_apply=False)
(OUT/'build-report.json').write_text(json.dumps({'meshObjects':len(meshes),'vertices':sum(len(o.data.vertices) for o in meshes),'bones':len(rig.data.bones),'fileBytes':(OUT/'avatar.glb').stat().st_size,'source':'original authored Blender mesh and rig'},indent=2))
if os.environ.get('AVATAR_RENDER')!='1':
 print('Asset export complete; inspect the GLB in the web renderer.',flush=True)
 sys.exit(0)
# Neutral render for visual inspection; these cameras are not exported.
world=bpy.context.scene.world;world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.79,.84,.80,1);world.node_tree.nodes['Background'].inputs[1].default_value=.55
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.035));plane=bpy.context.object;plane.data.materials.append(material('studio_floor',(.82,.79,.69),.9))
def area(name,pos,power,size,color):
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;d.color=color;o=bpy.data.objects.new(name,d);bpy.context.collection.objects.link(o);o.location=pos;o.rotation_euler=(Vector((0,0,1.8))-o.location).to_track_quat('-Z','Y').to_euler()
area('softbox',(-4,-6,7),700,5,(1,.89,.72));area('fill',(4,-2,4),400,4,(.70,.88,1));area('rim',(1,4,6),750,3,(1,.93,.8))
bpy.ops.object.camera_add(location=(5,-9,4.6));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,1.9))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=5.4;bpy.context.scene.camera=cam
sc=bpy.context.scene;sc.render.threads_mode='FIXED';sc.render.threads=4;sc.render.engine='CYCLES';sc.cycles.samples=24;sc.render.resolution_x=900;sc.render.resolution_y=1000;sc.render.resolution_percentage=100;sc.render.image_settings.file_format='PNG';sc.render.filepath=str(ROOT/'output/avatar-20261027/model-render.png');bpy.ops.render.render(write_still=True)
(OUT/'build-report.json').write_text(json.dumps({'meshObjects':len(meshes),'vertices':sum(len(o.data.vertices) for o in meshes),'bones':len(rig.data.bones),'fileBytes':(OUT/'avatar.glb').stat().st_size,'source':'original authored Blender mesh and rig','concept':'../avatar-concepts-20261027/bean-v1.png'},indent=2))
