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
   <div className="sky-bear sky-bear-sprite"/>
  </div>
  <svg className="sky-farewell-star" viewBox="0 0 40 40"><path d="M20 0L24 16L40 20L24 24L20 40L16 24L0 20L16 16Z" fill="#fff2c0"/></svg>
 </div>;
}
