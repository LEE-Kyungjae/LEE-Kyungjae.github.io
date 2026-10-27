'use client';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

export default function ProjectArtwork({ project, number, status, calm }: {project: 'palamedes' | 'gahyeon'; number: string; status: string; calm: boolean}) {
  const host = useRef<HTMLAnchorElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const element = host.current!;
    let inView = false;
    const update = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); }, {threshold: .05});
    observer.observe(element); document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  const name = project === 'palamedes' ? 'Palamedes' : 'Gahyeon';
  return <a ref={host} href={`https://github.com/LEE-Kyungjae/${project}`} className={`splash-card splash-${project}`} data-animate={active && !calm} aria-label={`${name} GitHub`}>
    <img className="splash-art" src={`/assets/projects/keyart-20261027/${project}.webp`} alt="" loading="lazy" width="1774" height="887" draggable={false}/>
    <span className="splash-shade" aria-hidden="true"/>
    <span className="splash-light" aria-hidden="true"/>
    <span className="splash-particles" aria-hidden="true">{Array.from({length:22}, (_,i) => <i key={i} style={{'--x':`${35+(i*29)%63}%`,'--y':`${12+(i*37)%78}%`,'--size':`${i%5===0?4:2}px`,'--delay':`${-(i*1.71)}s`,'--duration':`${5+(i%7)*.8}s`,'--drift':`${15+(i*11)%45}px`} as CSSProperties}/>)}</span>
    <span className="splash-index">{number}</span>
    <span className="splash-title"><span className="splash-status">{status}</span><h2>{name}<span>↗</span></h2><span className="splash-title-rule" aria-hidden="true"/></span>
    <span className="splash-corner" aria-hidden="true">↗</span>
  </a>;
}
