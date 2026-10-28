'use client';
import {useEffect,useState} from 'react';
import EngineeringPractice from './EngineeringPractice';
import PointerEffects from './PointerEffects';
export default function BackendIntroduction(){
 const [calm,setCalm]=useState(false);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>setCalm(media.matches);sync();media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync);},[]);
 return <main className={`portfolio project-introduction backend-introduction ${calm?'is-calm':''}`}><PointerEffects calm={calm}/><a className="scene-back" href="/#brain" aria-label="뇌로 돌아가기">←</a><button className="project-motion" aria-label="모션 줄이기" aria-pressed={calm} onClick={()=>setCalm(v=>!v)}>{calm?'Ⅱ':'◌'}</button><EngineeringPractice calm={calm}/></main>;
}
