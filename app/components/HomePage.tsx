'use client';
import {useEffect,useRef,useState} from 'react';
import RoomExperience from './RoomExperience';
import ProjectArtwork from './ProjectArtwork';
import PointerEffects from './PointerEffects';
import {projectDetails} from './projectDetails';
const ids=['palamedes','gahyeon','backend'] as const;
export default function HomePage({language}:{language:'ko'|'en'}){
 const [calm,setCalm]=useState(false),[selected,setSelected]=useState<number|null>(null);
 const [travelling,setTravelling]=useState(false);
 const transition=useRef(0),frame=useRef(0),selection=useRef<HTMLDivElement>(null);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>setCalm(media.matches);sync();media.addEventListener('change',sync);return()=>{media.removeEventListener('change',sync);cancelAnimationFrame(frame.current);};},[]);
 useEffect(()=>{const syncHash=()=>{const hash=location.hash.slice(1);const index=ids.indexOf(hash as typeof ids[number]);if(index>=0||['systems','experience'].includes(hash)){setSelected(index>=0?index:hash==='experience'?2:0);requestAnimationFrame(()=>requestAnimationFrame(()=>selection.current?.scrollIntoView({behavior:'instant'})));}};syncHash();window.addEventListener('hashchange',syncHash);return()=>window.removeEventListener('hashchange',syncHash);},[]);
 useEffect(()=>{if(selected!==null)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old;};},[selected]);
 const travel=(target:number,done:()=>void)=>{
  cancelAnimationFrame(frame.current);const token=++transition.current,start=scrollY,began=performance.now();setTravelling(true);
  const tick=(now:number)=>{if(token!==transition.current)return;const t=calm?1:Math.min(1,(now-began)/1100);const ease=t*t*t*(t*(t*6-15)+10);window.scrollTo({top:start+(target-start)*ease,behavior:'instant'});if(t<1)frame.current=requestAnimationFrame(tick);else{setTravelling(false);done();}};
  frame.current=requestAnimationFrame(tick);
 };
 const choose=(index:number)=>{if(travelling)return;setSelected(index);history.replaceState(null,'',`#${ids[index]}`);requestAnimationFrame(()=>requestAnimationFrame(()=>travel(selection.current?.offsetTop??innerHeight,()=>selection.current?.querySelector<HTMLAnchorElement>('.splash-card')?.focus({preventScroll:true}))));};
 const back=()=>{if(travelling)return;travel(0,()=>{setSelected(null);history.replaceState(null,'',location.pathname);document.querySelector<HTMLButtonElement>('.room-brain-nodes button')?.focus({preventScroll:true});});};
 const project=selected===0?'palamedes':'gahyeon';
 return <main lang={language} className={`portfolio room-portfolio ${calm?'is-calm':''} ${selected===null?'in-world':'world-open'}`}>
  <PointerEffects calm={calm}/>
  <RoomExperience calm={calm} onSelect={choose}/>
  <button className="world-motion" aria-label="모션 줄이기" aria-pressed={calm} onClick={()=>setCalm(v=>!v)}>{calm?'Ⅱ':'◌'}</button>
  {selected!==null&&<button className="selected-back" onClick={back} disabled={travelling} aria-label="뇌로 돌아가기">↑ 뇌로 돌아가기</button>}
  <div ref={selection} className="world-projects selected-project" hidden={selected===null} data-selected={selected===null?'none':ids[selected]}>
   {selected!==null&&<article className="work-card" id={ids[selected]} key={selected}>
    {selected===2?<a className="splash-card backend-card" href="/projects/backend/" aria-label="Backend 소개"><span className="backend-card-art" aria-hidden="true"><img src="/assets/projects/engineering-20261027/sky/runtime-island.webp" alt="" draggable={false}/><img src="/assets/projects/engineering-20261027/layers/runtime.webp" alt="" draggable={false}/></span><span className="splash-index">03</span><span className="splash-title"><h2>Backend</h2><span className="splash-title-rule"/></span><span className="splash-corner">↗</span></a>:<ProjectArtwork project={project} number={projectDetails[project].number} status={projectDetails[project].status} calm={calm}/>}
    <div className="work-card-info"><p>{selected===2?'Java와 Spring 기반 서버 개발':projectDetails[project].description}</p></div>
   </article>}
  </div>
 </main>;
}
