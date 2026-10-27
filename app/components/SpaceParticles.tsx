'use client';
import {useEffect,useRef} from 'react';
/** Distant star layers and a near-field linked network, drawn behind the 3D scene. */
export default function SpaceParticles({brain,calm}:{brain:boolean;calm:boolean}){
 const host=useRef<HTMLCanvasElement>(null),state=useRef({brain,calm});state.current={brain,calm};
 useEffect(()=>{
  const canvas=host.current!,ctx=canvas.getContext('2d');if(!ctx)return;
  let width=1,height=1,frame=0,last=0,clock=0,visible=true,blend=0;
  const mouse={x:-1000,y:-1000};
  let seed=17027;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  const stars=Array.from({length:230},()=>({x:random(),y:random(),z:.25+random()*.75,phase:random()*6.28}));
  const nodes=Array.from({length:65},()=>({x:random(),y:random(),vx:(random()-.5)*.018,vy:(random()-.5)*.018,phase:random()*6.28}));
  const resize=()=>{width=canvas.clientWidth;height=canvas.clientHeight;const dpr=Math.min(devicePixelRatio,1.5);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);};
  const pointer=(e:PointerEvent)=>{const r=canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;};
  const leave=()=>{mouse.x=mouse.y=-1000;};
  const draw=(now:number)=>{
   frame=0;if(!visible||document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;
   if(!state.current.calm)clock+=dt;
   blend+=((state.current.brain?1:0)-blend)*Math.min(1,dt*2.8);
   ctx.clearRect(0,0,width,height);
   for(const star of stars){const x=(star.x*width+clock*star.z*1.6)%width,y=star.y*height;const alpha=.22+star.z*.5+(state.current.calm?0:Math.sin(clock*.6+star.phase)*.12);ctx.fillStyle=`rgba(211,230,255,${alpha})`;ctx.beginPath();ctx.arc(x,y,.45+star.z*.9,0,Math.PI*2);ctx.fill();}
   if(blend>.01){
    const count=width<600?38:nodes.length,points=nodes.slice(0,count).map(n=>{
     let x=((n.x+clock*n.vx)%1+1)%1*width,y=((n.y+clock*n.vy)%1+1)%1*height;
     if(!state.current.calm){const dx=x-mouse.x,dy=y-mouse.y,d=Math.hypot(dx,dy);if(d<140&&d>0){const push=(1-d/140)*18;x+=dx/d*push;y+=dy/d*push;}}
     return {x,y};
    });
    const limit=width<600?110:175;
    for(let i=0;i<points.length;i++){
     const p=points[i];for(let j=i+1;j<points.length;j++){const q=points[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<limit){ctx.strokeStyle=`rgba(117,204,220,${(1-d/limit)*.34*blend})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}
     ctx.fillStyle=`rgba(166,240,240,${.72*blend})`;ctx.beginPath();ctx.arc(p.x,p.y,1.6,0,Math.PI*2);ctx.fill();
    }
   }
   canvas.dataset.network=blend.toFixed(2);frame=requestAnimationFrame(draw);
  };
  const resume=()=>{if(visible&&!document.hidden&&!frame){last=performance.now();frame=requestAnimationFrame(draw);}};
  const observer=new ResizeObserver(resize);observer.observe(canvas);const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else resume();});intersection.observe(canvas);
  window.addEventListener('pointermove',pointer,{passive:true});window.addEventListener('blur',leave);document.addEventListener('visibilitychange',resume);resize();resume();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();window.removeEventListener('pointermove',pointer);window.removeEventListener('blur',leave);document.removeEventListener('visibilitychange',resume);};
 },[]);
 return <canvas ref={host} className="space-particles" aria-hidden="true"/>;
}
