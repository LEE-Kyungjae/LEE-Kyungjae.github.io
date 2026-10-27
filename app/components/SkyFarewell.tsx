'use client';
import {useEffect,useState} from 'react';

/** A brief sky vignette, paused outside the room and for reduced motion. */
export default function SkyFarewell({enabled,calm}:{enabled:boolean;calm:boolean}){
 const [active,setActive]=useState(false),[cycle,setCycle]=useState(0);
 useEffect(()=>{
  setActive(false);
  if(!enabled||calm)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let timer:ReturnType<typeof setTimeout>;
  const schedule=(delay:number)=>{clearTimeout(timer);if(document.hidden||reduced.matches)return;timer=setTimeout(()=>{setCycle(n=>n+1);setActive(true);timer=setTimeout(()=>{setActive(false);schedule(34000);},7400);},delay);};
  const reset=()=>{clearTimeout(timer);setActive(false);schedule(6500);};
  document.addEventListener('visibilitychange',reset);reduced.addEventListener('change',reset);schedule(6500);
  return()=>{clearTimeout(timer);document.removeEventListener('visibilitychange',reset);reduced.removeEventListener('change',reset);};
 },[enabled,calm]);
 if(!enabled||calm||!active)return null;
 return <div className="sky-farewell" key={cycle} aria-hidden="true">
  <div className="sky-comet"><span/><i/></div>
  <div className="sky-bear-flight">
   <svg className="sky-bear" viewBox="0 0 180 180" fill="none">
    <g fill="#fff9ed" stroke="#464c4c" strokeWidth="2.1" strokeLinejoin="round">
     <ellipse cx="89" cy="131" rx="33" ry="33"/>
     <ellipse cx="68" cy="159" rx="14" ry="8"/><ellipse cx="110" cy="159" rx="14" ry="8"/>
     <ellipse cx="58" cy="128" rx="10" ry="19" transform="rotate(20 58 128)"/>
     <g className="sky-bear-wave">
      <path d="M115 119Q135 126 140 105Q145 93 136 91Q127 88 123 105L115 109Z"/>
      <path d="M139 99L144 58Q154 53 169 64L162 103Q151 90 139 99Z" fill="#fffdf7"/>
      <path d="M145 67Q153 64 161 72M144 78Q150 77 159 83" stroke="#b9d3cc" strokeWidth="1.4"/>
     </g>
     <ellipse cx="57" cy="43" rx="12" ry="15"/>
     <ellipse cx="118" cy="43" rx="12" ry="15"/>
     <path d="M45 72C45 44 60 39 88 39C116 39 133 46 133 75C133 104 116 113 88 113C60 113 44 104 45 72Z"/>
    </g>
    <g fill="#333a3b"><circle cx="74" cy="75" r="2.8"/><circle cx="103" cy="75" r="2.8"/><path d="M84 84Q89 81 94 84L90 89Q89 90 88 89Z"/></g>
    <path d="M77 90Q78 100 89 92Q99 100 101 90" stroke="#333a3b" strokeWidth="2.4" strokeLinecap="round"/>
   </svg>
  </div>
  <svg className="sky-farewell-star" viewBox="0 0 40 40"><path d="M20 0L24 16L40 20L24 24L20 40L16 24L0 20L16 16Z" fill="#fff2c0"/></svg>
 </div>;
}
