'use client';
import {useEffect,useRef,useState,type CSSProperties,type RefObject} from 'react';
import GitHubLink from './GitHubLink';
import GahyeonCharacter from './GahyeonCharacter';

type Phase='대기'|'응답 준비'|'응답 표현'|'저장 완료'|'연결 해제';
export default function VoiceScene({phase,sceneRef,calm,beats}:{phase:number;sceneRef:RefObject<HTMLElement|null>;calm:boolean;beats:string[][]}){
 const [manual,setManual]=useState(false),[connected,setConnected]=useState(true),[state,setState]=useState<Phase>('대기'),[generation,setGeneration]=useState(0),[cancelled,setCancelled]=useState<number|null>(null),[memory,setMemory]=useState(0),[delay,setDelay]=useState(2);
 const [visible,setVisible]=useState(false);
 const epoch=useRef(0),timers=useRef<ReturnType<typeof setTimeout>[]>([]);
 const clear=()=>{timers.current.forEach(clearTimeout);timers.current=[];};
 useEffect(()=>()=>{timers.current.forEach(clearTimeout);++epoch.current;},[]);
 useEffect(()=>{const node=sceneRef.current;if(!node)return;const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting));observer.observe(node);return()=>observer.disconnect();},[sceneRef]);
 const takeControl=()=>{if(manual)return;setManual(true);epoch.current=phase>=2?2:1;setGeneration(epoch.current);setMemory(phase===3?1:0);};
 const speak=()=>{takeControl();clear();if(state==='응답 준비'||state==='응답 표현'||!manual&&phase===2)setCancelled(epoch.current);const current=++epoch.current;setGeneration(current);setState('응답 준비');timers.current.push(setTimeout(()=>{if(epoch.current!==current)return;setState('응답 표현');timers.current.push(setTimeout(()=>{if(epoch.current!==current)return;setState('저장 완료');setMemory(n=>n+1);},1600));},delay*1000));};
 const toggleConnection=()=>{takeControl();clear();if(connected){if(state==='응답 준비'||state==='응답 표현')setCancelled(epoch.current);++epoch.current;setState('연결 해제');}else setState('대기');setConnected(v=>!v);};
 const visual=manual?state:['대기','응답 준비','응답 표현','저장 완료'][phase];
 const shownGen=manual?generation:phase>=2?2:1,shownMemory=manual?memory:phase===3?1:0,old=cancelled??(!manual&&phase===2?1:null);
 return <section ref={sceneRef} className="causal-scroll voice-scene" data-phase={phase} data-state={visual} data-connected={connected} data-manual={manual} data-cancelled={old!==null} data-visible={visible} aria-label="가현 발화 처리 체험">
  <div className="causal-pin voice-pin">
   <img className="voice-room-art" src="/assets/projects/voice-scene-20261030/background.webp" alt=""/>
   <div className="voice-room-shade"/>
   <span className="scene-kind">처리 예시 · 음성·모델·서버 미연결</span>
   <div className="scene-copy voice-copy">{beats.map((beat,i)=><div className="scene-beat" data-active={phase===i} key={beat[0]}><div className="scene-counter"><span>0{i+1} / 04</span><span>{beat[0]}</span></div><h2>{beat[1]}</h2><p>{beat[2]}</p></div>)}<div className="scene-progress" aria-hidden="true"><i/></div></div>
   <div className="voice-canvas">
    <svg className="voice-routes" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="voice-in"><stop stopColor="#6fb7b4" stopOpacity="0"/><stop offset="1" stopColor="#b4e7d7"/></linearGradient><linearGradient id="voice-out"><stop stopColor="#d5bc88"/><stop offset="1" stopColor="#d5bc88" stopOpacity="0"/></linearGradient></defs><path className="input-route" d="M35 245C125 245 160 115 350 115"/><path className="output-route" d="M350 145C420 145 440 200 570 200"/><path className="discard-route" d="M350 145C430 145 450 350 570 350"/><circle className="input-end" cx="350" cy="115" r="5"/></svg>
    <div className="voice-input" data-active={connected}><span>발화 입력</span><div className="input-wave" aria-hidden="true">{Array.from({length:17},(_,i)=><i key={i} style={{'--wave':i,'--wave-height':`${8+(i*13)%31}px`} as CSSProperties}/>)}</div><code>GEN {shownGen}</code></div>
    <figure className="voice-character"><div className="character-light"/><GahyeonCharacter/><figcaption>기존 3D 모델·대기 모션 · 배경은 생성 이미지</figcaption></figure>
    <div className="voice-response" data-running={visual==='응답 준비'||visual==='응답 표현'}>
     <div className="voice-response-top"><span>{connected?'Unreal ↔ Core':'Unreal ⨯ Core'}</span><code>GEN {shownGen}</code></div>
     <output className="voice-status" aria-live="polite">{!connected?'연결 해제':visual==='대기'?'발화 대기':visual}</output>
     <div className="voice-processing"><div><span>반응</span><b>{connected?'Listening / Behavior':'연결 대기'}</b><i className="reaction-pulse"/></div><div><span>답변</span><b>{visual==='응답 준비'?'생성 중':visual==='응답 표현'?'현재 응답 표현':visual==='저장 완료'?'처리 완료':'대기'}</b><div className="voice-progress-bar"><i key={`${generation}-${visual}`} style={{animationDuration:`${delay}s`}}/></div></div></div>
     <div className="voice-cancelled" data-visible={old!==null} aria-live="polite"><span>{old!==null?`GEN ${old}`:'이전 응답'}</span><b>{old!==null?'취소 · 늦은 결과 폐기':'현재 generation만 처리'}</b></div>
     <label className="voice-delay">응답 지연 예시 <output>{delay.toFixed(1)}초</output><input type="range" min="1" max="5" step=".5" value={delay} onChange={e=>setDelay(Number(e.target.value))}/></label>
     <div className="voice-buttons"><button disabled={!connected} onClick={speak}>{state==='응답 준비'||state==='응답 표현'?'새 발화로 중단':'발화 시작'}</button><button onClick={toggleConnection}>{connected?'연결 끊기':'다시 연결'}</button></div>
    </div>
   </div>
   <img className="voice-foreground" src="/assets/projects/voice-scene-20261030/foreground.webp" alt=""/>
   <div className="voice-storage"><div><small>저장된 대화</small><strong>{shownMemory}</strong></div><span className="storage-link" aria-hidden="true"/><div><small>ACK</small><strong>{40+shownMemory}</strong></div><span>{connected?'적용·저장 후 ACK 갱신':'연결 해제 · 저장 상태 유지'}</span></div>
   <div className="scene-foot"><span>{calm?'모션 감소':''}</span><GitHubLink href="https://github.com/LEE-Kyungjae/Gahyeon/blob/0edd9c93d13f654b3b80f347ed6bdfae287c677c/docs/ARCHITECTURE.md">설계 근거</GitHubLink></div>
  </div>
 </section>;
}
