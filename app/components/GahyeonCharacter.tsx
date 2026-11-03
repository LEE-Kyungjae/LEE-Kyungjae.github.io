'use client';
import {useEffect,useRef,useState} from 'react';

/** Original rig animation; no image translation or synthetic lip-sync. */
export default function GahyeonCharacter(){
 const host=useRef<HTMLDivElement>(null),[ready,setReady]=useState(false);
 useEffect(()=>{
  const node=host.current;if(!node)return;
  let disposed=false,visible=false,started=false,cleanup=()=>{};
  const start=async()=>{
   if(started)return;started=true;
   try{
    const [T,{GLTFLoader}]=await Promise.all([import('three'),import('three/examples/jsm/loaders/GLTFLoader.js')]);if(disposed)return;
    const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
    renderer.domElement.setAttribute('aria-hidden','true');node.appendChild(renderer.domElement);
    const scene=new T.Scene(),camera=new T.OrthographicCamera(-1,1,1,-1,.01,20);camera.position.set(0,.59,3);camera.lookAt(0,.59,0);
    scene.add(new T.HemisphereLight(0xe6f1ff,0x556064,2));
    const key=new T.DirectionalLight(0xffeee0,2.4);key.position.set(-1,2,3);scene.add(key);const fill=new T.DirectionalLight(0xd6f6ff,1);fill.position.set(1,1,2);scene.add(fill);
    let model:import('three').Group|undefined,mixer:import('three').AnimationMixer|undefined,frame=0,last=0,elapsed=0;
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const draw=()=>{renderer.render(scene,camera);};
    const tick=(now:number)=>{frame=0;if(disposed||!visible||document.hidden||media.matches)return;if(now-last>=1000/30){const dt=Math.min((now-last)/1000,.05);last=now;mixer?.update(dt);elapsed+=dt;node.dataset.motionTime=elapsed.toFixed(3);draw();}frame=requestAnimationFrame(tick);};
    const sync=()=>{cancelAnimationFrame(frame);frame=0;node.dataset.playing=String(visible&&!document.hidden&&!media.matches);if(visible&&!document.hidden&&!media.matches){last=performance.now();frame=requestAnimationFrame(tick);}else if(visible)draw();};
    const resize=()=>{const {width:w,height:h}=node.getBoundingClientRect();if(!w||!h)return;const span=1.3*Math.max(1,h/(w*720/593));camera.top=span/2;camera.bottom=-span/2;camera.left=-span*w/h/2;camera.right=span*w/h/2;camera.updateProjectionMatrix();renderer.setSize(w,h,false);draw();};
    const ro=new ResizeObserver(resize);ro.observe(node);resize();document.addEventListener('visibilitychange',sync);media.addEventListener('change',sync);
    const view=new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync();});view.observe(node);
    const release=(root:import('three').Object3D)=>{const textures=new Set<import('three').Texture>();root.traverse(o=>{const mesh=o as import('three').Mesh;if(mesh.geometry)mesh.geometry.dispose();for(const mat of mesh.material?(Array.isArray(mesh.material)?mesh.material:[mesh.material]):[]){Object.values(mat).forEach(v=>{if(v instanceof T.Texture)textures.add(v);});mat.dispose();}});textures.forEach(t=>t.dispose());};
    cleanup=()=>{cancelAnimationFrame(frame);ro.disconnect();view.disconnect();document.removeEventListener('visibilitychange',sync);media.removeEventListener('change',sync);mixer?.stopAllAction();if(model){mixer?.uncacheRoot(model);release(model);}renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();};
    const gltf=await new GLTFLoader().loadAsync('/assets/projects/voice-scene-20261030/character-idle.glb');if(disposed){release(gltf.scene);return;}
    model=gltf.scene;scene.add(model);mixer=new T.AnimationMixer(model);
    for(const clip of gltf.animations)mixer.clipAction(clip).setLoop(T.LoopPingPong,Infinity).play();
    mixer.update(0);node.dataset.clips=String(gltf.animations.length);resize();setReady(true);sync();
   }catch{if(!disposed){cleanup();node.dataset.fallback='true';}}
  };
  const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)void start();},{rootMargin:'150px'});observer.observe(node);
  return()=>{disposed=true;observer.disconnect();cleanup();};
 },[]);
 return <div ref={host} className="gahyeon-character-live" data-ready={ready} role="img" aria-label="가현 3D 캐릭터의 대기 모션"><img src="/assets/projects/voice-scene-20261030/character-upright.webp" alt=""/></div>;
}
