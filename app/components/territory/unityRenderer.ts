import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {WIDTH,HEIGHT,type Game} from './engine';

/** Web rendering of TerritoryPreview's island, source rigs, camera and team trails. */
export function createUnityRenderer(canvas:HTMLCanvasElement){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(960,640,false);renderer.outputColorSpace=T.SRGBColorSpace;
 const scene=new T.Scene();scene.background=new T.Color('#b5dbd6');
 // Reflect Unity's left-handed Z axis for Three's right-handed view.
 const camera=new T.OrthographicCamera(-48,48,32,-32,.1,200);
 const resize=()=>{const {width,height}=canvas.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);const halfHeight=32;camera.left=-halfHeight*width/height;camera.right=-camera.left;camera.top=halfHeight;camera.bottom=-halfHeight;camera.updateProjectionMatrix();canvas.dataset.viewport=`${width},${height}`;};
 const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
 scene.add(new T.HemisphereLight('#fff4df','#a4bbc2',2.1));const sun=new T.DirectionalLight('#fff3df',2);sun.position.set(-20,60,40);scene.add(sun);
 const pixels=new Uint8Array(WIDTH*HEIGHT*4),texture=new T.DataTexture(pixels,WIDTH,HEIGHT,T.RGBAFormat);texture.colorSpace=T.SRGBColorSpace;texture.magFilter=T.LinearFilter;texture.minFilter=T.LinearFilter;
 const verts:number[]=[],uv:number[]=[],indices:number[]=[],outline:T.Vector3[]=[];const segments=192;
 for(let i=0;i<=segments;i++){const u=-1+2*i/segments,x=48.5+46.5*u,c=32.5+2*Math.cos(u*Math.PI),h=Math.sqrt(Math.max(0,1-u*u))*(24-7*Math.cos(u*Math.PI*2));verts.push(x,0,c-h,x,0,c+h);uv.push(x/96,(c-h)/64,x/96,(c+h)/64);if(i<segments){const n=i*2;indices.push(n,n+2,n+1,n+1,n+2,n+3);}}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
 const island=new T.Mesh(geo,new T.MeshBasicMaterial({map:texture,side:T.DoubleSide}));scene.add(island);
 const base=new T.Mesh(geo,new T.MeshBasicMaterial({color:'#789c78',side:T.DoubleSide}));base.position.y=-.65;scene.add(base);
 for(let i=0;i<=segments;i++)outline.push(new T.Vector3(verts[i*6],.04,verts[i*6+2]));for(let i=segments;i>=0;i--)outline.push(new T.Vector3(verts[i*6+3],.04,verts[i*6+5]));
 const line=(points:T.Vector3[],color:string,loop=false)=>{const geometry=new T.BufferGeometry().setFromPoints(points),material=new T.LineBasicMaterial({color});return loop?new T.LineLoop(geometry,material):new T.Line(geometry,material);};
 scene.add(line(outline,'#789c78',true));const colors=['#098071','#ba5c53'];
 const actors:T.Group[]=[],limbs:Array<Array<{bone:T.Object3D;rest:T.Quaternion}>>=[],mixers:T.AnimationMixer[]=[];
 const trails=[0,1,2,3].map(i=>{const l=line([],colors[i%2]);scene.add(l);return l;});
 const pickups=new Map<number,T.Mesh>(),traps:Array<T.Line|T.LineLoop>=[];let revision=-1,disposed=false,lastClock=0;
 const disposeTree=(root:T.Object3D)=>{const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>();root.traverse(o=>{const m=o as T.Mesh;if(!m.geometry)return;geometries.add(m.geometry);for(const material of Array.isArray(m.material)?m.material:[m.material]){materials.add(material);Object.values(material).forEach(v=>{if(v instanceof T.Texture)textures.add(v);});}});geometries.forEach(x=>x.dispose());materials.forEach(x=>x.dispose());textures.forEach(x=>x.dispose());};
 const decoder=new DRACOLoader().setDecoderPath('/assets/draco/');const loader=new GLTFLoader().setDRACOLoader(decoder);
 const ready=Promise.all(['gahyeon','jaejae','pirate','rogue'].map(async(id,i)=>{
  const gltf=await loader.loadAsync(`/assets/projects/territory-unity/${id}.glb`);if(disposed){disposeTree(gltf.scene);return;}
  const root=new T.Group(),model=gltf.scene,bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3()),scale=5/Math.max(.01,size.y);model.scale.multiplyScalar(scale);model.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);root.add(model);scene.add(root);actors[i]=root;limbs[i]=[];
  model.traverse(bone=>{if(['LeftUpLeg','RightUpLeg','LeftLeg','RightLeg','LeftArm','RightArm'].some(name=>bone.name.endsWith(name)))limbs[i].push({bone,rest:bone.quaternion.clone()});});
  const mixer=new T.AnimationMixer(model);gltf.animations.forEach(clip=>mixer.clipAction(clip).play());mixers[i]=mixer;
  const ring=new T.Mesh(new T.RingGeometry(.72,.88,40),new T.MeshBasicMaterial({color:colors[i%2],side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.06;root.add(ring);
 })).then(()=>{if(!disposed)canvas.dataset.assets='ready';decoder.dispose();});
 const render=(g:Game)=>{
  if(disposed)return;const clock=120-g.remaining,dt=Math.max(0,Math.min(.05,clock-lastClock));lastClock=clock;
  if(revision!==g.revision){revision=g.revision;const palette=[[181,219,214],[241,237,220],[136,213,183],[238,181,165]];g.cells.forEach((v,i)=>{const color=palette[v+1];pixels.set([...color,255],i*4);});texture.needsUpdate=true;}
  const local=g.players[0],x=T.MathUtils.clamp(local.x,14,82),y=T.MathUtils.clamp(local.y,26,38);camera.position.set(x,60,y+30);camera.lookAt(x,0,y);
  g.players.forEach((p,i)=>{const root=actors[i];if(root){root.position.set(p.x,0,p.y);root.rotation.y=Math.PI/2-p.angle;root.visible=p.cooldown<=0||Math.floor(clock*12)%2===0;mixers[i].update(g.mode==='playing'?dt:0);limbs[i].forEach(({bone,rest})=>{const wave=Math.sin(clock*13+(bone.name.includes('Right')?Math.PI:0)),degrees=g.mode==='playing'&&p.cooldown<=0?(bone.name.includes('UpLeg')?wave*20:bone.name.endsWith('Leg')?Math.max(0,-wave)*17:-wave*9):0;bone.quaternion.copy(rest).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),degrees*Math.PI/180));});}const points=p.trace.map(t=>new T.Vector3(t.x,.10,t.y));if(points.length)points.push(new T.Vector3(p.x,.10,p.y));trails[i].geometry.dispose();trails[i].geometry=new T.BufferGeometry().setFromPoints(points);});
  for(const [id,mesh]of pickups)if(!g.items.some(i=>i.id===id)){mesh.removeFromParent();mesh.geometry.dispose();(mesh.material as T.Material).dispose();pickups.delete(id);}
  g.items.forEach(item=>{let mesh=pickups.get(item.id);if(!mesh){mesh=new T.Mesh(new T.SphereGeometry(.75,16,10),new T.MeshStandardMaterial({color:({burst:'#7861ab',trap:'#4299b0',loop:'#c78c30',speed:'#098071',catch:'#ba5c53'})[item.type],roughness:.5}));scene.add(mesh);pickups.set(item.id,mesh);}mesh.position.set(item.x,.9+Math.sin(clock*3+item.id)*.12,item.y);});
  while(traps.length<g.traps.length){const l=line([],'#7363a6',true);scene.add(l);traps.push(l);}traps.forEach((l,i)=>{l.visible=i<g.traps.length;if(!l.visible)return;const t=g.traps[i];l.geometry.dispose();l.geometry=new T.BufferGeometry().setFromPoints(Array.from({length:64},(_,k)=>new T.Vector3(t.x+Math.cos(k*Math.PI/32)*9,.12,t.y+Math.sin(k*Math.PI/32)*9)));});
  renderer.render(scene,camera);canvas.dataset.renderer='unity-reference';
 };
 return {render,ready,dispose:()=>{disposed=true;observer.disconnect();mixers.forEach(m=>m.stopAllAction());disposeTree(scene);decoder.dispose();renderer.dispose();}};
}
