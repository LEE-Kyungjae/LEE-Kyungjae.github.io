'use client';
import {useEffect,useRef,useState} from 'react';
import ProjectArtwork from './ProjectArtwork';
import PointerEffects from './PointerEffects';
import {projectDetails,type ProjectId} from './projectDetails';
type DiagramWindow=Window & {Archify?:{motionGovernor?:{setMode:(mode:string,options?:{persist:boolean})=>string}}};
export default function ProjectIntroduction({project}:{project:ProjectId}){
 const data=projectDetails[project],other=project==='palamedes'?'gahyeon':'palamedes';
 const [calm,setCalm]=useState(false),[selected,setSelected]=useState(0),[playing,setPlaying]=useState(false),[exception,setException]=useState(false);
 const buttons=useRef<(HTMLButtonElement|null)[]>([]),diagram=useRef<HTMLIFrameElement>(null),hero=useRef<HTMLDivElement>(null);
 const chapter=data.chapters[selected],count=data.chapters.length;
 const blocked=exception&&selected===2;
 const output=blocked?(project==='palamedes'?'증거가 달라져 적용 거부. 최신 증거로 제안을 다시 검토합니다.':'새 대화 번호로 전환. 이전 응답과 준비된 음성은 재생하지 않습니다.'):chapter.output;
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setCalm(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 useEffect(()=>{if(!playing||calm)return;const timer=setTimeout(()=>{if(selected===count-1||blocked)setPlaying(false);else setSelected(i=>i+1);},2400);return()=>clearTimeout(timer);},[playing,calm,selected,count,blocked]);
 useEffect(()=>{if(calm)setPlaying(false);const doc=diagram.current?.contentDocument;if(doc)doc.documentElement.dataset.portfolioMotion=calm?'still':'flow';(diagram.current?.contentWindow as DiagramWindow|null)?.Archify?.motionGovernor?.setMode(calm?'still':'live',{persist:false});},[calm]);
 useEffect(()=>{let frame=0;const paint=()=>{frame=0;const el=hero.current;if(!el)return;const r=el.getBoundingClientRect();el.style.setProperty('--reveal',String(calm?0:Math.max(0,Math.min(1,-r.top/Math.max(1,r.height-innerHeight)))));};const schedule=()=>{if(!frame)frame=requestAnimationFrame(paint);};window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);paint();return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};},[calm]);
 const select=(i:number)=>{setSelected(i);setPlaying(false);};
 const enhanceDiagram=()=>{const doc=diagram.current?.contentDocument;if(!doc)return;(diagram.current?.contentWindow as DiagramWindow|null)?.Archify?.motionGovernor?.setMode(calm?'still':'live',{persist:false});doc.documentElement.dataset.portfolioMotion=calm?'still':'flow';if(doc.getElementById('portfolio-flow-style'))return;const style=doc.createElement('style');style.id='portfolio-flow-style';style.textContent=`html body svg path[data-edge-from][data-edge-to]{stroke-dasharray:6 7!important;stroke-linecap:round;animation:portfolio-flow 1.5s linear infinite!important}@keyframes portfolio-flow{from{stroke-dashoffset:26}to{stroke-dashoffset:0}}html[data-portfolio-motion=still] body svg path[data-edge-from][data-edge-to],html[data-motion=still] body svg path[data-edge-from][data-edge-to],html[data-document-hidden=true] body svg path[data-edge-from][data-edge-to]{animation-play-state:paused!important}@media(prefers-reduced-motion:reduce){html body svg path[data-edge-from][data-edge-to]{animation:none!important}}`;doc.head.append(style);};
 return <main className={`portfolio project-introduction project-case-study ${calm?'is-calm':''}`}>
  <PointerEffects calm={calm}/>
  <header className="portfolio-header"><a className="portfolio-logo" href="/#brain">← 프로젝트 선택</a><nav aria-label="프로젝트"><a href={data.repository}>GitHub ↗</a></nav><div className="header-tools"><button onClick={()=>setCalm(v=>!v)} aria-pressed={calm} aria-label="모션 줄이기">{calm?'Ⅱ':'◌'}</button></div></header>
  <div className="project-intro-hero" ref={hero}><div className="project-hero-pin"><ProjectArtwork project={project} number={data.number} status={data.status} calm={calm} detail/></div></div>
  <section id="project-content" className="project-content">
   <div className="project-overview"><p className="project-summary">{data.description}</p><div><h2>만드는 이유</h2><p>{data.problem}</p><h2>설계와 구현</h2><p>{data.scope}</p><ul className="project-stack">{data.stack.map(s=><li key={s}>{s}</li>)}</ul></div></div>
   <div className={`project-explorer explorer-${project}`}>
    <div className="project-flow-toolbar"><h2>처리 흐름 예시</h2><div><label><input type="checkbox" checked={exception} onChange={e=>{setException(e.target.checked);select(2);}}/>{project==='palamedes'?'검토 후 증거 변경':'응답 중 새 질문'}</label><button onClick={()=>{if(selected===count-1||blocked)setSelected(0);setPlaying(v=>!v);}} disabled={calm}>{playing?'일시정지':'자동 재생'}</button></div></div>
    <div className="project-chapters" role="tablist" aria-label="처리 단계">{data.chapters.map((item,i)=><button key={item.label} id={`chapter-${i}`} ref={el=>{buttons.current[i]=el;}} role="tab" aria-selected={selected===i} aria-controls="project-chapter-panel" tabIndex={selected===i?0:-1} onClick={()=>select(i)} onKeyDown={e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%count;else if(e.key==='ArrowLeft')next=(i+count-1)%count;else if(e.key==='Home')next=0;else if(e.key==='End')next=count-1;else return;e.preventDefault();select(next);buttons.current[next]?.focus();}}><span>0{i+1}</span>{item.label}{i<count-1&&<i className="chapter-flow" aria-hidden="true"/>}</button>)}</div>
    <div className="project-chapter-content" role="tabpanel" id="project-chapter-panel" aria-labelledby={`chapter-${selected}`} tabIndex={0}>
     <div className="project-chapter-visual"><div className="project-chapter-art" key={chapter.asset+selected} aria-hidden="true"><div className="project-orbit"/><img className="project-island" src={`/assets/projects/engineering-20261027/sky/${chapter.asset}-island.webp`} alt="" draggable={false}/><img src={`/assets/projects/engineering-20261027/layers/${chapter.asset}.webp`} width="1024" height="1024" alt="" draggable={false}/><span className="project-art-glow"/></div><div className={`project-io ${blocked?'is-interrupted':''}`} aria-live="polite"><div><span>입력</span><p>{chapter.input}</p></div><svg viewBox="0 0 100 35" aria-hidden="true"><path d="M50 0V35"/></svg><div><span>{blocked?'변경 처리':'출력'}</span><p>{output}</p></div></div></div>
     <div className="project-chapter-copy" key={chapter.title}><h2>{chapter.title}</h2><p>{chapter.body}</p><ul>{chapter.facts.map(fact=><li key={fact}>{fact}</li>)}</ul><a className="project-source" href={chapter.url} target="_blank" rel="noopener noreferrer">구현 코드와 문서 ↗</a></div>
    </div>
   </div>
   <section className="architecture-section" aria-label="프로젝트 구조"><div className="architecture-heading"><h2>{data.architectureTitle}</h2><button onClick={()=>void diagram.current?.parentElement?.requestFullscreen?.().catch(()=>{})}>크게 보기 ↗</button></div><div className="architecture-frame"><iframe ref={diagram} onLoad={enhanceDiagram} title={`${data.name} 인터랙티브 구조도`} src={`/assets/projects/architecture-20261027/${project}.html`} loading="lazy"/></div></section>
  </section>
  <footer className="project-next"><a href="/#brain">← 프로젝트 선택</a><a href={`/projects/${other}/`}>{projectDetails[other].name} →</a></footer>
 </main>;
}
