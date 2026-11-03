'use client';
import CoreFeatureEvidence from './CoreFeatureEvidence';
import GitHubLink from './GitHubLink';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import ProjectOutcome from './ProjectOutcome';
import ProjectResult from './ProjectResult';
import VoiceScene from './VoiceScene';
import PalamedesLayers from './PalamedesLayers';
import './project-expansion.css';
import {projectDetails,type ProjectId} from './projectDetails';

const cases=[
 {signal:'검색 순위가 올라도, 구현 선택이 나아졌다는 증거는 없다.',choice:2,mission:'동일한 예산으로 구현 선택 비교',reason:'분석기를 키우기 전에 참고 자료의 실제 효과부터 검증합니다.'},
 {signal:'비교 실험에서 최신 자료가 없는 경우에만 선택이 나빠졌다.',choice:1,mission:'자료의 최신성부터 보완',reason:'관찰된 병목이 자료 누락이므로 수집 범위를 먼저 검토합니다.'},
 {signal:'자료는 충분하지만 파일 사이의 관계를 놓쳐 선택이 나빠졌다.',choice:0,mission:'파일 간 관계 분석 보완',reason:'자료를 더 모으기보다 관계를 해석하는 단계를 검토합니다.'},
];
const alternatives=['분석기 확장','수집 범위 확대','비교 실험'];
const palBeats=[
 ['상태 변경 예시','근거 검토와 미션 저장','개발자와 AI 에이전트가 구현할 목표를 검토하는 도구입니다. 문제와 참고 자료를 입력하고, 후보 목표를 비교한 뒤 선택 이유와 작업 범위를 저장합니다.'],
 ['후보 비교','증거에 따른 목표 선택','분석기 확장, 자료 수집, 비교 실험을 후보로 비교합니다. 관찰된 문제에 따라 우선 검토할 목표와 선택 근거가 달라집니다.'],
 ['미션 저장','선택 근거와 제외 범위','선택한 목표, 판단 근거, 제외할 작업을 미션으로 기록합니다. 증거 조건을 바꾸면 후보 선택과 문서 내용이 함께 바뀝니다.'],
 ['변경 검증','증거 재검토와 변경 이력','검토 후 증거가 바뀌면 저장을 거부합니다. 현재 증거를 다시 검토한 뒤 저장하면 새 버전이 추가되고, 이전 판단은 이력에 남습니다.'],
];
const gahBeats=[
 ['Gahyeon','음성 대화 AI 캐릭터','Discord와 Unreal에서 음성으로 대화하는 캐릭터입니다. 서버의 공통 Core가 응답과 기억을 처리하고, 클라이언트가 음성·표정·행동을 표현합니다.'],
 ['응답 처리','실시간 반응과 답변 생성 분리','시선과 음성 중단은 Reflex, 자세와 행동은 Behavior, 답변 생성은 Cognition이 처리합니다. 답변 생성 지연이 다른 반응을 막지 않도록 처리 경로를 분리했습니다.'],
 ['대화 중단','이전 응답 취소','새 질문이 들어오면 응답을 구분하는 generation 번호를 갱신하고 이전 답변과 음성을 취소합니다. 늦게 도착한 이전 작업의 결과도 재생에서 제외합니다.'],
 ['재연결','저장 상태 복구','재연결 시 저장한 기억과 활동 상태를 사용합니다. 이벤트를 적용하고 저장한 뒤 ACK를 갱신하므로, 수신만 한 이벤트를 처리 완료로 기록하지 않습니다.'],
];
function useScene(){
 const ref=useRef<HTMLElement>(null),[phase,setPhase]=useState(0);
 useEffect(()=>{let frame=0;const update=()=>{frame=0;const e=ref.current;if(!e)return;const r=e.getBoundingClientRect(),range=e.offsetHeight-innerHeight;const p=range>0?Math.max(0,Math.min(1,-r.top/range)):0;e.style.setProperty('--scene-progress',String(p));setPhase(Math.min(3,Math.floor(p*4)));};const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);update();return()=>{cancelAnimationFrame(frame);removeEventListener('scroll',queue);removeEventListener('resize',queue);};},[]);
 return {ref,phase};
}
function SceneCopy({beats,phase}:{beats:string[][];phase:number}){
 return <div className="scene-copy">{beats.map((beat,i)=><div className="scene-beat" data-active={phase===i} key={beat[0]}><div className="scene-counter"><span>0{i+1} / 04</span><span>{beat[0]}</span></div><h2>{beat[1]}</h2><p>{beat[2]}</p></div>)}<div className="scene-progress" aria-hidden="true"><i/></div></div>;
}
function PalamedesScene(){
 const {ref,phase}=useScene(),[evidence,setEvidence]=useState(0),[review,setReview]=useState<number|null>(null),[notice,setNotice]=useState(''),[history,setHistory]=useState<{evidence:number;mission:string}[]>([]);
 const selected=cases[evidence];
 const save=()=>{if(review!==evidence){setNotice('저장 거부 · 현재 증거를 다시 검토하세요.');return;}setHistory(h=>[...h,{evidence,mission:selected.mission}]);setNotice('새 revision 저장 · 이전 기록 유지');setReview(null);};
 return <section ref={ref} className="causal-scroll pal-workbench" data-phase={phase} aria-label="Palamedes 목표 검토 예시">
  <div className="causal-pin">
   <span className="scene-kind">브라우저 동작 예시 · 서버 미연결</span>
   <img className="workbench-bg" src="/assets/projects/story-art-20261029/evidence-desk.webp" alt=""/>
   <SceneCopy beats={palBeats} phase={phase}/>
   <div className="pal-apparatus" data-choice={selected.choice}>
    <div className="observation-strip"><small>관찰</small><p>{selected.signal}</p></div>
    <div className="branch-board"><svg viewBox="0 0 600 80" preserveAspectRatio="none" aria-hidden="true"><path d="M300 0V22H100V80M300 22V80M300 22H500V80"/><path className="branch-chosen" d={selected.choice===0?'M300 0V22H100V80':selected.choice===1?'M300 0V80':'M300 0V22H500V80'}/></svg>{alternatives.map((name,i)=><div key={name} data-selected={selected.choice===i}><span>0{i+1}</span><b>{name}</b><small>{phase===0?'가설':selected.choice===i?'검토할 방향':'대안 보존'}</small></div>)}</div>
    <div className="mission-object" data-reviewed={review===evidence}>
     <img src="/assets/projects/mission-dossier-20261029/dossier.webp" alt=""/>
     <div className="mission-page" key={evidence}><small>미션</small><h3>{selected.mission}</h3><span>제외 범위</span><p>자동 배포 · 즉시 기능 확장</p></div>
     <div className="mission-page"><small>판단 근거</small><p>{selected.reason}</p><span>기각한 대안도 보존</span><b>{alternatives.filter((_,i)=>i!==selected.choice).join(' · ')}</b></div>
    </div>
    <div className="evidence-selector"><span>증거 조건</span>{['효과 미검증','자료 누락','관계 누락'].map((name,i)=><button key={name} aria-pressed={evidence===i} onClick={()=>{setEvidence(i);setNotice('');}}>{name}</button>)}</div>
    <div className="review-desk"><div><small>검토한 증거 / 현재 증거</small><code>{review===null?'—':`E${review+1}`} / E{evidence+1}</code></div><button onClick={()=>{setReview(evidence);setNotice('현재 증거 검토 완료');}}>현재 증거 검토</button><button onClick={save}>revision 저장</button><output aria-live="polite">{notice||'검토와 저장은 별도 단계'}</output></div>
    <ol className="mission-history" aria-label="저장된 판단 이력">{history.length===0?<li>저장된 revision 0</li>:history.map((h,i)=><li key={i}><code>r{i+1} · E{h.evidence+1}</code><span>{h.mission}</span></li>)}</ol>
   </div>
   <div className="scene-foot"><span>설계 원리를 보여주는 예시 · 모델 미연결 · 조건 2·3은 비교용 가정</span><GitHubLink href="https://github.com/LEE-Kyungjae/Palamedes/blob/0d0737dc73664488b1294aac9169b1b5c86b2ea7/docs/product-overview.ko.md">설계 근거</GitHubLink></div>
  </div>
 </section>;
}
function GahyeonScene({calm}:{calm:boolean}){
 const {ref,phase}=useScene();
 return <VoiceScene phase={phase} sceneRef={ref} calm={calm} beats={gahBeats}/>;
}
export default function ProjectStory({project,calm}:{project:ProjectId;calm:boolean}){
 const data=projectDetails[project];
 return <div className={`focused-story story-${project} ${calm?'is-calm':''}`}>
  {project==='palamedes'&&<PalamedesLayers/>}
  <ProjectResult project={project}/>
  <CoreFeatureEvidence id={project}/>
  {project==='palamedes'?<PalamedesScene/>:<GahyeonScene calm={calm}/>}
  <ProjectOutcome project={project}/>
  <div className="project-boundary"><p>{data.scope}</p><GitHubLink href={data.repository} label={`${data.name} GitHub 저장소`}/></div>
 </div>;
}
