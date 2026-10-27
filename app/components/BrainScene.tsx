'use client';
import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';

export default function BrainScene({ progress, selected, onSelect }: { progress: MutableRefObject<number>; selected: number; onSelect: (index: number) => void }) {
  const mount = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const leaders = useRef<(SVGPathElement|null)[]>([]);
  const sockets = useRef<(SVGCircleElement|null)[]>([]);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    const host = mount.current!;
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
      const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js');
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      host.prepend(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, .1, 50);
      const group = new THREE.Group();
      scene.add(group);
      scene.add(new THREE.HemisphereLight('#ffffff', '#899890', 2.2));
      const key = new THREE.DirectionalLight('#fff9ed', 3.5); key.position.set(-3, 5, 4); scene.add(key);
      const rim = new THREE.DirectionalLight('#c3fff3', 2.4); rim.position.set(3, 1, -3); scene.add(rim);
      const material = new THREE.MeshStandardMaterial({ color: '#d6d4c5', roughness: .3, metalness: .04 });
      const draco = new DRACOLoader().setDecoderPath('/assets/draco/');
      const loader = new GLTFLoader().setDRACOLoader(draco);
      const geometry: import('three').BufferGeometry[] = [];
      const oldMaterials = new Set<import('three').Material>();
      let frame = 0, visible = true, angle = 0, dragAngle = 0, dragging = false, lastX = 0, lastTime = 0, lastSelected = selectedRef.current;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)');
      const anchors = [new THREE.Vector3(-1, .5, .8), new THREE.Vector3(.8, .2, 1), new THREE.Vector3(.1, -.8, 1.1)];
      const dots = anchors.map((anchor) => {
        const dot = new THREE.Mesh(new THREE.SphereGeometry(.035, 12, 12), new THREE.MeshBasicMaterial({ color: '#007d70' }));
        dot.position.copy(anchor); group.add(dot); return dot;
      });
      const resize = () => { const { width, height } = host.getBoundingClientRect(); renderer.setSize(width, height); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); draw(performance.now()); };
      const draw = (now: number) => {
        const delta = Math.min((now - lastTime) / 1000, .05); lastTime = now;
        const p = reduced.matches ? 0 : progress.current;
        if (lastSelected !== selectedRef.current) { dragAngle = 0; lastSelected = selectedRef.current; }
        const target = (selectedRef.current - 1) * .38 + dragAngle + p * .65;
        angle = reduced.matches ? target : THREE.MathUtils.lerp(angle, target, 1 - Math.exp(-delta * 6));
        camera.position.set(Math.sin(angle) * 6.2, .85 + p * .55, Math.cos(angle) * 6.2);
        camera.lookAt(0, 0, 0); camera.updateMatrixWorld();
        group.rotation.z = reduced.matches ? 0 : -.09 + p * .14;
        group.updateMatrixWorld(true);
        const box=host.getBoundingClientRect(),mobile=innerWidth<=760;
        const labelPositions=mobile?[[.17,.16],[.80,.38],[.22,.86]]:[[.13,.27],[.86,.43],[.20,.83]];
        dots.forEach((dot,index)=>{
          const position=dot.getWorldPosition(new THREE.Vector3()).project(camera);
          const anchorX=(position.x+1)*box.width/2,anchorY=(-position.y+1)*box.height/2;
          const button=buttons.current[index];
          if(button){
            const width=button.offsetWidth,height=button.offsetHeight;
            const screenRight=Math.min(box.width,innerWidth-box.left-12);
            const x=Math.max(width/2+10,Math.min(screenRight-width/2-10,labelPositions[index][0]*box.width));
            const y=Math.max(height/2+8,Math.min(box.height-height/2-8,labelPositions[index][1]*box.height));
            button.style.left=`${x}px`;button.style.top=`${y}px`;
            const endX=x+(index===1?-width/2:width/2),elbowX=endX+(index===1?-18:18);
            leaders.current[index]?.setAttribute('d',`M${anchorX} ${anchorY} L${elbowX} ${y} H${endX}`);
            sockets.current[index]?.setAttribute('cx',String(anchorX));sockets.current[index]?.setAttribute('cy',String(anchorY));
          }
        });
        renderer.render(scene, camera);
      };
      const tick = (now: number) => { frame = 0; if (disposed || !visible || document.hidden) return; draw(now); frame = requestAnimationFrame(tick); };
      const resume = () => { if (!frame && visible && !document.hidden && !disposed) frame = requestAnimationFrame(tick); };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) resume(); else { cancelAnimationFrame(frame); frame = 0; } }); observer.observe(host);
      const sizing = new ResizeObserver(resize); sizing.observe(host);
      const down = (e: PointerEvent) => { if (e.button !== 0 || !e.isPrimary) return; dragging = true; lastX = e.clientX; renderer.domElement.setPointerCapture(e.pointerId); };
      const move = (e: PointerEvent) => { if (dragging) { dragAngle -= (e.clientX - lastX) * .006; lastX = e.clientX; } };
      const up = () => { dragging = false; };
      const lost = (e: Event) => { e.preventDefault(); setStatus('error'); };
      renderer.domElement.addEventListener('pointerdown', down); renderer.domElement.addEventListener('pointermove', move); renderer.domElement.addEventListener('pointerup', up); renderer.domElement.addEventListener('pointercancel', up); renderer.domElement.addEventListener('lostpointercapture', up); renderer.domElement.addEventListener('webglcontextlost', lost);
      document.addEventListener('visibilitychange', resume);
      cleanup = () => { cancelAnimationFrame(frame); observer.disconnect(); sizing.disconnect(); document.removeEventListener('visibilitychange', resume); draco.dispose(); renderer.dispose(); material.dispose(); geometry.forEach(g => g.dispose()); oldMaterials.forEach(m => m.dispose()); dots.forEach(d => {d.geometry.dispose();d.material.dispose();}); renderer.domElement.remove(); };
      loader.load('/assets/brain/brain.glb', (gltf) => {
        if (disposed) { gltf.scene.traverse(o => { const mesh = o as import('three').Mesh; if (mesh.isMesh) {mesh.geometry.dispose(); (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(m => m.dispose());} }); return; }
        const model = gltf.scene, bounds = new THREE.Box3();
        model.traverse(o => { const mesh = o as import('three').Mesh; if (!mesh.isMesh) return; geometry.push(mesh.geometry); (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(m => oldMaterials.add(m)); const category = mesh.userData.bx_cat || mesh.parent?.userData.bx_cat; mesh.visible = ['cortex', 'cerebellum', 'brainstem', 'white_matter', 'deep_grey', 'diencephalon'].includes(category); if (mesh.visible) {bounds.expandByObject(mesh);mesh.material = material;} });
        const center = bounds.getCenter(new THREE.Vector3()), size = bounds.getSize(new THREE.Vector3());
        const scale = 3.5 / Math.max(size.x, size.y, size.z); model.scale.setScalar(scale); model.position.copy(center).multiplyScalar(-scale);
        const orientation = new THREE.Group(); orientation.rotation.y = Math.PI; orientation.add(model); group.add(orientation);
        setStatus('ready'); resize(); resume(); draco.dispose();
      }, undefined, () => { if (!disposed) setStatus('error'); });
      resize(); resume();
    })().catch(() => { if (!disposed) setStatus('error'); });
    return () => { disposed = true; cleanup(); };
  }, [progress]);
  return <div className="brain-scene" ref={mount} data-status={status}>
    {status !== 'ready' && <div className="brain-status" role="status">{status === 'loading' ? '3D 로딩 중' : '3D를 표시할 수 없습니다.'}</div>}
    <div className="brain-node-layer" style={{ visibility: status === 'ready' ? 'visible' : 'hidden' }}>
      <svg className="brain-leaders" aria-hidden="true">{[0,1,2].map(index=><g key={index} data-selected={selected===index}><path ref={el=>{leaders.current[index]=el;}}/><circle ref={el=>{sockets.current[index]=el;}} r="3"/></g>)}</svg>
      {['Palamedes', 'Gahyeon', 'Backend'].map((name, index) => <button ref={el => { buttons.current[index] = el; }} type="button" className="brain-node" aria-pressed={selected === index} onClick={() => onSelect(index)} key={name}>{name}<span>↗</span></button>)}
    </div>
  </div>;
}
