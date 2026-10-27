'use client';
import {useEffect,useRef,useState} from 'react';
import ProjectArtwork from './ProjectArtwork';
import PointerEffects from './PointerEffects';
import {projectDetails,type ProjectId} from './projectDetails';
export default function ProjectIntroduction({project}:{project:ProjectId}){
 const data=projectDetails[project],other=project==='palamedes'?'gahyeon':'palamedes';
 const [calm,setCalm]=useState(false),[selected,setSelected]=useState(0);
 const buttons=useRef<(HTMLButtonElement|null)[]>([]);
 const chapter=data.chapters[selected];
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setCalm(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 return <main className={`portfolio project-introduction ${calm?'is-calm':''}`}>
  <PointerEffects calm={calm}/>
  <header className="portfolio-header"><a className="portfolio-logo" href={`/#${project}`}>← 카드로 돌아가기</a><nav aria-label="프로젝트"><a href={`/#${project}`}>선택한 카드</a><a href={`https://github.com/LEE-Kyungjae/${project}`}>GitHub ↗</a></nav><div className="header-tools"><button onClick={()=>setCalm(v=>!v)} aria-pressed={calm} aria-label="모션 줄이기">{calm?'Ⅱ':'◌'}</button></div></header>
  <div className="project-intro-hero"><ProjectArtwork project={project} number={data.number} status={data.status} calm={calm} detail/></div>
  <section id="project-content" className="project-content"><p className="project-summary">{data.description}</p>
   <div className={`project-explorer explorer-${project}`}>
    <div className="project-chapters" role="tablist" aria-label="구현 사례">{data.chapters.map((item,i)=><button key={item.label} id={`chapter-${i}`} ref={el=>{buttons.current[i]=el;}} role="tab" aria-selected={selected===i} aria-controls="project-chapter-panel" tabIndex={selected===i?0:-1} onClick={()=>setSelected(i)} onKeyDown={e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%3;else if(e.key==='ArrowLeft')next=(i+2)%3;else if(e.key==='Home')next=0;else if(e.key==='End')next=2;else return;e.preventDefault();setSelected(next);buttons.current[next]?.focus();}}><span>0{i+1}</span>{item.label}</button>)}</div>
    <div className="project-chapter-content" role="tabpanel" id="project-chapter-panel" aria-labelledby={`chapter-${selected}`} tabIndex={0}>
     <div className="project-chapter-art" key={chapter.asset+selected} aria-hidden="true"><div className="project-orbit"/><img src={`/assets/projects/engineering-20261027/layers/${chapter.asset}.webp`} width="1024" height="1024" alt="" draggable={false}/><span className="project-art-glow"/></div>
     <div className="project-chapter-copy" key={chapter.title}><h2>{chapter.title}</h2><p>{chapter.body}</p><ul>{chapter.facts.map(fact=><li key={fact}>{fact}</li>)}</ul><a className="project-source" href={chapter.url} target="_blank" rel="noopener noreferrer">{chapter.source} ↗</a></div>
    </div>
   </div>
   <section className="architecture-section" aria-label="프로젝트 구조">
    <div className="architecture-heading"><h2>프로젝트 구조</h2><a href={`/assets/projects/architecture-20261027/${project}.html`} target="_blank" rel="noopener noreferrer">크게 보기 ↗</a></div>
    <div className="architecture-frame"><iframe title={`${data.name} 인터랙티브 구조도`} src={`/assets/projects/architecture-20261027/${project}.html`} loading="lazy"/></div>
   </section>
  </section>
  <footer className="project-next"><a href={`/#${project}`}>← 선택한 카드</a><a href={`/projects/${other}/`}>{projectDetails[other].name} →</a></footer>
 </main>;
}
