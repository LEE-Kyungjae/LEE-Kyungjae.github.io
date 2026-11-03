'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import gate from '../../assets/projects/product-cases-20261030/palamedes.json';
import runtime from '../../assets/projects/product-cases-20261030/gahyeon.json';
import type {ProjectId} from './projectDetails';

export default function RecordedCase({project}:{project:ProjectId}){
 const [step,setStep]=useState(0),[playing,setPlaying]=useState(false),host=useRef<HTMLDivElement>(null),manual=useRef(false);
 const pal=project==='palamedes';
 const labels=pal?['제안 생성 후 증거 수정','변경된 증거로 적용 요청','유효한 증거로 재검토·적용']:['기존 응답 수락','새 발화','이전 응답 재도착'];
 useEffect(()=>{let raf=0;const paint=()=>{raf=0;if(manual.current||!host.current)return;const r=host.current.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(innerHeight*.82-r.top)/(innerHeight*.72)));setStep(Math.min(2,Math.floor(progress*3)));};const queue=()=>{if(!raf)raf=requestAnimationFrame(paint);};addEventListener('scroll',queue,{passive:true});paint();return()=>{removeEventListener('scroll',queue);cancelAnimationFrame(raf);};},[]);
 useEffect(()=>{if(!playing)return;let timer:ReturnType<typeof setTimeout>|undefined;const schedule=()=>{clearTimeout(timer);if(!host.current||document.hidden)return;const r=host.current.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;timer=setTimeout(()=>{if(step===2)setPlaying(false);else setStep(s=>s+1);},1200);};schedule();addEventListener('scroll',schedule,{passive:true});document.addEventListener('visibilitychange',schedule);return()=>{clearTimeout(timer);removeEventListener('scroll',schedule);document.removeEventListener('visibilitychange',schedule);};},[playing,step]);
 const select=(n:number)=>{manual.current=true;setPlaying(false);setStep(n);};
 return <div ref={host} className={`recorded-case recorded-${project}`} data-step={step} style={{'--record-step':step} as CSSProperties}>
  <div className="recorded-heading"><span>실제 재현 기록 · 2026.10.30</span><button onClick={()=>{manual.current=true;if(!playing)setStep(0);setPlaying(p=>!p);}} aria-pressed={playing}>{playing?'일시 정지':'재현 기록 재생'}<span aria-hidden="true">{playing?'Ⅱ':'▷'}</span></button></div>
  {pal?<div className="recorded-ledger">
   <div className="ledger-evidence"><small>증거 파일</small><strong>runtime.json</strong><div className="hash-comparison"><code>SHA-256</code><span data-matched={step===2}>{step===2?'일치':'불일치'}</span></div><div className="ledger-lines" aria-hidden="true"><i/><i/><i/><i/></div></div>
   <div className="ledger-gate"><span className="gate-symbol" aria-hidden="true">{step===2?'✓':step===1?'×':'·'}</span><output aria-live="polite">{step===0?'증거 변경':step===1?'적용 거부':'재검토·적용'}</output><small>{step===1?gate.error.split(':')[0]:step===2?'기존 기록 유지':'적용 전 검사'}</small></div>
   <div className="ledger-history"><small>변경 이력</small><div><code>01</code><b>{gate.originalStatus}</b><span>기존 기록</span></div><div data-present={step===2}><code>02</code><b>{step===2?gate.latestStatus:'—'}</b><span>{step===2?'추가된 기록':'기록 추가 없음'}</span></div><output>{step===2?gate.recordsAfterApply:gate.recordsAfterRejection} {step===2?'records':'record'}</output></div>
  </div>:<div className="recorded-generations">
   <div className="generation-current"><small>현재 대화</small><strong>GEN {step===0?runtime.firstGeneration:runtime.currentGeneration}</strong><span>{step===0?'SpeechStarted':runtime.phase}</span></div>
   <div className="generation-tracks"><div className="generation-track" data-rejected={step===2}><code>GEN {runtime.firstGeneration}</code><div className="track-rail"><i/><span>SpeechStarted</span></div><output>{step===2?String(runtime.lateSpeechAccepted):step===0?String(runtime.firstSpeechAccepted):'취소'}</output></div><div className="generation-track" data-current={step>0}><code>GEN {runtime.currentGeneration}</code><div className="track-rail"><i/><span>{runtime.phase}</span></div><output>{step>0?'현재 대화':'대기'}</output></div></div>
  </div>}
  <ol className="recorded-steps">{labels.map((label,i)=><li key={label} data-active={step===i}><button aria-pressed={step===i} onClick={()=>select(i)}><span>0{i+1}</span>{label}</button></li>)}</ol>
  <label className="recorded-scrubber"><span>재현 단계</span><input type="range" min="0" max="2" step="1" value={step} onChange={e=>select(Number(e.target.value))} aria-valuetext={labels[step]}/><output>0{step+1} / 03</output></label>
 </div>;
}
