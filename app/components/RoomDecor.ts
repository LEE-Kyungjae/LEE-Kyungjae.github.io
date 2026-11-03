import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

/** Wall-mounted details leave the central walking area clear. No new UI copy. */
export function createRoomDecor(){
 const root=new T.Group();root.name='studio-details';
 const materials={wood:new T.MeshStandardMaterial({color:'#b88961',roughness:.75}),cream:new T.MeshStandardMaterial({color:'#f2e6cb',roughness:.85}),teal:new T.MeshStandardMaterial({color:'#437b78',roughness:.8}),navy:new T.MeshStandardMaterial({color:'#233d55',roughness:.85}),gold:new T.MeshStandardMaterial({color:'#dfb86a',metalness:.25,roughness:.5}),coral:new T.MeshStandardMaterial({color:'#c77d65',roughness:.85})};
 const mesh=(g:T.BufferGeometry,m:T.Material,x:number,y:number,z:number,parent=root)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
 const box=(w:number,h:number,d:number,m:T.Material,x:number,y:number,z:number,parent=root)=>mesh(new RoundedBoxGeometry(w,h,d,2,.025),m,x,y,z,parent);
 // Shallow wall panelling adds depth without crowding the floor.
 box(11.8,1.25,.07,materials.teal,0,.65,-5.82);
 box(.07,1.25,11.8,materials.teal,-5.82,.65,0);
 box(11.8,.07,.13,materials.wood,0,1.30,-5.77);
 box(.13,.07,11.8,materials.wood,-5.77,1.30,0);
 for(let i=0;i<12;i++){
  box(.025,1.15,.025,materials.cream,-5.5+i,.65,-5.77);
  box(.025,1.15,.025,materials.cream,-5.77,.65,-5.5+i);
 }
 // Constellation study above the low cabinet, on the back wall.
 box(2.55,2.05,.12,materials.wood,-2.65,3.75,-5.75);
 box(2.38,1.88,.04,materials.navy,-2.65,3.75,-5.67);
 const points=[[-.85,.45],[-.35,.65],[.25,.38],[.65,.6],[.82,-.2],[.15,-.45],[-.45,-.25]];
 points.forEach(([x,y])=>mesh(new T.SphereGeometry(.045,8,6),materials.cream,x-2.65,y+3.75,-5.62));
 for(let i=1;i<points.length;i++){
  const a=new T.Vector3(points[i-1][0]-2.65,points[i-1][1]+3.75,-5.62),b=new T.Vector3(points[i][0]-2.65,points[i][1]+3.75,-5.62);
  mesh(new T.CylinderGeometry(.009,.009,a.distanceTo(b),6),materials.gold,...a.clone().add(b).multiplyScalar(.5).toArray() as [number,number,number]).quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.sub(a).normalize());
 }
 // Cabinet tucked outside the character's walking bounds.
 box(2.9,1.25,.65,materials.wood,-2.65,.60,-5.38);
 for(const x of [-3.37,-1.93]){box(1.35,1.05,.04,materials.cream,x,.61,-5.03);box(.09,.09,.06,materials.gold,x+.4,.65,-4.99);}
 // Books and a ringed planet on a left-wall shelf.
 const shelf=new T.Group();shelf.position.set(-5.65,0,-1.75);shelf.rotation.y=Math.PI/2;root.add(shelf);
 box(3.1,.12,.7,materials.wood,0,3.1,0,shelf);
 for(let i=0;i<6;i++){const h=.48+(i%3)*.13;box(.16,h,.37,[materials.teal,materials.coral,materials.cream][i%3],-.95+i*.19,3.16+h/2,0,shelf);box(.12,.025,.01,materials.gold,-.95+i*.19,3.30,.19,shelf);}
 mesh(new T.SphereGeometry(.29,24,16),materials.gold,.86,3.56,0,shelf);
 const ring=mesh(new T.TorusGeometry(.43,.025,8,40),materials.cream,.86,3.56,0,shelf);ring.rotation.x=1.1;ring.rotation.y=.35;
 box(.40,.06,.35,materials.navy,.86,3.20,0,shelf);
 // Window trim and sill; existing glazing stays visible.
 box(2.55,.12,.34,materials.wood,2.6,2.55,-5.65);
 for(const x of [1.42,3.78])box(.10,2.0,.16,materials.wood,x,3.5,-5.67);
 box(2.46,.1,.16,materials.wood,2.6,4.48,-5.67);
 // Fine floor seams, kept below the rug and above the floor surface.
 const seam=new T.MeshStandardMaterial({color:'#cbbca4',roughness:1});
 for(let i=0;i<11;i++)box(.018,.006,11.75,seam,-5+i,-.052,0);
 return root;
}
