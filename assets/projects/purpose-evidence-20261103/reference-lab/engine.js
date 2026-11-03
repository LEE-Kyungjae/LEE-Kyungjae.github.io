/* Reusable interaction assets. See techniques.html for parameters and contracts. */
const T=THREE, mode=document.body.dataset.mode;
const CONFIG=window.CONFIG={damping:5.5,pointerParallax:.65,orbitSensitivity:.006,orbitFriction:4,driveAcceleration:9,driveDrag:1.7,driveSteering:1.9,maxSpeed:12,followDamping:4};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
// Frame-rate independent exponential follow. Same time constant at 60/120 Hz.
function damp(a,b,lambda,dt){return T.MathUtils.lerp(a,b,1-Math.exp(-lambda*dt))}
let renderer;
try{renderer=new T.WebGLRenderer({canvas:document.querySelector('#world'),antialias:true,alpha:false})}catch(e){document.body.insertAdjacentHTML('beforeend','<div class="error">3D 화면을 시작하지 못했습니다. Chrome의 그래픽 가속을 확인해 주세요. <a href="index.html">목록으로</a></div>');throw e}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
const scene=new T.Scene(),camera=new T.PerspectiveCamera(45,innerWidth/innerHeight,.1,180);
const palettes={lusion:[0x11131b,0xa7a6ee],igloo:[0x163b50,0x9ceaff],unseen:[0x23352d,0xffbd82],bruno:[0xd9c9ac,0xff794e]};
const [bg,accent]=palettes[mode];scene.background=new T.Color(bg);scene.fog=new T.FogExp2(bg,mode==='igloo'?.025:.012);
scene.add(new T.HemisphereLight(mode==='unseen'?0xece8bb:0xe5f3ff,0x303137,2.4));
const sun=new T.DirectionalLight(0xffffff,4);sun.position.set(7,15,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30});scene.add(sun);
const fill=new T.PointLight(accent,50,40);fill.position.set(-5,3,4);scene.add(fill);
function mat(color,opts={}){return new T.MeshStandardMaterial({color,roughness:.35,metalness:.15,...opts})}
function mesh(geo,material,x=0,y=0,z=0,parent=scene){const o=new T.Mesh(geo,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function box(w,h,d,color,x,y,z,parent=scene){return mesh(new T.BoxGeometry(w,h,d),mat(color),x,y,z,parent)}
function label(text,x,y,z,size=3){const c=document.createElement('canvas');c.width=768;c.height=192;const a=c.getContext('2d');a.fillStyle=mode==='bruno'?'#39443b':'#e8faff';a.font='bold 65px Arial';a.textAlign='center';a.fillText(text,384,110);const texture=new T.CanvasTexture(c),s=new T.Sprite(new T.SpriteMaterial({map:texture,depthTest:true}));s.position.set(x,y,z);s.scale.set(size,size/4,1);scene.add(s);return s}
function ground(color){const f=mesh(new T.PlaneGeometry(220,220),mat(color,{roughness:.86,metalness:.05}),0,-.08,0);f.rotation.x=-Math.PI/2;return f}
let scroll=0,targetScroll=0,time=0,last=performance.now(),pointer=new T.Vector2(),orbit=0,orbitTarget=0,orbitVelocity=0,drag=false,moved=0,downX=0,downY=0,previousX=0,previousTime=0,paused=false,sound=false,audio;
const items=[],hotspots=[],ray=new T.Raycaster(),cursor=new T.Vector2();
const keys=new Set();let speed=0,heading=Math.PI;const carPosition=new T.Vector3(0,0,0),follow=new T.Vector3(8,10,12);let car;
const canvas=renderer.domElement;
function updateScroll(){targetScroll=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)}
addEventListener('scroll',updateScroll,{passive:true});updateScroll();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);updateScroll()});
addEventListener('pointermove',e=>{pointer.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2);if(drag){const now=performance.now(),dx=e.clientX-previousX;orbitTarget-=dx*CONFIG.orbitSensitivity;orbitVelocity=clamp(-dx*CONFIG.orbitSensitivity/Math.max(.008,(now-previousTime)/1000),-2.5,2.5);previousX=e.clientX;previousTime=now;moved=Math.hypot(e.clientX-downX,e.clientY-downY)}});
canvas.addEventListener('pointerdown',e=>{if(mode!=='unseen')return;drag=true;moved=0;downX=previousX=e.clientX;downY=e.clientY;previousTime=performance.now();orbitVelocity=0;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointerup',e=>{drag=false;if(mode==='unseen'&&moved<8)pick(e)});canvas.addEventListener('pointercancel',()=>{drag=false;orbitVelocity=0});
function pick(e){cursor.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);ray.setFromCamera(cursor,camera);const hit=ray.intersectObjects(hotspots,false)[0];if(hit)openProject(hit.object.userData.index)}
function openProject(index){const data=[['EMBER','빛의 온도','표면의 거칠기와 따뜻한 점광원으로 숲 속 발광체를 표현합니다.'],['TIDE','움직이는 균형','관성 드래그로 시점을 바꾸고, 물체를 선택해 기록을 엽니다.'],['SEED','작은 가능성','동일한 장면 안에서 카메라와 콘텐츠가 연결되는 공간형 목차입니다.']][index%3];const d=document.querySelector('dialog');d.querySelector('h2').textContent=data[0];d.querySelector('p').textContent=data[1]+' — '+data[2];d.showModal();ping(220+index*110)}
window.openProject=openProject;
document.querySelector('dialog button')?.addEventListener('click',()=>document.querySelector('dialog').close());
function ping(freq){if(!sound)return;audio??=new AudioContext();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.08,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.65);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+.7)}
document.querySelector('#sound')?.addEventListener('click',e=>{sound=!sound;e.currentTarget.textContent=sound?'소리 켜짐':'소리 꺼짐';e.currentTarget.setAttribute('aria-pressed',sound);ping(330)});
document.querySelector('#pause')?.addEventListener('click',e=>{paused=!paused;e.currentTarget.textContent=paused?'움직임 재개':'자동 움직임 멈춤';e.currentTarget.setAttribute('aria-pressed',paused)});
function resetCar(){carPosition.set(0,0,0);speed=0;heading=Math.PI;keys.clear()}
document.querySelector('#reset')?.addEventListener('click',resetCar);
addEventListener('keydown',e=>{if(document.querySelector('dialog')?.open)return;if(e.target.closest('button,a,input'))return;if(mode==='bruno'&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key.toLowerCase());if(e.key.toLowerCase()==='r')resetCar();if(mode==='unseen'){if(e.key==='ArrowLeft')orbitTarget+=.25;if(e.key==='ArrowRight')orbitTarget-=.25;if(['1','2','3'].includes(e.key))openProject(Number(e.key)-1)}});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>{keys.clear();drag=false;orbitVelocity=0});
document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();keys.add(b.dataset.key);b.setPointerCapture(e.pointerId)});for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,()=>keys.delete(b.dataset.key))});
let sculpture,shards=[],islandObjects=[],wheels=[];
if(mode==='lusion'){
 ground(0x121520);sculpture=new T.Group();scene.add(sculpture);sculpture.position.set(2,2,0);
 for(let i=0;i<5;i++){const o=mesh(new T.TorusGeometry(1.8-i*.22,.18,24,100),mat([0xced0ed,0xa795e9,0x788bca,0xf2cbb4,0xa2cfc5][i],{metalness:.8,roughness:.2}),0,0,0,sculpture);o.rotation.set(i*.6,i*.7,i*.15);items.push(o)}
 for(let i=0;i<60;i++){const a=i*2.399,r=4+(i%7)*.35;const o=mesh(new T.IcosahedronGeometry(.06+(i%4)*.02,0),mat(0x9ca7d9),Math.cos(a)*r,1+(i%9)*.45,Math.sin(a)*r);shards.push(o)}
 label('FORM / 01',2,-.01,2,3);
}else if(mode==='igloo'){
 ground(0x234959);
 for(let i=0;i<65;i++){const z=8-i*.95,x=(i%2?1:-1)*(3.3+(Math.sin(i*8)+1)*3),h=1.5+(Math.sin(i*1.7)+1)*3;const o=mesh(new T.ConeGeometry(.6+(i%3)*.2,h,5),mat(i%3?0xa3daea:0x658ca6,{roughness:.14,metalness:.45,flatShading:true}),x,h/2,z);o.rotation.z=Math.sin(i)*.18;shards.push(o)}
 for(let i=0;i<5;i++){const o=mesh(new T.TorusGeometry(3.5,.055,12,80),mat(0xc5f8ff,{emissive:0x65cbe0,emissiveIntensity:1.5}),0,2.5,-i*10);o.rotation.z=i*.3;items.push(o);label(['ARRIVAL','THRESHOLD','THE CORE','BEYOND','STILLNESS'][i],0,4.6,-i*10,4)}
 const core=mesh(new T.IcosahedronGeometry(1.1,0),mat(0xe5faff,{metalness:.65,roughness:.12}),0,2,-26);items.push(core);
}else if(mode==='unseen'){
 ground(0x344b3d);
 for(let i=0;i<80;i++){const a=i*2.399,r=12+(i%9)*1.1,x=Math.cos(a)*r,z=Math.sin(a)*r,h=5+i%7;mesh(new T.CylinderGeometry(.1,.35,h,6),mat(0x253d2d),x,h/2,z);mesh(new T.ConeGeometry(2.5,h*.8,7),mat(i%2?0x304d36:0x4d603d),x,h*.85,z)}
 for(let i=0;i<3;i++){const a=i*Math.PI*2/3,x=Math.sin(a)*5,z=Math.cos(a)*5;mesh(new T.CylinderGeometry(1.5,2.2,.8,7),mat(0x536b50),x,.4,z);const o=mesh(i===0?new T.TorusKnotGeometry(.65,.22,90,12):i===1?new T.IcosahedronGeometry(.9,0):new T.SphereGeometry(.8,24,16),mat([0xf5b587,0xa7ccdf,0xe2ca7c][i],{emissive:[0x7b3615,0x234756,0x625219][i],emissiveIntensity:.7}),x,2.2,z);o.userData.index=i;hotspots.push(o);items.push(o);label(['EMBER','TIDE','SEED'][i],x,3.6,z,2.4)}
 const dust=new Float32Array(240*3);for(let i=0;i<240;i++){dust[i*3]=Math.sin(i*172.7)*16;dust[i*3+1]=.8+(i%50)/10;dust[i*3+2]=Math.cos(i*32.3)*16}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(dust,3));scene.add(new T.Points(geo,new T.PointsMaterial({color:0xffdd9b,size:.045,transparent:true,opacity:.8})));
}else{
 ground(0xd9c9ac);const road=mesh(new T.PlaneGeometry(5,75),mat(0xa7aa91,{roughness:1}),0,.005,-15);road.rotation.x=-Math.PI/2;
 for(let i=0;i<24;i++)box(.12,.015,.8,0xf8efcf,0,.02,12-i*2.5);
 const destinations=[[-7,-6,'STUDIO'],[8,-16,'GALLERY'],[-7,-29,'CONTACT']];
 destinations.forEach(([x,z,title],i)=>{box(6,.25,5,0xf3dbb4,x,.12,z);box(3,2.5,2.5,[0xd28161,0x718d8c,0xaaa06a][i],x,1.5,z);box(3.4,.25,2.9,0xf3e8cb,x,2.9,z);label(title,x,4,z,4);hotspots.push({x,z,title,index:i})});
 for(let i=0;i<45;i++){const x=(i%2?1:-1)*(13+(i%7)*2),z=12-i*1.2;mesh(new T.CylinderGeometry(.12,.2,1.3,6),mat(0x786b4f),x,.65,z);mesh(new T.IcosahedronGeometry(1+(i%3)*.2,0),mat(i%2?0x829578:0xa4aa77),x,2,z)}
 car=new T.Group();scene.add(car);box(1.4,.5,2.3,0xed754f,0,.65,0,car);box(1.15,.5,1.1,0xf5af75,0,1.1,-.1,car);box(1.17,.31,.04,0x415d62,0,1.15,.47,car);for(const x of [-.73,.73])for(const z of [-.72,.72]){const w=mesh(new T.CylinderGeometry(.34,.34,.22,16),mat(0x303b37),x,.35,z,car);w.rotation.z=Math.PI/2;wheels.push(w)}for(const x of [-.45,.45])box(.25,.15,.06,0xffe5a3,x,.72,1.18,car);
}
// Camera rail: world stays fixed; position AND look target move along the corridor.
function updateCameraRail(p,dt){const z=10-p*49,x=Math.sin(p*Math.PI*2)*1.3,y=2.5+Math.sin(p*Math.PI)*1.2;camera.position.set(x+pointer.x*.18,y+pointer.y*.12,z);camera.lookAt(Math.sin((p+.07)*Math.PI*2)*.8,2,z-9)}
// Drag inertia: release velocity integrates into target angle then decays exponentially.
function updateOrbit(dt){if(!drag){orbitTarget+=orbitVelocity*dt;orbitVelocity*=Math.exp(-CONFIG.orbitFriction*dt)}orbit=damp(orbit,orbitTarget,CONFIG.damping,dt);camera.position.set(Math.sin(orbit)*12,4.2+pointer.y*.3,Math.cos(orbit)*12);camera.lookAt(0,1.9,0)}
// Arcade vehicle: acceleration + drag + speed-dependent steering, bounded world, chase camera.
function updateVehicle(dt){const forward=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0),steer=(keys.has('a')||keys.has('arrowleft')?1:0)-(keys.has('d')||keys.has('arrowright')?1:0);speed+=forward*CONFIG.driveAcceleration*dt;speed*=Math.exp(-(keys.has(' ')?8:CONFIG.driveDrag)*dt);speed=clamp(speed,-CONFIG.maxSpeed*.5,CONFIG.maxSpeed);heading+=steer*CONFIG.driveSteering*clamp(speed/4,-1,1)*dt;carPosition.x=clamp(carPosition.x+Math.sin(heading)*speed*dt,-21,21);carPosition.z=clamp(carPosition.z+Math.cos(heading)*speed*dt,-39,16);car.position.copy(carPosition);car.rotation.y=heading;wheels.forEach(w=>w.rotation.x+=speed*dt*2);const desired=new T.Vector3(carPosition.x+9,10,carPosition.z+12);follow.lerp(desired,1-Math.exp(-CONFIG.followDamping*dt));camera.position.copy(follow);camera.lookAt(carPosition.x,0,carPosition.z-1);const near=hotspots.find(o=>Math.hypot(o.x-carPosition.x,o.z-carPosition.z)<5);document.querySelector('#status').textContent=near?near.title+' — Enter로 열기':Math.round(Math.abs(speed)*12)+' km/h';if(near&&keys.has('enter')){keys.delete('enter');openProject(near.index)}}
function frame(now){const dt=Math.min(.04,(now-last)/1000);last=now;if(!paused&&!reduced)time+=dt;scroll=reduced?targetScroll:damp(scroll,targetScroll,CONFIG.damping,dt);
 if(mode==='lusion'){sculpture.rotation.set(scroll*2.1,time*.13+scroll*5,.2+Math.sin(time*.2)*.1);sculpture.position.set(2-scroll*3,2.2+Math.sin(scroll*7)*.6,-scroll*2);items.forEach((o,i)=>{o.rotation.x=i*.6+time*.12*(i%2?1:-1);o.rotation.z=i*.15+scroll*i*.7});camera.position.set(pointer.x*CONFIG.pointerParallax+Math.sin(scroll*3)*2,3.5+pointer.y*.4,11-scroll*3);camera.lookAt(0,2,-scroll*2);shards.forEach((o,i)=>o.position.y=1+(i%9)*.45+Math.sin(time+i)*.15)}
 if(mode==='igloo'){updateCameraRail(scroll,dt);items.at(-1).rotation.y=time*.25}
 if(mode==='unseen'){updateOrbit(dt);items.forEach((o,i)=>{o.rotation.y=time*.25+i;o.position.y=2.2+Math.sin(time+i*2)*.16})}
 if(mode==='bruno')updateVehicle(dt);
 renderer.render(scene,camera);document.querySelector('.progress').style.transform=`scaleX(${scroll})`;window.labState={mode,scroll,camera:camera.position.toArray(),orbit,car:carPosition.toArray(),speed,frames:(window.labState?.frames||0)+1};requestAnimationFrame(frame)}
requestAnimationFrame(frame);
window.lab={CONFIG,scene,camera,renderer,updateCameraRail,updateOrbit,updateVehicle,damp,resetCar};
