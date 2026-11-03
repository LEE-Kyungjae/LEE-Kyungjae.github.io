'use client';
import {useRef,type CSSProperties} from 'react';
import {projectDetails,type ProjectId} from './projectDetails';

export default function ProjectCover({project,name,status,number,visible,calm}:{project:ProjectId;name:string;status:string;number:string;visible:boolean;calm:boolean}){
 const host=useRef<HTMLDivElement>(null);
 const reset=()=>{host.current?.style.setProperty('--look-x','0');host.current?.style.setProperty('--look-y','0');};
 return <div ref={host} className={`project-cinema cinema-${project}`} data-visible={visible} inert={!visible} aria-hidden={!visible}
  onPointerMove={e=>{if(calm||!visible||e.pointerType!=='mouse')return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--look-x',String((e.clientX-r.left)/r.width*2-1));e.currentTarget.style.setProperty('--look-y',String((e.clientY-r.top)/r.height*2-1));}}
  onPointerLeave={reset}>
  <div className="cinema-depth" aria-hidden="true">
   <img className="cinema-background" src={`/assets/projects/keyart-20261027/layers/${project}-background.webp`} alt="" width="1774" height="887" loading="eager" draggable={false}/>
   <div className="cinema-orbits"><i/><i/><i/></div>
   <img className="cinema-subject" src={`/assets/projects/keyart-20261027/layers/${project}-subject.webp`} alt="" width="1774" height="887" loading="eager" draggable={false}/>
   <div className="cinema-dust">{Array.from({length:22},(_,i)=><i key={i} style={{'--x':`${(i*37)%100}%`,'--y':`${(i*23)%96}%`,'--delay':`${-i*.83}s`,'--duration':`${5+i%6}s`} as CSSProperties}/>)}</div>
  </div>
  <div className="cinema-vignette" aria-hidden="true"/>
  <div className="cinema-copy"><span className="cinema-index">{number} / {status}</span><h2 aria-label={name}>{name.split('').map((letter,i)=><span aria-hidden="true" key={i} style={{'--letter':i} as CSSProperties}>{letter}</span>)}</h2><p className="cinema-product-definition">{projectDetails[project].description}</p><span className="cinema-rule"/><span className="cinema-scroll-cue" aria-hidden="true">↓</span></div>
  <div className="cinema-shutter" aria-hidden="true"/>
 </div>;
}
