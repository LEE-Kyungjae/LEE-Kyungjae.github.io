'use client';
import {useEffect,useRef,useState} from 'react';
import * as T from 'three';
import {createRoomAvatar} from './RoomAvatar';
import SpaceParticles from './SpaceParticles';

type Mode='room'|'entering'|'brain'|'leaving';
export default function RoomExperience({calm,onSelect}:{calm:boolean;onSelect:(index:number)=>void}){
 const host=useRef<HTMLDivElement>(null),hint=useRef<HTMLButtonElement>(null);
 const labels=useRef<(HTMLButtonElement|null)[]>([]),paths=useRef<(SVGPathElement|null)[]>([]);
 const control=useRef<{enter:()=>void;leave:()=>void;move:(x:number,z:number)=>void}>({enter:()=>{},leave:()=>{},move:()=>{}});
 const calmRef=useRef(calm);calmRef.current=calm;
 const [mode,setMode]=useState<Mode>('room'),[status,setStatus]=useState('loading');
 useEffect(()=>{
  const el=host.current!;let disposed=false,frame=0,visible=true,modeNow:Mode='room',transitionStart=0,last=0,moving=false,avatarReady=false,brainReady=false;
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,1,.1,80),room=new T.Group();scene.add(room);
  let renderer:T.WebGLRenderer;
  try{renderer=new T.WebGLRenderer({antialias:true,alpha:true});}catch{setStatus('error');return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;el.prepend(renderer.domElement);
  scene.add(new T.HemisphereLight('#fff7df','#698781',2.6));
  const sun=new T.DirectionalLight('#fff3ce',4);sun.position.set(3,10,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-8,right:8,top:8,bottom:-8});sun.shadow.bias=-.001;scene.add(sun);
  const fill=new T.DirectionalLight('#9de5dd',1.5);fill.position.set(-6,4,1);scene.add(fill);
  const make=(geo:T.BufferGeometry,color:string,pos:number[])=>{const o=new T.Mesh(geo,new T.MeshStandardMaterial({color,roughness:.82}));o.position.set(...pos as [number,number,number]);o.receiveShadow=true;o.castShadow=true;room.add(o);return o;};
  const floor=make(new T.BoxGeometry(8.8,.28,6.8),'#e8dac4',[0,-.2,0]);
  make(new T.BoxGeometry(8.8,3.7,.18),'#accbc0',[0,1.55,-3.4]);
  make(new T.BoxGeometry(.18,3.7,6.8),'#d7e3d8',[-4.4,1.55,0]);
  make(new T.BoxGeometry(8.6,.15,.12),'#507e75',[0,.02,-3.25]);make(new T.BoxGeometry(.12,.15,6.5),'#507e75',[-4.25,.02,0]);
  // Window recess, mullions, and a sun patch put the figure in a real miniature room.
  make(new T.BoxGeometry(2.25,1.8,.12),'#f7eccf',[1.65,2.1,-3.23]);
  for(const x of [.55,1.65,2.75])make(new T.BoxGeometry(.07,1.86,.16),'#f8f4e7',[x,2.1,-3.12]);
  make(new T.BoxGeometry(2.28,.08,.16),'#f8f4e7',[1.65,2.1,-3.12]);
  const rug=make(new T.CylinderGeometry(2.1,2.1,.025,64),'#8cafa0',[0,-.035,.3]);rug.scale.z=.72;
  make(new T.BoxGeometry(1.65,.13,.72),'#b08963',[-2.7,1.05,-2.45]);
  for(const x of [-3.3,-2.1])make(new T.BoxGeometry(.09,1.1,.09),'#7c6654',[x,.5,-2.45]);
  const screen=make(new T.BoxGeometry(.85,.56,.09),'#28444a',[-2.7,1.48,-2.52]);screen.rotation.y=.12;
  make(new T.BoxGeometry(.7,.4,.025),'#b4dcd2',[-2.7,1.49,-2.46]);
  make(new T.CylinderGeometry(.27,.21,.48,24),'#bc795c',[3.25,.22,-2.4]);
  for(let i=0;i<5;i++){const leaf=make(new T.SphereGeometry(1,20,12),'#477a68',[3.25+Math.sin(i*2)*.19,.83+i*.09,-2.4+Math.cos(i*2)*.18]);leaf.scale.set(.17,.43,.13);leaf.rotation.z=Math.sin(i*2)*.5;}
  const avatar=createRoomAvatar();avatar.ready.then(()=>{if(disposed)return;avatarReady=true;el.dataset.avatar='ready';el.dataset.avatarModel='skinned-bean';el.dataset.avatarBones=String(avatar.root.userData.bones);if(brainReady)setStatus('ready');}).catch(()=>{if(!disposed)setStatus('error');});scene.add(avatar.root);avatar.root.position.set(0,0,.6);avatar.root.rotation.y=.24;
  const brain=new T.Group();brain.visible=false;scene.add(brain);brain.position.set(0,3.3,0);
  const brainMaterial=new T.MeshStandardMaterial({color:'#e9dbb5',roughness:.37,metalness:.03});
  let draco:{dispose:()=>void}|undefined;
  void (async()=>{const [{GLTFLoader},{DRACOLoader}]=await Promise.all([import('three/addons/loaders/GLTFLoader.js'),import('three/addons/loaders/DRACOLoader.js')]);if(disposed)return;
   const decoder=new DRACOLoader().setDecoderPath('/assets/draco/');draco=decoder;
   new GLTFLoader().setDRACOLoader(decoder).load('/assets/brain/brain.glb',gltf=>{
    if(disposed){gltf.scene.traverse(o=>{const m=o as T.Mesh;if(m.isMesh){m.geometry.dispose();(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>x.dispose());}});return;}
    const bounds=new T.Box3();gltf.scene.traverse(o=>{const m=o as T.Mesh;if(!m.isMesh)return;const category=m.userData.bx_cat||m.parent?.userData.bx_cat;m.visible=['cortex','cerebellum','brainstem','white_matter','deep_grey','diencephalon'].includes(category);if(m.visible)bounds.expandByObject(m);(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>x.dispose());m.material=brainMaterial;});
    const size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3()),scale=1.18/Math.max(size.x,size.y,size.z);gltf.scene.scale.setScalar(scale);gltf.scene.position.copy(center).multiplyScalar(-scale);const pivot=new T.Group();pivot.rotation.y=Math.PI;pivot.add(gltf.scene);brain.add(pivot);brainReady=true;if(avatarReady)setStatus('ready');decoder.dispose();
   },undefined,()=>{if(!disposed)setStatus('error');});
  })().catch(()=>{if(!disposed)setStatus('error');});
  const destination=avatar.root.position.clone(),keys=new Set<string>(),ray=new T.Raycaster(),pointer=new T.Vector2();
  const homeCamera=new T.Vector3(),homeTarget=new T.Vector3(0,1.35,0),look=new T.Vector3();
  const setModeNow=(next:Mode)=>{modeNow=next;setMode(next);el.dataset.mode=next;};
  const syncHash=()=>{if(['palamedes','gahyeon','backend','systems','experience','brain'].includes(location.hash.slice(1)))setModeNow('brain');};syncHash();window.addEventListener('hashchange',syncHash);
  let entryRotation=.24;
  const enter=()=>{if(modeNow!=='room'||!avatarReady||!brainReady)return;keys.clear();destination.copy(avatar.root.position);entryRotation=avatar.root.rotation.y;transitionStart=performance.now();setModeNow('entering');};
  const leave=()=>{if(modeNow!=='brain')return;transitionStart=performance.now();setModeNow('leaving');};
  control.current={enter,leave,move:(x,z)=>{if(modeNow==='room')destination.set(T.MathUtils.clamp(destination.x+x,-2.65,2.65),0,T.MathUtils.clamp(destination.z+z,-1.7,2.5));}};
  let downX=0,downY=0;
  const down=(e:PointerEvent)=>{downX=e.clientX;downY=e.clientY;};
  const up=(e:PointerEvent)=>{if(modeNow!=='room'||Math.hypot(e.clientX-downX,e.clientY-downY)>8)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);if(ray.intersectObject(avatar.root,true).length){enter();return;}const hit=ray.intersectObject(floor)[0];if(hit)destination.set(T.MathUtils.clamp(hit.point.x,-2.65,2.65),0,T.MathUtils.clamp(hit.point.z,-1.7,2.5));};
  const keydown=(e:KeyboardEvent)=>{if(e.key==='Escape'){leave();return;}if(modeNow!=='room'||!visible||document.activeElement?.tagName==='INPUT')return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)){if(document.activeElement?.tagName==='BUTTON'||document.activeElement?.tagName==='A')return;e.preventDefault();keys.add(e.key);}};
  const keyup=(e:KeyboardEvent)=>keys.delete(e.key),blur=()=>keys.clear();
  renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointerup',up);window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',blur);
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/Math.max(h,1);camera.updateProjectionMatrix();renderer.render(scene,camera);};
  const observer=new ResizeObserver(resize);observer.observe(el);
  const projection=(p:T.Vector3)=>{p.project(camera);return {x:(p.x+1)*el.clientWidth/2,y:(1-p.y)*el.clientHeight/2};};
  const draw=(now:number)=>{
   frame=0;if(disposed||!visible||document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;const mobile=el.clientWidth<600;
   homeCamera.set(mobile?10:10,8,mobile?17:14);camera.position.copy(homeCamera);look.copy(homeTarget);
   if(modeNow==='room'){
    const dx=Number(keys.has('d')||keys.has('ArrowRight'))-Number(keys.has('a')||keys.has('ArrowLeft')),dz=Number(keys.has('s')||keys.has('ArrowDown'))-Number(keys.has('w')||keys.has('ArrowUp'));
    if(dx||dz)destination.copy(avatar.root.position).add(new T.Vector3(dx,0,dz).normalize().multiplyScalar(dt*3));
    destination.x=T.MathUtils.clamp(destination.x,-2.65,2.65);destination.z=T.MathUtils.clamp(destination.z,-1.7,2.5);
    const delta=destination.clone().sub(avatar.root.position),distance=delta.length();
    if(distance>.015){avatar.root.position.add(delta.normalize().multiplyScalar(Math.min(distance,dt*2.5)));const target=Math.atan2(delta.x,delta.z);avatar.root.rotation.y+=Math.atan2(Math.sin(target-avatar.root.rotation.y),Math.cos(target-avatar.root.rotation.y))*Math.min(1,dt*12);}
    moving=distance>.015;
    avatar.root.position.y=0;
   }
   const head=new T.Vector3(avatar.root.position.x,3.38,avatar.root.position.z);
   // Approach the forehead first; reveal the brain only after the close approach.
   let morph=modeNow==='brain'?1:0;
   if(modeNow==='entering'||modeNow==='leaving'){
    const p=calmRef.current?1:Math.min(1,(now-transitionStart)/2200);
    morph=modeNow==='entering'?p:1-p;
    if(p===1)setModeNow(modeNow==='entering'?'brain':'room');
   }
   const smooth=(v:number)=>{const t=T.MathUtils.clamp(v,0,1);return t*t*(3-2*t);};
   const align=smooth(morph/.48),push=smooth((morph-.3)/.7),reveal=smooth((morph-.52)/.40);
   const aligned=new T.Vector3(head.x,3.65,head.z+(mobile?7.6:6.6));
   const close=new T.Vector3(head.x,3.42,head.z+(mobile?3.65:3.05));
   if(morph>0){camera.position.lerp(aligned,align).lerp(close,push);look.lerp(head,align);avatar.root.rotation.y=entryRotation*(1-align);}
   brain.position.set(avatar.root.position.x,3.3,avatar.root.position.z);brain.visible=reveal>0;
   brainMaterial.transparent=reveal<1;brainMaterial.opacity=reveal;avatar.setGhost(reveal);avatar.update(now,dt,modeNow==='room'&&moving,calmRef.current);el.dataset.gait=String(avatar.root.userData.gait??0);
   const roomFade=smooth((morph-.35)/.5);
   room.visible=roomFade<1;room.traverse(o=>{const m=o as T.Mesh;if(!m.isMesh)return;const material=m.material as T.MeshStandardMaterial;const transparent=roomFade>0;if(material.transparent!==transparent){material.transparent=transparent;material.needsUpdate=true;}material.opacity=1-roomFade;material.depthWrite=roomFade<.05;});
   el.dataset.morph=morph.toFixed(3);el.dataset.reveal=reveal.toFixed(3);el.dataset.cameraDistance=camera.position.distanceTo(head).toFixed(3);
   camera.lookAt(look);camera.updateMatrixWorld();scene.updateMatrixWorld(true);
   const hp=projection(new T.Vector3(avatar.root.position.x,4.18,avatar.root.position.z));if(hint.current){hint.current.style.left=`${hp.x}px`;hint.current.style.top=`${hp.y}px`;}
   el.dataset.position=`${avatar.root.position.x.toFixed(3)},${avatar.root.position.z.toFixed(3)}`;
   if(modeNow==='brain')for(let i=0;i<3;i++){
    const pt=projection(new T.Vector3(avatar.root.position.x+[-.38,.4,-.2][i],[3.55,3.27,2.95][i],avatar.root.position.z+.3));const x=el.clientWidth*[.16,.84,.20][i],y=el.clientHeight*(mobile?[.20,.22,.82]:[.20,.50,.80])[i];const b=labels.current[i];if(b){b.style.left=`${x}px`;b.style.top=`${y}px`;}paths.current[i]?.setAttribute('d',`M${pt.x} ${pt.y} L${x} ${y} H${x+(i===1?-35:35)}`);
   }
   renderer.render(scene,camera);frame=requestAnimationFrame(draw);
  };
  const resume=()=>{if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(draw);};
  const visibility=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(!visible){keys.clear();cancelAnimationFrame(frame);frame=0;}else resume();});visibility.observe(el);document.addEventListener('visibilitychange',resume);resize();resume();
  return()=>{disposed=true;window.removeEventListener('hashchange',syncHash);cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();document.removeEventListener('visibilitychange',resume);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur);avatar.dispose();scene.traverse(o=>{const m=o as T.Mesh;if(m.isMesh){m.geometry.dispose();(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>x.dispose());}});draco?.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <section className={`room-experience mode-${mode}`} aria-label="이경재의 작업실">
  <SpaceParticles brain={mode!=='room'} calm={calm}/>
  <div className="room-canvas" ref={host} data-mode={mode} data-status={status}>
   {mode==='room'&&status==='ready'&&<button className="room-clickme" ref={hint} onClick={()=>control.current.enter()} aria-label="캐릭터의 뇌 살펴보기"><img src="/assets/projects/room-20261027/clickme.webp" alt="Clickme" draggable={false}/></button>}
   {mode==='brain'&&<div className="room-brain-nodes"><svg aria-hidden="true">{[0,1,2].map(i=><path key={i} ref={e=>{paths.current[i]=e;}}/>)}</svg>{['Palamedes','Gahyeon','Backend'].map((name,i)=><button key={name} ref={e=>{labels.current[i]=e;}} onClick={()=>onSelect(i)}>{name}<span>↘</span></button>)}</div>}

  </div>
  <div className="room-ui" inert={mode!=='room'} aria-hidden={mode!=='room'}><aside className="room-intro-card"><img src="/assets/projects/room-20261027/intro-card.webp" alt="" draggable={false}/><div><p>소프트웨어 개발자</p><h1>이경재</h1><p>Java와 Spring 기반 서버 개발</p><button onClick={()=>control.current.enter()}>프로젝트 보기 ↘</button><a href="https://github.com/LEE-Kyungjae">GitHub ↗</a></div></aside><div className="room-movement" aria-label="캐릭터 이동">{[[-1,0,'←'],[0,-1,'↑'],[0,1,'↓'],[1,0,'→']].map(([x,z,label])=><button key={label} aria-label={`캐릭터 ${label} 이동`} onClick={()=>control.current.move(Number(x)*.8,Number(z)*.8)}>{label}</button>)}</div></div>
  {mode==='brain'&&<button className="room-back" onClick={()=>control.current.leave()}>← 작업실</button>}
  {status==='error'&&<button className="room-fallback" onClick={()=>onSelect(0)}>3D 로딩 실패: 프로젝트 보기 ↘</button>}
 </section>;
}
