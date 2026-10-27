'use client';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

export default function ProjectArtwork({ project, number, status, calm, detail = false }: {detail?: boolean; project: 'palamedes' | 'gahyeon'; number: string; status: string; calm: boolean}) {
  const Heading = detail ? 'h1' : 'h2';
  const host = useRef<HTMLAnchorElement>(null);
  const gesture = useRef<{x:number;y:number}|null>(null);
  const dragged = useRef(false);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const element = host.current!;
    let inView = false, frame=0;
    const paint=()=>{
      frame=0;
      const rect=element.getBoundingClientRect();
      const p=calm?.5:Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height)));
      const t=p-.5;
      element.style.setProperty('--camera-rx',`${-t*5}deg`);
      element.style.setProperty('--camera-ry',`${t*3}deg`);
      element.style.setProperty('--camera-x',`${t*-12}px`);
      element.style.setProperty('--camera-y',`${t*32}px`);
      element.style.setProperty('--subject-y',`${t*-30}px`);
      element.dataset.scrollProgress=p.toFixed(4);
    };
    const schedule=()=>{if(inView&&!document.hidden&&!frame)frame=requestAnimationFrame(paint);};
    const visibility=()=>{setActive(inView&&!document.hidden);schedule();};
    const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;visibility();},{threshold:0});
    observer.observe(element);document.addEventListener('visibilitychange',visibility);
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);paint();
    return()=>{observer.disconnect();cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
  },[calm]);
  const name = project === 'palamedes' ? 'Palamedes' : 'Gahyeon';
  const [displayName,setDisplayName]=useState(name);
  const scrambled=useRef(false);
  useEffect(()=>{
    if(!active||scrambled.current)return;
    scrambled.current=true;
    if(calm){setDisplayName(name);return;}
    const started=performance.now(),glyphs='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%/';
    const timer=window.setInterval(()=>{
      const elapsed=performance.now()-started,locked=Math.floor(elapsed/800*name.length);
      setDisplayName(name.split('').map((letter,i)=>i<locked?letter:glyphs[Math.floor(Math.random()*glyphs.length)]).join(''));
      if(elapsed>=800){setDisplayName(name);window.clearInterval(timer);}
    },40);
    return()=>{window.clearInterval(timer);setDisplayName(name);};
  },[active,calm,name]);

  return <a ref={host} href={detail?'#project-content':`/projects/${project}/`} className={`splash-card splash-${project}`} data-animate={active && !calm} aria-label={`${name} 소개`}
    onPointerDown={e=>{gesture.current={x:e.clientX,y:e.clientY};dragged.current=false;}}
    onPointerMove={e=>{if(gesture.current&&Math.hypot(e.clientX-gesture.current.x,e.clientY-gesture.current.y)>8)dragged.current=true;}}
    onPointerUp={()=>{gesture.current=null;}} onPointerCancel={()=>{gesture.current=null;dragged.current=true;}}
    onClick={e=>{if(dragged.current&&e.detail!==0)e.preventDefault();dragged.current=false;}} onDragStart={e=>e.preventDefault()}>
    <span className="splash-scene" aria-hidden="true"><span className="splash-camera">
      <img className="splash-layer splash-background" src={`/assets/projects/keyart-20261027/layers/${project}-background.webp`} alt="" loading="lazy" width="1774" height="887" draggable={false}/>
      <span className="splash-particles splash-particles-back">{Array.from({length:28},(_,i)=><i key={i} style={{'--x':`${24+(i*29)%74}%`,'--y':`${8+(i*37)%85}%`,'--size':`${i%5===0?5:2}px`,'--delay':`${-i*.73}s`,'--duration':`${5+i%7}s`,'--drift':`${-35+(i*17)%80}px`} as CSSProperties}/>)}</span>
      <img className="splash-layer splash-subject" src={`/assets/projects/keyart-20261027/layers/${project}-subject.webp`} alt="" loading="lazy" width="1774" height="887" draggable={false}/>
      <span className="splash-particles splash-particles-front">{Array.from({length:20},(_,i)=><i key={i} style={{'--x':`${18+(i*23)%80}%`,'--y':`${10+(i*31)%80}%`,'--size':`${i%4===0?7:3}px`,'--delay':`${-i*1.13}s`,'--duration':`${3.8+i%5}s`,'--drift':`${-40+(i*19)%85}px`} as CSSProperties}/>)}</span>
    </span></span>
    <span className="splash-shade" aria-hidden="true"/>
    <span className="splash-light" aria-hidden="true"/>
    <span className="splash-index">{number}</span>
    <span className="splash-title"><span className="splash-status">{status}</span><Heading aria-label={name}><b className="project-codename" aria-hidden="true"><b className="codename-width">{name}</b><b className="codename-live">{displayName}</b></b><span aria-hidden="true">↗</span></Heading><span className="splash-title-rule" aria-hidden="true"/></span>
    <span className="splash-corner" aria-hidden="true">↗</span>
  </a>;
}
