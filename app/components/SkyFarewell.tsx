'use client';
import {useEffect,useState,type CSSProperties} from 'react';

const SKY_DURATION=7400;

/** A brief sky vignette, paused outside the room and for reduced motion. */
export default function SkyFarewell({enabled,calm}:{enabled:boolean;calm:boolean}){
 const [active,setActive]=useState(false),[cycle,setCycle]=useState(0);
 useEffect(()=>{
  setActive(false);
  if(!enabled||calm)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let timer:ReturnType<typeof setTimeout>;
  const schedule=(delay:number)=>{clearTimeout(timer);if(document.hidden||reduced.matches)return;timer=setTimeout(()=>{setCycle(n=>n+1);setActive(true);timer=setTimeout(()=>{setActive(false);schedule(34000);},SKY_DURATION);},delay);};
  const reset=()=>{clearTimeout(timer);setActive(false);schedule(6500);};
  document.addEventListener('visibilitychange',reset);reduced.addEventListener('change',reset);schedule(6500);
  return()=>{clearTimeout(timer);document.removeEventListener('visibilitychange',reset);reduced.removeEventListener('change',reset);};
 },[enabled,calm]);
 if(!enabled||calm||!active)return null;
 return <div className="sky-farewell" key={cycle} style={{'--sky-duration':`${SKY_DURATION}ms`} as CSSProperties} aria-hidden="true">
  <div className="sky-bear-flight">
   <svg className="sky-bear-rig" viewBox="0 0 640 640">
    <defs><clipPath id="bear-body"><path d="M0 0H490V307L476 325L430 389L455 415V640H0Z"/></clipPath><clipPath id="bear-arm"><path d="M430 389L476 307L493 307L493 0H640V640H455V415Z"/></clipPath></defs>
    <image href="/assets/projects/bear-farewell-20261027/wave.png" width="1280" height="1280" clipPath="url(#bear-body)"/>
    <g className="sky-bear-hand"><image href="/assets/projects/bear-farewell-20261027/wave.png" width="1280" height="1280" clipPath="url(#bear-arm)"/></g>
   </svg>
   <svg className="sky-farewell-star" viewBox="0 0 40 40"><path d="M20 0L24 16L40 20L24 24L20 40L16 24L0 20L16 16Z" fill="#fff2c0"/></svg>
   <div className="sky-comet"><span/><i/></div>
  </div>
 </div>;
}
