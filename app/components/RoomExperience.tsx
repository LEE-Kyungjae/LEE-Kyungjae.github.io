'use client';
import GitHubLink from './GitHubLink';
import {brainProjects,brainField,brainFields} from './brainProjects';
import {useCallback,useEffect,useRef,useState,type CSSProperties} from 'react';
import * as T from 'three';
import {createRoomAvatar} from './RoomAvatar';
import SpaceParticles from './SpaceParticles';
import SkyFarewell from './SkyFarewell';
import {createRoomProps} from './RoomProps';
import {createRoomDecor} from './RoomDecor';
import {TerritoryPrototype} from './territory/TerritoryPrototype';

const ROOM_OBJECT_SCALE=.8;
const JUMP_SPEED=3.1,JUMP_GRAVITY=5.8;
// Minimum screen gap between brain project labels (px).
const LABEL_GAP=12;

type Mode='room'|'entering'|'brain'|'leaving'|'sitting'|'computer'|'standing'|'diving';
export default function RoomExperience({calm,onSelect}:{calm:boolean;onSelect:(index:number)=>void}){
 const host=useRef<HTMLDivElement>(null),hint=useRef<HTMLButtonElement>(null),chairHint=useRef<HTMLButtonElement>(null);
 const pins=useRef<(SVGCircleElement|null)[]>([]);
 const labels=useRef<(HTMLButtonElement|null)[]>([]),paths=useRef<(SVGPathElement|null)[]>([]);
 const control=useRef<{enter:()=>void;leave:()=>void;sit:()=>void;stand:()=>void;move:(x:number,z:number)=>void;select:(i:number)=>void;press:(key:string,down:boolean)=>void}>({enter:()=>{},leave:()=>{},sit:()=>{},stand:()=>{},move:()=>{},select:()=>{},press:()=>{}});
 const calmRef=useRef(calm);calmRef.current=calm;
 const screenReadyAt=useRef(0);
 const [screenRevealed,setScreenRevealed]=useState(false);
 const revealComputer=useCallback(()=>{screenReadyAt.current=performance.now();},[]);
 const exitComputer=useCallback(()=>control.current.stand(),[]);
 const [activeField,setActiveField]=useState<keyof typeof brainFields|null>(null);
 const fieldRef=useRef(activeField);fieldRef.current=activeField;
 const [mode,setMode]=useState<Mode>('room'),[status,setStatus]=useState('loading');
 useEffect(()=>{
  const el=host.current!;let disposed=false,frame=0,visible=true,modeNow:Mode='room',transitionStart=0,last=0,moving=false,avatarReady=false,brainReady=false;
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,1,.1,80),room=new T.Group();scene.add(room);
  let visorProbe:T.WebGLRenderTarget|undefined;
  let renderer:T.WebGLRenderer;
  try{renderer=new T.WebGLRenderer({antialias:true,alpha:true});}catch{setStatus('error');return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;el.prepend(renderer.domElement);
  scene.add(new T.HemisphereLight('#fff7df','#698781',2.6));
  const sun=new T.DirectionalLight('#fff3ce',4);sun.position.set(3,10,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-8,right:8,top:8,bottom:-8});sun.shadow.bias=-.001;scene.add(sun);
  const fill=new T.DirectionalLight('#9de5dd',1.5);fill.position.set(-6,4,1);scene.add(fill);
  const make=(geo:T.BufferGeometry,color:string,pos:number[])=>{const o=new T.Mesh(geo,new T.MeshStandardMaterial({color,roughness:.82}));o.position.set(...pos as [number,number,number]);o.receiveShadow=true;o.castShadow=true;room.add(o);return o;};
  const floor=make(new T.BoxGeometry(12,.28,12),'#e8dac4',[0,-.2,0]);
  make(new T.BoxGeometry(12,6.6,.22),'#accbc0',[0,3.16,-6]);
  make(new T.BoxGeometry(.22,6.6,12),'#d7e3d8',[-6,3.16,0]);
  make(new T.BoxGeometry(11.8,.15,.12),'#507e75',[0,.02,-5.84]);make(new T.BoxGeometry(.12,.15,11.8),'#507e75',[-5.84,.02,0]);
  // Window recess, mullions, and a sun patch put the figure in a real miniature room.
  make(new T.BoxGeometry(2.25,1.8,.12),'#f7eccf',[2.6,3.5,-5.84]);
  for(const x of [1.5,2.6,3.7])make(new T.BoxGeometry(.07,1.86,.16),'#f8f4e7',[x,3.5,-5.72]);
  make(new T.BoxGeometry(2.28,.08,.16),'#f8f4e7',[2.6,3.5,-5.72]);
  const rug=make(new T.CylinderGeometry(2.1,2.1,.025,64),'#8cafa0',[0,-.035,.3]);rug.scale.z=.72;
  room.add(createRoomDecor());
  const furniture=createRoomProps(ROOM_OBJECT_SCALE);room.add(furniture.root);
  const chairRing=new T.Mesh(new T.RingGeometry(1.02*ROOM_OBJECT_SCALE,1.08*ROOM_OBJECT_SCALE,64),new T.MeshBasicMaterial({color:'#65b9a7',transparent:true,opacity:.65,side:T.DoubleSide,depthWrite:false}));
  chairRing.rotation.x=-Math.PI/2;chairRing.position.set(furniture.seat.x,.015,furniture.seat.z);room.add(chairRing);
  make(new T.CylinderGeometry(.27,.21,.48,24),'#bc795c',[-4.8,.22,-4.7]);
  for(let i=0;i<5;i++){const leaf=make(new T.SphereGeometry(1,20,12),'#477a68',[-4.8+Math.sin(i*2)*.19,.83+i*.09,-4.7+Math.cos(i*2)*.18]);leaf.scale.set(.17,.43,.13);leaf.rotation.z=Math.sin(i*2)*.5;}
  const avatar=createRoomAvatar();avatar.root.scale.setScalar(ROOM_OBJECT_SCALE);avatar.ready.then(()=>{if(disposed)return;
   // One static room probe; view-dependent reflections without six renders per frame.
   const cubeTarget=new T.WebGLCubeRenderTarget(256,{type:T.HalfFloatType});
   const probeCamera=new T.CubeCamera(.1,40,cubeTarget);probeCamera.position.copy(avatar.headPosition());
   const previousBackground=scene.background;scene.background=new T.Color('#0a1020');avatar.root.visible=false;
   const reflector=new T.Group();
   const panel=(w:number,h:number,x:number,y:number,z:number,color:string,intensity:number)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(color).multiplyScalar(intensity),side:T.DoubleSide}));m.position.set(x,y,z);m.lookAt(probeCamera.position);reflector.add(m);};
   panel(1.8,3,-3,5,4,'#dceaff',4);panel(.35,2.4,3,4,2,'#9dc9ff',2);scene.add(reflector);
   probeCamera.update(renderer,scene);const pmrem=new T.PMREMGenerator(renderer);visorProbe=pmrem.fromCubemap(cubeTarget.texture);avatar.setVisorEnvironment(visorProbe.texture);
   scene.remove(reflector);reflector.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(o.material as T.Material).dispose();}});cubeTarget.dispose();pmrem.dispose();scene.background=previousBackground;avatar.root.visible=true;el.dataset.visor='dark-mirror';
avatarReady=true;el.dataset.avatar='ready';el.dataset.avatarModel=String(avatar.root.userData.model);el.dataset.avatarBones=String(avatar.root.userData.bones);if(brainReady)setStatus('ready');}).catch(()=>{if(!disposed)setStatus('error');});scene.add(avatar.root);avatar.root.position.set(0,0,.6);avatar.root.rotation.y=.24;
  const brain=new T.Group();brain.visible=false;scene.add(brain);brain.position.set(0,3.3,0);
  const nodeAnchors=brainProjects.map((_,i)=>{const y=1-2*(i+.5)/brainProjects.length,angle=i*Math.PI*(3-Math.sqrt(5));return new T.Vector3(Math.cos(angle)*Math.sqrt(1-y*y),y,Math.sin(angle)*Math.sqrt(1-y*y)).multiplyScalar(.57);});
  const brainMaterial=new T.MeshStandardMaterial({color:'#e9dbb5',roughness:.37,metalness:.03});
  let draco:{dispose:()=>void}|undefined;
  void (async()=>{const [{GLTFLoader},{DRACOLoader}]=await Promise.all([import('three/addons/loaders/GLTFLoader.js'),import('three/addons/loaders/DRACOLoader.js')]);if(disposed)return;
   const decoder=new DRACOLoader().setDecoderPath('/assets/draco/');draco=decoder;
   new GLTFLoader().setDRACOLoader(decoder).load('/assets/brain/brain.glb',gltf=>{
    if(disposed){gltf.scene.traverse(o=>{const m=o as T.Mesh;if(m.isMesh){m.geometry.dispose();(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>x.dispose());}});return;}
    const bounds=new T.Box3();gltf.scene.traverse(o=>{const m=o as T.Mesh;if(!m.isMesh)return;const category=m.userData.bx_cat||m.parent?.userData.bx_cat;m.visible=['cortex','cerebellum','brainstem','white_matter','deep_grey','diencephalon'].includes(category);if(m.visible)bounds.expandByObject(m);(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>x.dispose());m.material=brainMaterial;});
    const size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3()),scale=1.18/Math.max(size.x,size.y,size.z);gltf.scene.scale.setScalar(scale);gltf.scene.position.copy(center).multiplyScalar(-scale);const pivot=new T.Group();pivot.rotation.y=0;pivot.add(gltf.scene);brain.add(pivot);
    // Resolve each fixed local direction onto the actual visible brain surface once.
    brain.updateWorldMatrix(true,true);const surfaces:T.Mesh[]=[];pivot.traverse(o=>{if((o as T.Mesh).isMesh&&o.visible)surfaces.push(o as T.Mesh);});
    const probe=new T.Raycaster();nodeAnchors.forEach((anchor,i)=>{const direction=anchor.clone().normalize(),origin=brain.localToWorld(direction.clone().multiplyScalar(2));probe.set(origin,direction.clone().negate());const hit=probe.intersectObjects(surfaces,false)[0];if(hit)nodeAnchors[i]=brain.worldToLocal(hit.point).addScaledVector(direction,.012);});
    brainReady=true;if(avatarReady)setStatus('ready');decoder.dispose();
   },undefined,()=>{if(!disposed)setStatus('error');});
  })().catch(()=>{if(!disposed)setStatus('error');});
  const destination=avatar.root.position.clone(),keys=new Set<string>(),ray=new T.Raycaster(),pointer=new T.Vector2();
  const homeCamera=new T.Vector3(),homeTarget=new T.Vector3(0,1.35,0),look=new T.Vector3();
  const setModeNow=(next:Mode)=>{modeNow=next;setMode(next);el.dataset.mode=next;};
  const syncHash=()=>{if(['palamedes','gahyeon','backend','systems','experience','brain'].includes(location.hash.slice(1)))setModeNow('brain');};syncHash();window.addEventListener('hashchange',syncHash);
  const wrapAngle=(angle:number)=>Math.atan2(Math.sin(angle),Math.cos(angle));
  let orbitYaw=0,orbitPitch=0,leaveYaw=0,leavePitch=0,diveIndex=0,navigated=false;const diveCamera=new T.Vector3(),diveLook=new T.Vector3(),diveTarget=new T.Vector3();
  let entryRotation=.24,brainZoom=1,zoomTarget=1,leaveZoom=1,dragPointer:number|null=null,dragX=0,dragY=0;
  const stopDrag=()=>{if(dragPointer!==null&&renderer.domElement.hasPointerCapture(dragPointer))renderer.domElement.releasePointerCapture(dragPointer);dragPointer=null;delete el.dataset.dragging;};
  let jumpHeight=0,jumpVelocity=0,jumpHeld=false;
  const jump=()=>{if(modeNow==='room'&&avatarReady&&jumpHeight===0&&jumpVelocity===0)jumpVelocity=JUMP_SPEED;};
  const sittingStart=new T.Vector3(),standingEnd=new T.Vector3();let sittingYaw=0;
  const sit=()=>{if(modeNow!=='room'||!avatarReady||jumpHeight>0||jumpVelocity>0)return;keys.clear();screenReadyAt.current=0;setScreenRevealed(false);sittingStart.copy(avatar.root.position);standingEnd.copy(furniture.approach);sittingYaw=wrapAngle(avatar.root.rotation.y);transitionStart=performance.now();setModeNow('sitting');};
  const stand=()=>{if(modeNow!=='computer')return;transitionStart=performance.now();el.parentElement?.style.setProperty('--computer-fade','0');setModeNow('standing');if(!frame)frame=requestAnimationFrame(draw);};
  const enter=()=>{if(modeNow!=='room'||!avatarReady||!brainReady||jumpHeight>0||jumpVelocity>0)return;keys.clear();destination.copy(avatar.root.position);entryRotation=wrapAngle(avatar.root.rotation.y);avatar.root.rotation.y=entryRotation;orbitYaw=orbitPitch=0;brainZoom=zoomTarget=1;transitionStart=performance.now();setModeNow('entering');};
  const leave=()=>{if(modeNow!=='brain')return;history.replaceState(null,'',location.pathname);stopDrag();leaveYaw=wrapAngle(orbitYaw);leavePitch=orbitPitch;leaveZoom=brainZoom;transitionStart=performance.now();setModeNow('leaving');};
  const select=(index:number)=>{if(modeNow!=='brain')return;stopDrag();diveIndex=index;diveCamera.copy(camera.position);diveLook.copy(look);brain.getWorldPosition(diveTarget);transitionStart=performance.now();setModeNow('diving');};
  control.current={enter,leave,sit,stand,select,press:(key,down)=>{if(modeNow!=='room')return;if(key==='space'){if(down&&!jumpHeld)jump();jumpHeld=down;}if(down)keys.add(key);else keys.delete(key);},move:(x,z)=>{if(modeNow==='room')destination.set(T.MathUtils.clamp(destination.x+x,-4.7,4.7),0,T.MathUtils.clamp(destination.z+z,-4.7,4.7));}};
  let downX=0,downY=0;
  const down=(e:PointerEvent)=>{if(e.button!==0)return;downX=e.clientX;downY=e.clientY;if(modeNow!=='brain'||dragPointer!==null)return;dragPointer=e.pointerId;dragX=e.clientX;dragY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);el.dataset.dragging='true';};
  const drag=(e:PointerEvent)=>{if(modeNow!=='brain'||e.pointerId!==dragPointer)return;const sensitivity=Math.PI*2/Math.max(el.clientWidth,320);orbitYaw=wrapAngle(orbitYaw-(e.clientX-dragX)*sensitivity);orbitPitch=T.MathUtils.clamp(orbitPitch+(e.clientY-dragY)*sensitivity,-.85,.85);dragX=e.clientX;dragY=e.clientY;};
  const wheel=(e:WheelEvent)=>{if(modeNow!=='brain')return;e.preventDefault();const pixels=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?el.clientHeight:1);zoomTarget=T.MathUtils.clamp(zoomTarget*Math.exp(-T.MathUtils.clamp(pixels,-200,200)*.0015),.75,1.6);};
  const up=(e:PointerEvent)=>{if(e.pointerId===dragPointer){const clicked=Math.hypot(e.clientX-downX,e.clientY-downY)<8;stopDrag();if(clicked&&modeNow==='brain'){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);if(!ray.intersectObject(brain,true).some(hit=>hit.object.visible))leave();}return;}if(e.button!==0)return;if(modeNow!=='room'||Math.hypot(e.clientX-downX,e.clientY-downY)>8)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);if(ray.intersectObject(furniture.chair,true).length){sit();return;}if(ray.intersectObject(avatar.root,true).length){enter();return;}const hit=ray.intersectObject(floor)[0];if(hit)destination.set(T.MathUtils.clamp(hit.point.x,-4.7,4.7),0,T.MathUtils.clamp(hit.point.z,-4.7,4.7));};
  const moveKey=(e:KeyboardEvent)=>({KeyW:'w',KeyA:'a',KeyS:'s',KeyD:'d'} as Record<string,string>)[e.code]??e.key;
  const keydown=(e:KeyboardEvent)=>{if(e.key==='Escape'){if(modeNow==='computer')stand();else leave();return;}const target=document.activeElement as HTMLElement|null;if(modeNow!=='room'||!visible||target?.matches('input,textarea,select,[contenteditable=true]'))return;if(e.code==='Space'){if(target?.closest('button,a,[role=button]'))return;e.preventDefault();if(!jumpHeld&&!e.repeat)jump();jumpHeld=true;return;}const key=moveKey(e);if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(key)){e.preventDefault();keys.add(key);}};
  const keyup=(e:KeyboardEvent)=>{keys.delete(moveKey(e));if(e.code==='Space')jumpHeld=false;},blur=()=>{keys.clear();jumpHeld=false;stopDrag();};
  renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointermove',drag);renderer.domElement.addEventListener('pointercancel',stopDrag);renderer.domElement.addEventListener('lostpointercapture',stopDrag);el.addEventListener('wheel',wheel,{passive:false});window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',blur);
  const introCard=el.parentElement?.querySelector<HTMLElement>('.room-intro-card');
  const resize=()=>{if(introCard)el.parentElement?.style.setProperty('--intro-height',`${introCard.offsetHeight}px`);const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/Math.max(h,1);camera.updateProjectionMatrix();renderer.render(scene,camera);};
  const observer=new ResizeObserver(resize);observer.observe(el);if(introCard)observer.observe(introCard);
  const projection=(p:T.Vector3)=>{p.project(camera);return {x:(p.x+1)*el.clientWidth/2,y:(1-p.y)*el.clientHeight/2};};
   const smooth=(v:number)=>{const t=T.MathUtils.clamp(v,0,1);return t*t*(3-2*t);};
  const draw=(now:number)=>{
   frame=0;if(disposed||!visible||document.hidden)return;if(modeNow==='computer'){const reveal=screenReadyAt.current?Math.min(1,(now-screenReadyAt.current)/(calmRef.current?120:850)):0;el.parentElement?.style.setProperty('--computer-fade',String(1-smooth(reveal)));el.dataset.screenReveal=reveal.toFixed(3);if(reveal===1)setScreenRevealed(true);else frame=requestAnimationFrame(draw);return;}const dt=Math.min((now-last)/1000,.05);last=now;const mobile=el.clientWidth<600;
   homeCamera.set(mobile?20:17,mobile?14.5:12.5,mobile?34:25.5);homeTarget.set(mobile?.7:0,2.1,0);camera.position.copy(homeCamera);look.copy(homeTarget);
   if(modeNow==='room'){
    const dx=Number(keys.has('d')||keys.has('ArrowRight'))-Number(keys.has('a')||keys.has('ArrowLeft')),dz=Number(keys.has('s')||keys.has('ArrowDown'))-Number(keys.has('w')||keys.has('ArrowUp'));
    if(dx||dz){
     // Project camera right onto the floor; W follows the screen's upward ground axis.
     const backward=homeCamera.clone().sub(homeTarget).setY(0).normalize();
     const right=new T.Vector3(backward.z,0,-backward.x);
     destination.copy(avatar.root.position).add(right.multiplyScalar(dx).add(backward.multiplyScalar(dz)).normalize().multiplyScalar(dt*5.8));
    }
    destination.x=T.MathUtils.clamp(destination.x,-4.7,4.7);destination.z=T.MathUtils.clamp(destination.z,-4.7,4.7);
    const delta=destination.clone().sub(avatar.root.position).setY(0),distance=delta.length();
    if(distance>.015){avatar.root.position.add(delta.normalize().multiplyScalar(Math.min(distance,dt*5.8)));const target=Math.atan2(delta.x,delta.z);avatar.root.rotation.y+=Math.atan2(Math.sin(target-avatar.root.rotation.y),Math.cos(target-avatar.root.rotation.y))*Math.min(1,dt*18);}
    avatar.root.rotation.y=wrapAngle(avatar.root.rotation.y);
    moving=distance>.015;
    if(jumpHeight>0||jumpVelocity>0){jumpHeight+=jumpVelocity*dt-.5*JUMP_GRAVITY*dt*dt;jumpVelocity-=JUMP_GRAVITY*dt;if(jumpHeight<=0){jumpHeight=0;jumpVelocity=0;}}
    avatar.root.position.y=jumpHeight;
    el.dataset.jumpHeight=jumpHeight.toFixed(4);el.dataset.jumpVelocity=jumpVelocity.toFixed(4);
   }
   const head=avatar.headPosition();
   // Approach the forehead first; reveal the brain only after the close approach.
   let morph=modeNow==='brain'||modeNow==='diving'?1:0;
   if(modeNow==='entering'||modeNow==='leaving'){
    const p=calmRef.current?1:Math.min(1,(now-transitionStart)/2200);
    morph=modeNow==='entering'?p:1-p;
    if(p===1){if(modeNow==='entering')history.replaceState(null,'',`${location.pathname}#brain`);setModeNow(modeNow==='entering'?'brain':'room');}
   }
   const align=smooth(morph/.48),push=smooth((morph-.3)/.7),reveal=smooth((morph-.52)/.40);
   const aligned=new T.Vector3(head.x,head.y+.27*ROOM_OBJECT_SCALE,head.z+(mobile?7.6:6.6));
   if(modeNow==='brain')brainZoom=calmRef.current?zoomTarget:T.MathUtils.damp(brainZoom,zoomTarget,12,dt);
   if(modeNow==='leaving'){const returning=1-smooth(morph);orbitYaw=leaveYaw*(1-returning);orbitPitch=leavePitch*(1-returning);brainZoom=T.MathUtils.lerp(leaveZoom,1,returning);}
   if(modeNow==='room'){orbitYaw=orbitPitch=0;brainZoom=zoomTarget=1;}
   const close=new T.Vector3(0,.04,(mobile?3.65:3.05)/brainZoom).applyEuler(new T.Euler(-orbitPitch,orbitYaw,0,'YXZ')).add(head);
   if(morph>0){camera.position.lerp(aligned,align).lerp(close,push);look.lerp(head,align);avatar.root.rotation.y=entryRotation*(1-align);}
   if(modeNow==='diving'){const t=Math.min(1,(now-transitionStart)/(calmRef.current?180:1450));camera.position.lerpVectors(diveCamera,diveTarget,smooth((t-.25)/.75)*.97);look.lerpVectors(diveLook,diveTarget,smooth(t/.25));el.dataset.diveTarget=diveTarget.toArray().join(',');el.dataset.diveAim=look.toArray().join(',');el.dataset.brainCenter=brain.getWorldPosition(new T.Vector3()).toArray().join(',');el.parentElement?.style.setProperty('--project-fade',String(smooth((t-.32)/.58)));el.dataset.dive=t.toFixed(3);if(t===1&&!navigated){navigated=true;onSelect(diveIndex);}}
   brain.visible=reveal>0;
   brainMaterial.transparent=reveal<1;brainMaterial.opacity=reveal;avatar.setGhost(reveal);avatar.root.visible=true;
   let seated=0;
   if(modeNow==='sitting'||modeNow==='standing'){
    const progress=calmRef.current?1:Math.min(1,(now-transitionStart)/3200);
    const amount=modeNow==='sitting'?progress:1-progress;
    const settle=smooth((amount-.28)/.34),focus=smooth((amount-.60)/.40);
    seated=settle;
    // Fade the foreground avatar as the viewpoint passes it toward the monitor.
    avatar.setGhost(smooth((focus-.12)/.65));avatar.root.visible=focus<.98;
    const start=modeNow==='standing'?standingEnd:sittingStart;
    avatar.root.position.copy(start).lerp(furniture.approach,smooth(amount/.28)).lerp(furniture.seat,settle);
    avatar.root.rotation.y=sittingYaw+wrapAngle(furniture.facing-sittingYaw)*smooth(amount/.40);
    look.lerp(furniture.monitor,focus);
    const closeScreen=furniture.monitor.clone().addScaledVector(furniture.normal,(mobile?1.8:1.35)*ROOM_OBJECT_SCALE);
    camera.position.lerp(closeScreen,focus);
    moving=amount>0&&amount<.28;
    if(modeNow==='sitting')el.parentElement?.style.setProperty('--computer-fade',String(smooth((progress-.78)/.16)));
    if(progress===1&&modeNow==='sitting')setModeNow('computer');
    else if(progress===1&&modeNow==='standing'){avatar.root.position.copy(standingEnd);destination.copy(standingEnd);setModeNow('room');}
   }
   avatar.update(now,dt,(modeNow==='room'||modeNow==='sitting'||modeNow==='standing')&&moving,calmRef.current,seated,jumpHeight>0);const animatedHead=avatar.headPosition();brain.position.copy(animatedHead);if(morph>0&&modeNow!=='diving'){const correction=animatedHead.clone().sub(head);camera.position.addScaledVector(correction,push);look.addScaledVector(correction,align);}el.dataset.headAnchor=animatedHead.toArray().join(',');el.dataset.brainCenter=brain.position.toArray().join(',');el.dataset.armSpread=String(avatar.root.userData.armSpread??0);el.dataset.wristSpan=String(avatar.root.userData.wristSpan??0);el.dataset.animationTime=String(avatar.root.userData.animationTime??0);el.dataset.seated=seated.toFixed(3);el.dataset.gait=String(avatar.root.userData.gait??0);el.dataset.legPose=String(avatar.root.userData.legPose??'');
   const roomFade=smooth((morph-.35)/.5);
   room.visible=roomFade<1;room.traverse(o=>{const m=o as T.Mesh;if(!m.isMesh)return;const material=m.material as T.MeshStandardMaterial;const transparent=roomFade>0||m===chairRing;if(material.transparent!==transparent){material.transparent=transparent;material.needsUpdate=true;}material.opacity=(1-roomFade)*(m===chairRing?.5:1);material.depthWrite=m!==chairRing&&roomFade<.05;});
   el.dataset.orbit=`${orbitYaw.toFixed(4)},${orbitPitch.toFixed(4)}`;el.dataset.cameraPosition=camera.position.toArray().join(',');el.dataset.brainOrientation='front-positive-z';el.dataset.roomSize='12,6.6,12';el.dataset.brainQuaternion=brain.quaternion.toArray().join(',');el.dataset.brainZoom=brainZoom.toFixed(3);el.dataset.avatarYaw=avatar.root.rotation.y.toFixed(5);
   el.dataset.morph=morph.toFixed(3);el.dataset.reveal=reveal.toFixed(3);el.dataset.cameraDistance=camera.position.distanceTo(head).toFixed(3);
   camera.lookAt(look);camera.updateMatrixWorld();scene.updateMatrixWorld(true);
   const cp=projection(furniture.hint.clone());if(chairHint.current){chairHint.current.style.left=`${cp.x}px`;chairHint.current.style.top=`${cp.y}px`;}
   const hp=projection(avatar.root.localToWorld(new T.Vector3(0,4.18,0)));if(hint.current){hint.current.style.left=`${hp.x}px`;hint.current.style.top=`${hp.y}px`;}
   el.dataset.position=`${avatar.root.position.x.toFixed(3)},${avatar.root.position.z.toFixed(3)}`;el.parentElement?.querySelectorAll<HTMLButtonElement>('[data-move-key]').forEach(button=>button.dataset.pressed=String(keys.has(button.dataset.moveKey!)));
   if(modeNow==='brain'){
    const width=el.clientWidth,height=el.clientHeight,center=projection(brain.getWorldPosition(new T.Vector3()));
    const viewDirection=camera.position.clone().sub(brain.position).normalize();
    const nodes=nodeAnchors.map((anchor,i)=>{
     const point=projection(brain.localToWorld(anchor.clone())),button=labels.current[i];
     const w=button?.offsetWidth||140,h=button?.offsetHeight||44;
     const dx=point.x-center.x,dy=point.y-center.y,length=Math.max(1,Math.hypot(dx,dy));
     const facing=anchor.clone().normalize().dot(viewDirection);
     return {i,point,w,h,facing,x:point.x+dx/length*(24+w*.32),y:point.y+dy/length*(22+h*.35)};
    }).filter(n=>!fieldRef.current||brainField(brainProjects[n.i].id)===fieldRef.current);
    const clampNode=(n:typeof nodes[number])=>{n.x=T.MathUtils.clamp(n.x,n.w/2+10,width-n.w/2-10);n.y=T.MathUtils.clamp(n.y,n.h/2+60,height-n.h/2-48);if(n.y-n.h/2<276&&n.x-n.w/2<90)n.x=Math.min(width-n.w/2-10,90+n.w/2);};
    // Relax only intersecting labels, starting from their projected surface positions.
    // No screen slots or category columns: orbit/zoom changes the whole topology.
    for(let pass=0;pass<48;pass++){
     nodes.forEach(clampNode);
     for(let a=0;a<nodes.length;a++)for(let b=a+1;b<nodes.length;b++){
      const n=nodes[a],m=nodes[b],dx=m.x-n.x,dy=m.y-n.y;
      const overlapX=(n.w+m.w)/2+LABEL_GAP-Math.abs(dx),overlapY=(n.h+m.h)/2+LABEL_GAP-Math.abs(dy);
      if(overlapX<=0||overlapY<=0)continue;
      if(overlapX<overlapY){const shift=(dx>=0?1:-1)*(overlapX/2+.1);n.x-=shift;m.x+=shift;}
      else{const shift=(dy>=0?1:-1)*(overlapY/2+.1);n.y-=shift;m.y+=shift;}
     }
    }
    nodes.forEach(n=>{
     clampNode(n);const button=labels.current[n.i],behind=n.facing<-.12,opacity=1;
     if(button){button.style.left=`${n.x}px`;button.style.top=`${n.y}px`;button.style.setProperty('--node-opacity',String(opacity));button.style.zIndex=String(behind?1:2);button.dataset.depth=behind?'back':'front';button.dataset.anchor=`${n.point.x.toFixed(2)},${n.point.y.toFixed(2)}`;}
     const path=paths.current[n.i];path?.setAttribute('d',`M${n.point.x} ${n.point.y} L${n.x} ${n.y}`);path?.setAttribute('opacity',String(behind?.32:.6));
     const pin=pins.current[n.i];pin?.setAttribute('cx',String(n.point.x));pin?.setAttribute('cy',String(n.point.y));pin?.setAttribute('opacity',String(behind?.55:opacity));
    });
   }
   renderer.render(scene,camera);frame=requestAnimationFrame(draw);
  };
  const restore=(e:PageTransitionEvent)=>{if(!e.persisted)return;navigated=false;el.parentElement?.style.setProperty('--project-fade','0');setModeNow('brain');};window.addEventListener('pageshow',restore);
  const resume=()=>{if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(draw);};
  const visibility=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(!visible){keys.clear();cancelAnimationFrame(frame);frame=0;}else resume();});visibility.observe(el);document.addEventListener('visibilitychange',resume);resize();resume();
  return()=>{window.removeEventListener('pageshow',restore);stopDrag();el.removeEventListener('wheel',wheel);renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointerup',up);renderer.domElement.removeEventListener('pointermove',drag);renderer.domElement.removeEventListener('pointercancel',stopDrag);renderer.domElement.removeEventListener('lostpointercapture',stopDrag);disposed=true;window.removeEventListener('hashchange',syncHash);cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();document.removeEventListener('visibilitychange',resume);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur);avatar.dispose();visorProbe?.dispose();scene.traverse(o=>{const m=o as T.Mesh;if(m.isMesh){m.geometry.dispose();(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>x.dispose());}});draco?.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <section className={`room-experience mode-${mode}`} aria-label="이경재의 작업실">
  <SpaceParticles brain={['entering','brain','leaving','diving'].includes(mode)} calm={calm}/>
  {mode==='room'&&<SkyFarewell enabled calm={calm}/>}
  <div className="room-canvas" ref={host} data-mode={mode} data-status={status}>
   {mode==='room'&&status==='ready'&&<button className="room-clickme" ref={hint} onClick={()=>control.current.enter()} aria-label="캐릭터의 뇌 살펴보기"><img src="/assets/projects/room-20261027/clickme.webp" alt="Clickme" draggable={false}/></button>}
   {mode==='room'&&status==='ready'&&<button className="room-chair-action" ref={chairHint} onClick={()=>control.current.sit()} aria-label="의자에 앉기"><span>클릭</span><svg viewBox="0 0 80 75" aria-hidden="true"><path d="M22 6C66 3 62 43 40 40C19 37 28 17 45 26C59 34 57 52 46 65M37 57L46 66L56 58"/></svg></button>}
   {mode==='brain'&&<><div className="room-brain-nodes"><svg aria-hidden="true">{brainProjects.map((project,i)=><g key={project.id} style={{display:activeField&&brainField(project.id)!==activeField?'none':undefined,color:brainFields[brainField(project.id)].color}}><path ref={e=>{paths.current[i]=e;}}/><circle r="4" ref={e=>{pins.current[i]=e;}}/></g>)}</svg>{brainProjects.map((project,i)=><button key={project.id} hidden={!!activeField&&brainField(project.id)!==activeField} data-project={project.id} data-field={brainField(project.id)} style={{'--node-color':brainFields[brainField(project.id)].color} as CSSProperties} aria-label={`${project.name} · ${brainFields[brainField(project.id)].name}`} ref={e=>{labels.current[i]=e;}} onClick={()=>control.current.select(i)}><span className="brain-project-name">{project.name}</span><span aria-hidden="true">↘</span></button>)}</div><div className="brain-field-legend" aria-label="프로젝트 분야">{Object.entries(brainFields).map(([id,field])=><button key={id} aria-label={field.name} title={field.name} aria-pressed={activeField===id} onClick={()=>setActiveField(activeField===id?null:id as keyof typeof brainFields)} style={{'--node-color':field.color} as CSSProperties}><i/><span>{field.name}</span></button>)}</div><a className="brain-list-link" href="/projects/">목록으로 보기</a></>}


  </div>
  <div className="room-ui" inert={mode!=='room'} aria-hidden={mode!=='room'}><nav className="room-entry" aria-label="프로젝트 바로가기"><button type="button" className="room-entry-primary" onClick={()=>{if(status==='ready')control.current.enter();else location.assign('/projects/');}}>프로젝트 보기 <span aria-hidden="true">↘</span></button><a className="room-entry-list" href="/projects/">목록으로 보기</a></nav><aside className="room-intro-card"><img src="/assets/projects/room-20261027/intro-card.webp" alt="" draggable={false}/><div><p>소프트웨어 개발자</p><h1>이경재</h1><div className="room-bio-text"><p>필요한 게 생기면 직접 만들어 써보는 걸 좋아합니다. 쓰면서 불편한 점을 고치고, 더 효율적인 방법을 찾아가는 과정이 즐겁습니다.</p><p>데이터 수집부터 기능 구현, 운영까지 두루 다룹니다. 한 번 만들고 끝내기보다, 계속 쓰고 관리할 수 있는 서비스를 만들고 싶습니다.</p><p>무엇을 만들지 정할 때는 여러 정보를 찾아보고, 얻는 것과 포기하는 것, 배우는 데 드는 시간까지 함께 생각합니다. 요구사항이 왜 필요한지, 사용자가 더 편하게 쓸 방법은 없는지 고민하는 편입니다.</p><p>제가 만드는 것에 애정을 갖고 다듬습니다. 다른 사람들과 기술 이야기를 나누며 생각을 넓히는 것도 좋아합니다.</p></div><GitHubLink href="https://github.com/LEE-Kyungjae" label="이경재 GitHub 프로필"/><img className="intro-bear-sticker sticker-heading" src="/assets/projects/bear-card-20261102/laptop.png" alt="" aria-hidden="true" draggable={false}/><img className="intro-bear-sticker sticker-footer" src="/assets/projects/bear-card-20261102/rest.png" alt="" aria-hidden="true" draggable={false}/></div></aside><div className="room-movement" aria-label="캐릭터 이동">{[['w','W','앞'],['a','A','왼쪽'],['s','S','뒤'],['d','D','오른쪽'],['space','SPACE','점프']].map(([key,label,direction])=><button key={key} data-move-key={key} aria-label={key==='space'?'스페이스바 점프':`캐릭터 ${direction} 이동`} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);control.current.press(key,true);}} onPointerUp={()=>control.current.press(key,false)} onPointerCancel={()=>control.current.press(key,false)} onLostPointerCapture={()=>control.current.press(key,false)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();control.current.press(key,true);}}} onKeyUp={()=>control.current.press(key,false)}>{label}</button>)}</div></div>
  <div className="room-project-fade" aria-hidden="true"/>
  {mode==='computer'&&<div className="room-computer" inert={!screenRevealed}><TerritoryPrototype onExit={exitComputer} onReady={revealComputer}/></div>}
  <div className="room-computer-fade" aria-hidden="true"/>
  {status==='error'&&<button className="room-fallback" onClick={()=>onSelect(0)}>3D 로딩 실패: 프로젝트 보기 ↘</button>}
 </section>;
}
