'use client';
import {useEffect,useRef,useState} from 'react';
import ProjectCover from './ProjectCover';
import ProjectStory from './ProjectStory';
import {projectDetails,type ProjectId} from './projectDetails';
import './project-development.css';
export default function ProjectIntroduction({project}:{project:ProjectId}){
 const page=useRef<HTMLElement>(null);
 const data=projectDetails[project],host=useRef<HTMLDivElement>(null),[calm,setCalm]=useState(false);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>setCalm(media.matches);sync();media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync);},[]);
 useEffect(()=>{let frame=0;const paint=()=>{frame=0;const el=host.current;if(!el)return;const p=Math.max(0,Math.min(1,-el.getBoundingClientRect().top/innerHeight));el.style.setProperty('--cover-progress',String(p));};const queue=()=>{if(!frame)frame=requestAnimationFrame(paint);};addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);paint();return()=>{cancelAnimationFrame(frame);removeEventListener('scroll',queue);removeEventListener('resize',queue);};},[]);
 useEffect(()=>{const root=page.current;if(!root)return;const items=root.querySelectorAll('.project-result,.case-intro,.case-decision,.case-observations>li,.project-verification,.delivery-scope,.gahyeon-delivery,.recorded-case');const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.setAttribute('data-arrived','true');io.unobserve(entry.target);}});},{threshold:.08});items.forEach(e=>io.observe(e));return()=>io.disconnect();},[project]);
 return <main ref={page} onPointerMove={e=>{if(calm||e.pointerType!=='mouse')return;const panel=(e.target as HTMLElement).closest<HTMLElement>('.plan-artifact,.character-exhibit,.recorded-case');if(!panel)return;const r=panel.getBoundingClientRect();panel.style.setProperty('--focus-x',`${e.clientX-r.left}px`);panel.style.setProperty('--focus-y',`${e.clientY-r.top}px`);}} className={`focused-project focused-${project} ${calm?'is-calm':''}`}>
  <a className="project-brain-back" href="/#brain" aria-label="뇌로 돌아가기">←</a>
  <div className="focused-cover" ref={host}><ProjectCover project={project} name={data.name} status={data.status} number={data.number} visible calm={calm}/></div>
  <div className="project-spec-strip"><span>{data.status}</span><ul>{data.stack.map(item=><li key={item}>{item}</li>)}</ul></div>
  <ProjectStory project={project} calm={calm}/>
 </main>;
}
