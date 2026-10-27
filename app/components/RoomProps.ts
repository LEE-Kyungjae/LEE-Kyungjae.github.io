import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

/** Room furniture and a small Nagano bear plush, all in the room fade hierarchy. */
export function createRoomProps(){
 const group=new T.Group();group.name='computer-and-bear';
 const wood=new T.MeshStandardMaterial({color:'#b58a62',roughness:.8});
 const dark=new T.MeshStandardMaterial({color:'#263d42',roughness:.55});
 const ivory=new T.MeshStandardMaterial({color:'#f5eddf',roughness:.85});
 const cloth=new T.MeshStandardMaterial({color:'#fffaf0',roughness:1});
 const black=new T.MeshStandardMaterial({color:'#171b1c',roughness:.94});
 const add=(parent:T.Group,geometry:T.BufferGeometry,material:T.MeshStandardMaterial,p:number[],scale?:number[])=>{const mesh=new T.Mesh(geometry,material);mesh.position.set(...p as [number,number,number]);if(scale)mesh.scale.set(...scale as [number,number,number]);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
 const box=(parent:T.Group,w:number,h:number,d:number,mat:T.MeshStandardMaterial,p:number[],r=.035)=>add(parent,new RoundedBoxGeometry(w,h,d,3,r),mat,p);
 const desk=new T.Group();desk.name='computer-desk';desk.position.set(3.1,0,-4.75);desk.rotation.y=.18;group.add(desk);
 box(desk,2.85,.14,1.12,wood,[0,1.12,0],.06);
 for(const x of [-1.22,1.22])for(const z of [-.41,.41])box(desk,.095,1.05,.095,wood,[x,.53,z],.02);
 // Monitor on a weighted stand, keyboard, mouse and a separate small tower.
 box(desk,.48,.045,.32,dark,[-.46,1.215,-.1]);box(desk,.10,.36,.10,dark,[-.46,1.40,-.17]);
 box(desk,1.58,.98,.105,dark,[-.46,1.90,-.22],.045);
 const display=new T.MeshStandardMaterial({color:'#173d4b',emissive:'#377c88',emissiveIntensity:.35,roughness:.6});
 box(desk,1.45,.84,.018,display,[-.46,1.91,-.156],.025);
 const code=new T.MeshStandardMaterial({color:'#a9ddd1',emissive:'#7bb9ad',emissiveIntensity:.2,roughness:.7});
 const accent=new T.MeshStandardMaterial({color:'#e8bf83',roughness:.7});
 box(desk,.30,.67,.012,dark,[-.99,1.92,-.14],.008);
 for(let i=0;i<7;i++){const width=[.55,.73,.40,.64,.33,.57,.46][i];box(desk,width,.025,.012,i%3===0?accent:code,[-.72+width/2,2.20-i*.088,-.14],.006);}
 box(desk,1.10,.055,.30,ivory,[-.49,1.225,.30],.028);
 for(let row=0;row<3;row++)for(let col=0;col<11;col++)box(desk,.066,.012,.062,dark,[-.94+col*.09,1.26,.20+row*.075],.009);
 add(desk,new T.SphereGeometry(1,20,12),ivory,[.31,1.255,.30],[.075,.045,.12]);
 box(desk,.43,.73,.65,ivory,[.96,.40,-.04],.055);box(desk,.33,.58,.015,dark,[.96,.43,.295],.035);
 for(const y of [.30,.54])add(desk,new T.TorusGeometry(.095,.012,8,32),code,[.96,y,.31]);
 // Soft head/body volumes and embroidered face follow the official plush reference.
 const bear=new T.Group();bear.name='nagano-bear-plush';bear.position.set(.94,1.20,.03);bear.rotation.y=.22;desk.add(bear);
 const ball=(p:number[],scale:number[],mat=cloth)=>add(bear,new T.SphereGeometry(1,40,28),mat,p,scale);
 ball([0,.30,0],[.29,.32,.23]);ball([0,.79,0],[.40,.37,.29]);
 for(const side of [-1,1]){ball([side*.29,1.095,-.01],[.105,.13,.075]);ball([side*.30,.36,.02],[.085,.16,.10]);ball([side*.18,.07,.12],[.115,.075,.15]);ball([side*.107,.83,.282],[.023,.023,.012],black);}
 const faceZ=(x:number,y:number)=>.29*Math.sqrt(Math.max(.01,1-(x/.40)**2-((y-.79)/.37)**2))+.008;
 const nose=new T.Shape();nose.moveTo(-.035,.018);nose.quadraticCurveTo(0,.035,.035,.018);nose.lineTo(.014,-.027);nose.quadraticCurveTo(0,-.04,-.014,-.027);nose.closePath();
 add(bear,new T.ExtrudeGeometry(nose,{depth:.009,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:2,steps:1}),black,[0,.735,faceZ(0,.735)]);
 const mouth=new T.CatmullRomCurve3([[-.10,.68],[-.075,.648],[-.035,.648],[0,.677],[.035,.648],[.075,.648],[.10,.68]].map(([x,y])=>new T.Vector3(x,y,faceZ(x,y))));
 add(bear,new T.TubeGeometry(mouth,40,.012,8,false),black,[0,0,0]);
 // Chair is a distinct raycast target, aligned with the monitor and keyboard.
 const chair=new T.Group();chair.name='computer-chair';chair.position.set(-.46,0,1.58);desk.add(chair);
 const upholstery=new T.MeshStandardMaterial({color:'#527c78',roughness:.95});
 box(chair,1.95,.20,1.7,upholstery,[0,.72,0],.10);
 box(chair,1.95,1.55,.20,upholstery,[0,1.42,.94],.10);
 for(const side of [-1,1]){box(chair,.12,.58,.12,dark,[side*.94,.99,.05]);box(chair,.18,.12,.95,wood,[side*.94,1.24,.05],.06);}
 box(chair,.15,.59,.15,dark,[0,.35,0]);
 for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const leg=box(chair,.10,.09,.75,dark,[Math.sin(a)*.31,.10,Math.cos(a)*.31]);leg.rotation.y=a;add(chair,new T.SphereGeometry(.10,12,8),dark,[Math.sin(a)*.65,.08,Math.cos(a)*.65]);}
 group.updateMatrixWorld(true);
 const seat=chair.localToWorld(new T.Vector3(0,-.10,-.05));
 const approach=chair.localToWorld(new T.Vector3(-1.15,0,.45));
 const monitor=desk.localToWorld(new T.Vector3(-.46,1.91,-.13));
 const normal=new T.Vector3(Math.sin(desk.rotation.y),0,Math.cos(desk.rotation.y));
 return {root:group,chair,seat,approach,monitor,normal,facing:Math.PI+desk.rotation.y};
}
