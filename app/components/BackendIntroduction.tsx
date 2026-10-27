'use client';
import {useEffect,useState} from 'react';
import EngineeringPractice from './EngineeringPractice';
import PointerEffects from './PointerEffects';
export default function BackendIntroduction(){
 const [calm,setCalm]=useState(false);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>setCalm(media.matches);sync();media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync);},[]);
 return <main className={`portfolio project-introduction ${calm?'is-calm':''}`}><PointerEffects calm={calm}/><header className="portfolio-header"><a className="portfolio-logo" href="/#brain">← 프로젝트 선택</a><div className="header-tools"><button aria-label="모션 줄이기" aria-pressed={calm} onClick={()=>setCalm(v=>!v)}>{calm?'Ⅱ':'◌'}</button></div></header><EngineeringPractice calm={calm}/></main>;
}
