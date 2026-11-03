import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {WIDTH,HEIGHT,type Game} from './engine';

/** Web rendering of TerritoryPreview's island, source rigs, camera and team trails. */
export function createUnityRenderer(canvas:HTMLCanvasElement){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(960,640,false);renderer.outputColorSpace=T.SRGBColorSpace;
 const scene=new T.Scene();scene.background=new T.Color('#378b9b');renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 // Reflect Unity's left-handed Z axis for Three's right-handed view.
 const camera=new T.OrthographicCamera(-48,48,32,-32,.1,200);
 const resize=()=>{const {width,height}=canvas.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);const halfHeight=26;camera.left=-halfHeight*width/height;camera.right=-camera.left;camera.top=halfHeight;camera.bottom=-halfHeight;camera.updateProjectionMatrix();canvas.dataset.viewport=`${width},${height}`;renderer.render(scene,camera);};
 const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
 scene.add(new T.HemisphereLight('#fff4df','#a4bbc2',2.1));const sun=new T.DirectionalLight('#fff3df',2);sun.position.set(-20,60,40);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-65,right:65,top:65,bottom:-65,far:180});sun.shadow.bias=-.001;sun.target.position.set(48,0,32);sun.position.set(20,75,55);scene.add(sun.target);scene.add(sun);
 const pixels=new Uint8Array(WIDTH*HEIGHT*4),texture=new T.DataTexture(pixels,WIDTH,HEIGHT,T.RGBAFormat);texture.colorSpace=T.SRGBColorSpace;texture.magFilter=T.NearestFilter;texture.minFilter=T.NearestFilter;
 const verts:number[]=[],uv:number[]=[],indices:number[]=[],outline:T.Vector3[]=[];const segments=192;
 for(let i=0;i<=segments;i++){const u=-1+2*i/segments,x=48.5+46.5*u,c=32.5+2*Math.cos(u*Math.PI),h=Math.sqrt(Math.max(0,1-u*u))*(24-7*Math.cos(u*Math.PI*2));verts.push(x,0,c-h,x,0,c+h);uv.push(x/96,(c-h)/64,x/96,(c+h)/64);if(i<segments){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2);}}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
 const terrainMaterial=new T.MeshBasicMaterial({color:'#789b62',side:T.DoubleSide,toneMapped:false});
 let terrainDisposed=false;
 const terrainReady=new T.TextureLoader().loadAsync('/assets/projects/territory-map-20261029/terrain.webp').then(art=>{if(terrainDisposed){art.dispose();return;}art.colorSpace=T.SRGBColorSpace;art.flipY=false;art.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());terrainMaterial.map=art;terrainMaterial.color.set('#ffffff');terrainMaterial.needsUpdate=true;canvas.dataset.terrain='imagegen-20261029';});
 const island=new T.Mesh(geo,terrainMaterial);scene.add(island);
 const shadowSurface=new T.Mesh(geo,new T.ShadowMaterial({opacity:.23,side:T.DoubleSide,depthWrite:false}));shadowSurface.position.y=.008;shadowSurface.receiveShadow=true;scene.add(shadowSurface);
 const ownership=new T.Mesh(geo,new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:T.DoubleSide,toneMapped:false}));ownership.position.y=.018;scene.add(ownership);
 const base=new T.Mesh(geo,new T.MeshBasicMaterial({color:'#789c78',side:T.DoubleSide}));base.position.y=-.65;scene.add(base);
 for(let i=0;i<=segments;i++)outline.push(new T.Vector3(verts[i*6],.04,verts[i*6+2]));for(let i=segments;i>=0;i--)outline.push(new T.Vector3(verts[i*6+3],.04,verts[i*6+5]));
 const line=(points:T.Vector3[],color:string,loop=false)=>{const geometry=new T.BufferGeometry().setFromPoints(points),material=new T.LineBasicMaterial({color});return loop?new T.LineLoop(geometry,material):new T.Line(geometry,material);};
 // A continuous rock skirt and sandy shore make the irregular silhouette readable.
 const cliffVertices:number[]=[],cliffIndices:number[]=[];
 outline.forEach((point,i)=>{cliffVertices.push(point.x,-.03,point.z,point.x,-2.4,point.z);const n=i*2,j=((i+1)%outline.length)*2;cliffIndices.push(n,j,n+1,j,j+1,n+1);});
 const cliffGeo=new T.BufferGeometry();cliffGeo.setAttribute('position',new T.Float32BufferAttribute(cliffVertices,3));cliffGeo.setIndex(cliffIndices);cliffGeo.computeVertexNormals();
 const cliff=new T.Mesh(cliffGeo,new T.MeshStandardMaterial({color:'#9d8a68',roughness:1,side:T.DoubleSide}));cliff.receiveShadow=true;scene.add(cliff);
 const shore=new T.Mesh(geo,new T.MeshStandardMaterial({color:'#e8d5a0',roughness:1,side:T.DoubleSide}));shore.scale.set(1.035,1,1.065);shore.position.set(-48*.035,-.12,-32*.065);shore.receiveShadow=true;scene.add(shore);
 const water=new T.Mesh(new T.PlaneGeometry(500,500),new T.ShaderMaterial({uniforms:{time:{value:0}},vertexShader:`varying vec2 vWorld;void main(){vec4 p=modelMatrix*vec4(position,1.);vWorld=p.xz;gl_Position=projectionMatrix*viewMatrix*p;}`,fragmentShader:`varying vec2 vWorld;uniform float time;void main(){float wave=sin(vWorld.x*.24+time*.7)*sin(vWorld.y*.31-time*.5);float crest=pow(max(0.,sin(vWorld.x*.57+vWorld.y*.29+time*.6)),16.);vec3 color=mix(vec3(.12,.38,.47),vec3(.24,.62,.65),.5+wave*.2);color+=crest*.035;gl_FragColor=vec4(color,1.);}`}));water.rotation.x=-Math.PI/2;water.position.set(48,-2.5,32);scene.add(water);
 const foam=line(outline.map(p=>new T.Vector3(48+(p.x-48)*1.06,-2.32,32+(p.z-32)*1.10)),'#b5e7db',true);scene.add(foam);
 const rockGeo=new T.DodecahedronGeometry(1,0),rockMaterial=new T.MeshStandardMaterial({color:'#748f89',roughness:1});
 for(let i=0;i<18;i++){const p=outline[Math.floor(i*outline.length/18)],rock=new T.Mesh(rockGeo,rockMaterial);rock.position.set(48+(p.x-48)*1.14,-2.15,32+(p.z-32)*1.22);rock.scale.set(1.1+(i%3)*.5,.55+(i%2)*.3,.8+(i%4)*.3);rock.rotation.y=i*2.4;rock.castShadow=true;scene.add(rock);}
 const colors=['#0bc5a4','#fa8b73'];
 const actors:T.Group[]=[],limbs:Array<Array<{bone:T.Object3D;rest:T.Quaternion}>>=[],mixers:T.AnimationMixer[]=[];
 const trails=[0,1,2,3].map(i=>{const mesh=new T.InstancedMesh(new T.BoxGeometry(1,.16,1),new T.MeshStandardMaterial({color:colors[i%2],emissive:colors[i%2],emissiveIntensity:.3,roughness:.65}),WIDTH*HEIGHT);mesh.count=0;mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;scene.add(mesh);return mesh;});
 const trailPose=new T.Object3D();const pulses=Array.from({length:12},()=>{const mesh=new T.Mesh(new T.RingGeometry(.85,1,48),new T.MeshBasicMaterial({color:'#fff7d5',transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide}));mesh.rotation.x=-Math.PI/2;scene.add(mesh);return {mesh,born:-10};});let pulseIndex=0,previousEvent:Game['event']=null;
 const cameraFocus=new T.Vector3(48,0,32);
 const pickups=new Map<number,T.Mesh>(),traps:Array<T.Line|T.LineLoop>=[];let revision=-1,disposed=false,lastClock=0;
 const disposeTree=(root:T.Object3D)=>{const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>();root.traverse(o=>{const m=o as T.Mesh;if(!m.geometry)return;geometries.add(m.geometry);for(const material of Array.isArray(m.material)?m.material:[m.material]){materials.add(material);Object.values(material).forEach(v=>{if(v instanceof T.Texture)textures.add(v);});}});geometries.forEach(x=>x.dispose());materials.forEach(x=>x.dispose());textures.forEach(x=>x.dispose());};
 const decoder=new DRACOLoader().setDecoderPath('/assets/draco/');const loader=new GLTFLoader().setDRACOLoader(decoder);
 const actorsReady=Promise.all(['gahyeon','jaejae','pirate','rogue'].map(async(id,i)=>{
  const gltf=await loader.loadAsync(`/assets/projects/territory-unity/${id}.glb`);if(disposed){disposeTree(gltf.scene);return;}
  const root=new T.Group(),model=gltf.scene,bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3()),scale=3.5/Math.max(.01,size.y);model.scale.multiplyScalar(scale);model.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);root.add(model);scene.add(root);actors[i]=root;limbs[i]=[];
  model.traverse(bone=>{if(bone instanceof T.Mesh){bone.castShadow=true;bone.receiveShadow=true;}if(['LeftUpLeg','RightUpLeg','LeftLeg','RightLeg','LeftArm','RightArm'].some(name=>bone.name.endsWith(name)))limbs[i].push({bone,rest:bone.quaternion.clone()});});
  const mixer=new T.AnimationMixer(model);const clip=gltf.animations.find(c=>/run|walk/i.test(c.name))??gltf.animations.find(c=>/idle/i.test(c.name));if(clip)mixer.clipAction(clip).play();mixers[i]=mixer;
  const ring=new T.Mesh(new T.RingGeometry(.85,1.12,40),new T.MeshBasicMaterial({color:colors[i%2],side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.06;root.add(ring);
  const shadow=new T.Mesh(new T.CircleGeometry(1.15,32),new T.MeshBasicMaterial({color:'#183b37',transparent:true,opacity:.2,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.025;root.add(shadow);
  if(i===0){const arrow=new T.Mesh(new T.ConeGeometry(.3,.65,3),new T.MeshBasicMaterial({color:'#fff3c2'}));arrow.position.y=4.2;arrow.rotation.z=Math.PI;root.add(arrow);}
 })).then(()=>{if(!disposed)canvas.dataset.assets='ready';decoder.dispose();});
 const ready=Promise.all([terrainReady,actorsReady]).then(()=>{});
 const render=(g:Game)=>{
  if(disposed)return;const clock=120-g.remaining,dt=Math.max(0,Math.min(.05,clock-lastClock));lastClock=clock;
  if(revision!==g.revision){revision=g.revision;const palette=[[224,215,180],[224,215,180],[73,178,151],[222,134,114]];g.cells.forEach((v,i)=>{const color=palette[v+1];pixels.set([...color,v>0?125:0],i*4);});texture.needsUpdate=true;}
  const local=g.players[0],x=T.MathUtils.clamp(local.x,14,82),y=T.MathUtils.clamp(local.y,26,38);cameraFocus.x=T.MathUtils.damp(cameraFocus.x,x,6,Math.max(dt,.016));cameraFocus.z=T.MathUtils.damp(cameraFocus.z,y,6,Math.max(dt,.016));camera.position.set(cameraFocus.x,60,cameraFocus.z+30);camera.lookAt(cameraFocus);(water.material as T.ShaderMaterial).uniforms.time.value=clock;
  g.players.forEach((p,i)=>{const root=actors[i];if(root){root.position.set(p.x,0,p.y);root.rotation.y=Math.PI/2-p.angle;root.visible=p.cooldown<=0||Math.floor(clock*12)%2===0;mixers[i].update(g.mode==='playing'?dt:0);limbs[i].forEach(({bone,rest})=>{const wave=Math.sin(clock*13+(bone.name.includes('Right')?Math.PI:0)),degrees=g.mode==='playing'&&p.cooldown<=0?(bone.name.includes('UpLeg')?wave*20:bone.name.endsWith('Leg')?Math.max(0,-wave)*17:-wave*9):0;bone.quaternion.copy(rest).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),degrees*Math.PI/180));});}const trace=p.trace,mesh=trails[i];mesh.count=Math.min(trace.length,WIDTH*HEIGHT);for(let k=0;k<mesh.count;k++){const a=trace[k],b=trace[k+1]??p,dx=b.x-a.x,dz=b.y-a.y;trailPose.position.set((a.x+b.x)/2,.15,(a.y+b.y)/2);trailPose.rotation.set(0,Math.atan2(dx,dz),0);trailPose.scale.set(.5,1,Math.max(.5,Math.hypot(dx,dz)+.15));trailPose.updateMatrix();mesh.setMatrixAt(k,trailPose.matrix);}mesh.instanceMatrix.needsUpdate=true;});
  if(g.event&&g.event!==previousEvent){const p=g.players.find(p=>p.id===g.event!.player);if(p){const pulse=pulses[pulseIndex++%pulses.length];pulse.born=clock;pulse.mesh.position.set(p.x,.22,p.y);pulse.mesh.material.color.set(g.event.kind==='cut'?'#ff665e':g.event.kind==='capture'?'#fff2b5':'#b9f2ff');}previousEvent=g.event;}
  pulses.forEach(p=>{const age=clock-p.born;p.mesh.visible=age>=0&&age<1.2;p.mesh.scale.setScalar(1+age*7);p.mesh.material.opacity=Math.max(0,1-age/1.2)*.75;});
  for(const [id,mesh]of pickups)if(!g.items.some(i=>i.id===id)){mesh.removeFromParent();mesh.geometry.dispose();(mesh.material as T.Material).dispose();pickups.delete(id);}
  g.items.forEach(item=>{let mesh=pickups.get(item.id);if(!mesh){mesh=new T.Mesh(new T.OctahedronGeometry(.85),new T.MeshStandardMaterial({color:({burst:'#7861ab',trap:'#4299b0',loop:'#c78c30',speed:'#098071',catch:'#ba5c53'})[item.type],roughness:.5}));scene.add(mesh);pickups.set(item.id,mesh);}mesh.position.set(item.x,1.2+Math.sin(clock*3+item.id)*.24,item.y);mesh.rotation.y=clock*1.2;});
  while(traps.length<g.traps.length){const l=line([],'#7363a6',true);scene.add(l);traps.push(l);}traps.forEach((l,i)=>{l.visible=i<g.traps.length;if(!l.visible)return;const t=g.traps[i];l.geometry.dispose();l.geometry=new T.BufferGeometry().setFromPoints(Array.from({length:64},(_,k)=>new T.Vector3(t.x+Math.cos(k*Math.PI/32)*9,.12,t.y+Math.sin(k*Math.PI/32)*9)));});
  renderer.render(scene,camera);canvas.dataset.renderer='unity-reference';
 };
 return {render,ready,dispose:()=>{disposed=true;terrainDisposed=true;observer.disconnect();mixers.forEach(m=>m.stopAllAction());disposeTree(scene);decoder.dispose();renderer.dispose();}};
}
