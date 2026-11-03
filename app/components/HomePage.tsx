'use client';
import {useCallback,useEffect,useState} from 'react';
import RoomExperience from './RoomExperience';
import PointerEffects from './PointerEffects';
import {brainProjects} from './brainProjects';
export default function HomePage({language}:{language:'ko'|'en'}){
 const [calm,setCalm]=useState(false);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>setCalm(media.matches);sync();media.addEventListener('change',sync);const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{media.removeEventListener('change',sync);document.body.style.overflow=old;};},[]);
 const choose=useCallback((index:number)=>{const project=brainProjects[index];if(project)location.assign(`/projects/${project.id}/`);},[]);
 return <main lang={language} className={`portfolio room-portfolio in-world ${calm?'is-calm':''}`}>
  <PointerEffects calm={calm}/><RoomExperience calm={calm} onSelect={choose}/>
  <button className="world-motion" aria-label="모션 줄이기" aria-pressed={calm} onClick={()=>setCalm(v=>!v)}>{calm?'Ⅱ':'◌'}</button>
 </main>;
}
