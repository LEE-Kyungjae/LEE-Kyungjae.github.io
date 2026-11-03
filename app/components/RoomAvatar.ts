import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

/** Land's astronaut: preserve the original skin/clips, shade only its visor UV island. */
export function createRoomAvatar() {
 const root=new T.Group();root.name='portfolio-avatar';
 const materials=new Set<T.MeshStandardMaterial>(),bones=new Map<string,T.Bone>(),clipPose=new Map<T.Bone,T.Quaternion>();
 const headOffset=new T.Vector3();
 let headBone:T.Bone|undefined;
 let visorEnvironment:T.Texture|undefined;
 let disposed=false,phase=0,gait=0,ghost=0,idleTime=0,modelBaseY=0;
 let model:T.Object3D|undefined,mixer:T.AnimationMixer|undefined,idle:T.AnimationAction|undefined,crouch:T.AnimationAction|undefined;
 const disposeObject=(object:T.Object3D)=>{const textures=new Set<T.Texture>();object.traverse(o=>{const m=o as T.Mesh;if(!m.isMesh)return;m.geometry.dispose();(Array.isArray(m.material)?m.material:[m.material]).forEach(mat=>{Object.values(mat).forEach(v=>{if(v instanceof T.Texture&&v!==visorEnvironment)textures.add(v);});mat.dispose();});});textures.forEach(t=>t.dispose());};
 const ready=new GLTFLoader().loadAsync('/assets/projects/astronaut-land-20261029/astronaut.glb').then(gltf=>{
  if(disposed){disposeObject(gltf.scene);return;}
  model=gltf.scene;
  model.traverse(o=>{
   if(o instanceof T.Bone)bones.set(o.name.replace(/[^a-zA-Z0-9]/g,''),o);
   const mesh=o as T.Mesh;if(!mesh.isMesh)return;mesh.castShadow=true;mesh.receiveShadow=true;
   (Array.isArray(mesh.material)?mesh.material:[mesh.material]).forEach(m=>{if(m instanceof T.MeshStandardMaterial){
    materials.add(m);
    if(m instanceof T.MeshPhysicalMaterial){m.clearcoat=1;m.clearcoatRoughness=.06;}
    m.onBeforeCompile=shader=>{
     shader.fragmentShader=shader.fragmentShader.replace('#include <uv_pars_fragment>',`#include <uv_pars_fragment>
      float visorMask(){
       vec2 p=(vMapUv-vec2(.085,.295))/vec2(.078,.103);
       return 1.0-smoothstep(.90,1.0,length(p));
      }`)
      .replace('#include <map_fragment>',`#include <map_fragment>
       diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.022,.030,.047),visorMask());`)
      .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
       roughnessFactor=mix(roughnessFactor,.075,visorMask());`)
      .replace('#include <metalnessmap_fragment>',`#include <metalnessmap_fragment>
       metalnessFactor=mix(metalnessFactor,.94,visorMask());`)
      .replace('#include <envmap_physical_pars_fragment>',T.ShaderChunk.envmap_physical_pars_fragment.replaceAll('envMapIntensity','(envMapIntensity * visorMask())'))
      .replace('#include <lights_physical_fragment>',`#include <lights_physical_fragment>
       #ifdef USE_CLEARCOAT
        material.clearcoat*=visorMask();
       #endif`);
    };
    m.customProgramCacheKey=()=> 'land-visor-dark-mirror-v1';
   }});
  });
  mixer=new T.AnimationMixer(model);
  const idleClip=T.AnimationClip.findByName(gltf.animations,'Idle'),crouchClip=T.AnimationClip.findByName(gltf.animations,'Crouch');
  if(!idleClip||!crouchClip)throw new Error('Astronaut animation clips missing');
  bones.forEach(bone=>clipPose.set(bone,bone.quaternion.clone()));
  idle=mixer.clipAction(idleClip).play();crouch=mixer.clipAction(crouchClip).play();
  idle.paused=crouch.paused=true;crouch.setEffectiveWeight(0);mixer.update(0);
  model.updateMatrixWorld(true);
  const bounds=new T.Box3().setFromObject(model),center=bounds.getCenter(new T.Vector3());
  const scale=4.1/bounds.getSize(new T.Vector3()).y;
  model.scale.multiplyScalar(scale);model.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);
  modelBaseY=model.position.y;root.add(model);root.updateMatrixWorld(true);headBone=bones.get('mixamorigHead');if(headBone)headOffset.copy(headBone.worldToLocal(root.localToWorld(new T.Vector3(0,3.38,0))));root.userData.model='land-purple-astronaut';root.userData.bones=bones.size;
  root.userData.clips=gltf.animations.map(c=>c.name);
 });
 const axis=new T.Vector3(),parentRotation=new T.Quaternion(),rotation=new T.Quaternion();
 // Rotate around the model's lateral axis, independent of the imported bone roll.
 const swing=(name:string,angle:number)=>{
  const bone=bones.get(`mixamorig${name}`);if(!bone?.parent||!model)return;
  bone.parent.getWorldQuaternion(parentRotation).invert();model.getWorldQuaternion(rotation);
  axis.set(1,0,0).applyQuaternion(rotation).applyQuaternion(parentRotation);
  rotation.setFromAxisAngle(axis,angle);bone.quaternion.premultiply(rotation);bone.updateMatrixWorld(true);
 };
 const spreadArm=(name:string,angle:number)=>{
  const bone=bones.get(`mixamorig${name}`);if(!bone?.parent)return;
  bone.parent.getWorldQuaternion(parentRotation).invert();root.getWorldQuaternion(rotation);
  axis.set(0,0,1).applyQuaternion(rotation).applyQuaternion(parentRotation);
  rotation.setFromAxisAngle(axis,angle);bone.quaternion.premultiply(rotation);bone.updateMatrixWorld(true);
 };
 const update=(_time:number,dt:number,moving:boolean,calm:boolean,seated=0,airborne=false)=>{
  gait=T.MathUtils.damp(gait,moving&&!calm?1:0,moving?16:12,dt);phase+=calm?0:dt*(airborne?9:15);
  if(mixer&&idle&&crouch){
   if(!calm)idleTime+=dt*1.25;
   idle.time=calm?0:idleTime%idle.getClip().duration;
   idle.setEffectiveWeight(1-seated);crouch.setEffectiveWeight(seated);
   // The imported crouch reaches its deepest pose halfway through the clip.
   crouch.time=crouch.getClip().duration*.5;
   clipPose.forEach((pose,bone)=>bone.quaternion.copy(pose));mixer.update(0);
   clipPose.forEach((pose,bone)=>pose.copy(bone.quaternion));
   const amount=gait*(1-ghost)*(1-seated)*(airborne?.6:1),stride=Math.sin(phase)*.58*amount;
   swing('LeftUpLeg',stride);swing('RightUpLeg',-stride);
   swing('LeftArm',-stride*.8);swing('RightArm',stride*.8);
   swing('LeftLeg',Math.max(0,-Math.sin(phase))*.65*amount);swing('RightLeg',Math.max(0,Math.sin(phase))*.65*amount);
   swing('LeftForeArm',-.35*amount);swing('RightForeArm',-.35*amount);
   if(airborne&&!calm){swing('LeftUpLeg',-.14);swing('RightUpLeg',-.14);swing('LeftLeg',.32);swing('RightLeg',.32);swing('LeftArm',-.18);swing('RightArm',-.18);}
   if(model)model.position.y=modelBaseY+(airborne?0:Math.abs(Math.sin(phase))*.075*amount);
   const spread=.28*(1-seated*.8);spreadArm('LeftArm',spread);spreadArm('RightArm',-spread);root.userData.armSpread=spread;
   const wrists=['LeftHand','RightHand'].map(n=>{const b=bones.get(`mixamorig${n}`);return b?root.worldToLocal(b.getWorldPosition(new T.Vector3())).x:0;});root.userData.wristSpan=Math.abs(wrists[0]-wrists[1]);
  }
  root.userData.gait=gait;root.userData.legPose=bones.get('mixamorigLeftUpLeg')?.quaternion.toArray().join(',');root.userData.animationTime=idle?.time??0;
 };
 const setGhost=(amount:number)=>{ghost=amount;materials.forEach(m=>{const transparent=amount>0;if(m.transparent!==transparent){m.transparent=transparent;m.needsUpdate=true;}m.opacity=1-amount*.97;m.depthWrite=amount<.05;});};
 const dispose=()=>{disposed=true;mixer?.stopAllAction();if(model)mixer?.uncacheRoot(model);root.removeFromParent();disposeObject(root);};
 const headPosition=(target=new T.Vector3())=>{root.updateMatrixWorld(true);return headBone?headBone.localToWorld(target.copy(headOffset)):root.localToWorld(target.set(0,3.38,0));};
 const setVisorEnvironment=(texture:T.Texture)=>{visorEnvironment=texture;materials.forEach(m=>{m.envMap=texture;m.envMapIntensity=1.7;m.needsUpdate=true;});root.userData.visor='dark-mirror';};
 return {root,ready,update,setGhost,dispose,headPosition,setVisorEnvironment};
}
