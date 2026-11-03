'use client';
import {useState} from 'react';
import {type ProjectId} from './projectDetails';

type Scenario={controls:readonly [string,string];nodes:readonly string[];results:readonly [string,string];branch:number};
export const scenarios:Record<ProjectId,Scenario[]>={
 palamedes:[
  {controls:['근거 유지','반증 발견'],nodes:['관찰','추론','경쟁 해석','후보 미션','적대적 검토'],results:['경쟁 후보와 선택 근거 보존','반증 조건 충족 → 후보 재검토'],branch:3},
  {controls:['전략 수정','수혜자 변경'],nodes:['미션','수혜자','Non-goal','전략','의미 불변식'],results:['기존 미션 범위 안에서 전략 검토','목표 의미 변경 → 명시적인 미션 수정 필요'],branch:2},
  {controls:['증거 일치','증거 변경'],nodes:['증거 파일','SHA-256','제안 fingerprint','검토','적용 기록'],results:['해시·식별값 일치 → 적용 가능','검토 이후 증거 변경 → 적용 거부'],branch:2},
  {controls:['버전 일치','동시 수정'],nodes:['현재 버전','복원 대상','변경 미리보기','If-Match','새 revision'],results:['미리보기 확인 후 새 복구 기록','기준 버전 불일치 → HTTP 412'],branch:3},
  {controls:['계획 계약 충족','권한 확대'],nodes:['미션 계약','작업 의존성','진입·종료 gate','검증 기준','Host 승인'],results:['구조 검증 통과 · 실행 권한은 Host에 유지','execution_authority_issued=true → 검증 거부'],branch:4},
  {controls:['미션만 전달','계획 자료 전달'],nodes:['입력 고정','계획 생성','블라인드 검토','5개 평가 기준','결과 비교'],results:['미션 기준 계획의 평가 기록','계획 자료 기준 평가 기록 · 사업 성과와 구분'],branch:2},
 ],
 gahyeon:[
  {controls:['Discord','Unreal'],nodes:['Client','Adapter','Identity','Session','Conversation'],results:['Discord 식별자를 내부 actor로 해석','Unreal 입력도 같은 대화 유스케이스로 전달'],branch:0},
  {controls:['요약 완료','요약 실패'],nodes:['대화 완료','원문 저장','Commit','압축 worker','장기 기억'],results:['저장 이후 별도 worker에서 기억 처리','원문 유지 · 미요약 기록은 이후 다시 예약'],branch:3},
  {controls:['응답 유지','새 질문'],nodes:['Generation','Cognition','문장 TTS','Audio / Viseme','Presentation'],results:['현재 generation의 음성·동작만 재생','이전 generation 취소 · 늦은 오디오도 제외'],branch:2},
  {controls:['큐 여유','큐 포화'],nodes:['이벤트 수신','Bounded queue','Game Thread','로컬 저장','ACK cursor'],results:['적용·저장 완료 후 ACK 전진','재큐잉 · 미적용 이벤트의 ACK 유지'],branch:1},
  {controls:['Renderer 연결','연결 해제'],nodes:['World 목표','Action ledger','Renderer','도착 관측','World commit'],results:['실제 도착 관측까지 완료 보류','Headless가 영속 pending action을 이어받음'],branch:2},
  {controls:['생활 상태','중단된 대화'],nodes:['Backend 시작','World snapshot','Orphan 판별','복구 revision','Readiness'],results:['Work / Read / Sleep 생활 상태 보존','사라진 lease의 CONVERSATION → IDLE 복구'],branch:2},
 ]
};
export function ProcessScene({scenario,index,progress}:{scenario:Scenario;index:number;progress:number}){
 const [variant,setVariant]=useState(0),[inspection,setInspection]=useState<number|null>(null);
 const active=inspection??Math.min(scenario.nodes.length-1,Math.floor(progress*scenario.nodes.length));
 return <div className="story-process" data-layout={index%3} data-variant={variant} data-active-node={active}>
  <div className="story-process-top"><span>처리 흐름 예시</span><span>{String(index+1).padStart(2,'0')}</span></div>
  <div className="story-scenarios">{scenario.controls.map((label,i)=><button key={label} aria-pressed={variant===i} onClick={()=>{setVariant(i);setInspection(scenario.branch);}}>{label}</button>)}</div>
  <div className="story-pipeline">{scenario.nodes.map((node,i)=><button key={node} className={`${i<=active?'is-reached':''} ${variant&&i===scenario.branch?'is-branch':''}`} aria-pressed={active===i} onClick={()=>setInspection(i)}><span>{String(i+1).padStart(2,'0')}</span><b>{node}</b><i aria-hidden="true"/></button>)}</div>
  <output className="story-process-result" aria-live="polite" key={variant}>{scenario.results[variant]}</output>
  {inspection!==null&&<button className="story-resume" onClick={()=>setInspection(null)}>선택 해제</button>}
 </div>;
}
