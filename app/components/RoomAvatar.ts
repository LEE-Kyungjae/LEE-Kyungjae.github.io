import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

/** Original Blender-authored skinned asset. No primitive human fallback. */
export function createRoomAvatar() {
 const root=new T.Group();root.name='portfolio-avatar';
 const materials=new Set<T.MeshStandardMaterial>(),bones=new Map<string,T.Bone>(),rest=new Map<string,T.Quaternion>();
 let disposed=false,phase=0,gait=0,ghost=0,lean=0,leanVelocity=0;
 const disposeObject=(object:T.Object3D)=>{const textures=new Set<T.Texture>();object.traverse(o=>{const m=o as T.Mesh;if(!m.isMesh)return;m.geometry.dispose();(Array.isArray(m.material)?m.material:[m.material]).forEach(mat=>{Object.values(mat).forEach(v=>{if(v instanceof T.Texture)textures.add(v);});mat.dispose();});});textures.forEach(t=>t.dispose());};
 const ready=new GLTFLoader().loadAsync('/assets/projects/avatar-model-20261027/avatar.glb').then(gltf=>{
  if(disposed){disposeObject(gltf.scene);return;}
  gltf.scene.traverse(o=>{
   if(o instanceof T.Bone){bones.set(o.name,o);rest.set(o.name,o.quaternion.clone());}
   const mesh=o as T.Mesh;if(!mesh.isMesh)return;mesh.castShadow=true;mesh.receiveShadow=true;
   (Array.isArray(mesh.material)?mesh.material:[mesh.material]).forEach(m=>{if(m instanceof T.MeshStandardMaterial)materials.add(m);});
  });
  // A real chest attachment, bound to the torso in its rest pose.
  const badgeCanvas=document.createElement('canvas');badgeCanvas.width=512;badgeCanvas.height=192;
  const ink=badgeCanvas.getContext('2d');
  if(ink){
   ink.fillStyle='#e8dfc9';ink.beginPath();ink.roundRect(4,4,504,184,24);ink.fill();
   ink.strokeStyle='#477b78';ink.lineWidth=7;ink.stroke();
   ink.fillStyle='#477b78';ink.fillRect(25,27,10,138);
   ink.fillStyle='#203e42';ink.font='600 88px "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';ink.textAlign='center';ink.textBaseline='middle';ink.fillText('이경재',274,101);
   const map=new T.CanvasTexture(badgeCanvas);map.colorSpace=T.SRGBColorSpace;
   const material=new T.MeshStandardMaterial({map,roughness:.86,alphaTest:.08});material.name='name_badge';materials.add(material);
   const badge=new T.Mesh(new T.PlaneGeometry(.72,.27),material);badge.name='name-badge';badge.position.set(-.51,1.73,.88);badge.rotation.y=-.32;badge.castShadow=true;
   gltf.scene.add(badge);gltf.scene.updateMatrixWorld(true);bones.get('body')?.attach(badge);
  }
  root.add(gltf.scene);root.userData.model='authored-skinned-bean';root.userData.bones=bones.size;
 });
 const q=new T.Quaternion(),e=new T.Euler();
 const pose=(name:string,x:number,y:number,z:number)=>{const bone=bones.get(name),base=rest.get(name);if(!bone||!base)return;q.setFromEuler(e.set(x,y,z));bone.quaternion.copy(base).multiply(q);};
 const update=(time:number,dt:number,moving:boolean,calm:boolean)=>{
  const target=moving&&!calm?1:0;
  gait=T.MathUtils.damp(gait,target,moving?9:5,dt);
  phase+=dt*(moving?9:5);
  // A damped follow-through, not a rigid simultaneous swing of every joint.
  const desired=moving&&!calm?.055:0;
  leanVelocity+=(desired-lean)*75*dt-leanVelocity*11*dt;lean+=leanVelocity*dt;
  const visibility=1-ghost,amount=gait*visibility;
  const sway=Math.sin(phase)*.075*amount,breath=calm?0:Math.sin(time*.0017)*.009*visibility;
  pose('body',lean*visibility,Math.sin(phase*.5)*.025*amount,sway+breath);
  pose('head',-lean*.5*visibility,0,-sway*.55);
  for(const [name,offset] of [['L',0],['R',Math.PI]] as const){
   const cycle=phase+offset;
   pose('leg_'+name,Math.sin(cycle)*.27*amount,0,Math.cos(cycle)*.025*amount);
   pose('arm_'+name,Math.sin(cycle-.65)*-.24*amount,Math.sin(cycle-.3)*.035*amount,(name==='L'?1:-1)*(.025+breath)*visibility);
  }
  root.userData.gait=gait;
 };
 const setGhost=(amount:number)=>{ghost=amount;materials.forEach(m=>{const transparent=amount>0;if(m.transparent!==transparent){m.transparent=transparent;m.needsUpdate=true;}const ink=m.name.includes('eyes');m.opacity=1-amount*(ink?.94:.93);m.depthWrite=amount<.05;});};
 const dispose=()=>{disposed=true;root.removeFromParent();disposeObject(root);};
 return {root,ready,update,setGhost,dispose};
}
