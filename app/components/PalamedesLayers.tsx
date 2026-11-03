'use client';
import {useState} from 'react';
const conditions=['근거 충족','근거 부족','실행 권한 없음'] as const;
export default function PalamedesLayers(){
 const [condition,setCondition]=useState(0);
 const insufficient=condition===1;
 return <section className="mission-layers" aria-label="Palamedes 판단과 실행 경계">
 <div className="layers-intro"><span>Palamedes · 실행 전 목표 판단·검증</span><h2>근거에서 미션으로,<br/>미션에서 실행 검토로</h2><p>개발자와 AI 에이전트가 무엇을 구현할지 판단하는 로컬 시스템입니다. 관찰과 참고 자료를 입력하면 독립된 관점에서 후보를 만들고, 비판과 선택을 거쳐 목표·성공 기준·반증 조건을 미션으로 기록합니다.</p><p>선택한 미션은 플래너의 입력이 됩니다. 플래너가 목표를 바꾸거나 곧바로 구현을 시작할 권한까지 함께 넘기지는 않습니다.</p></div>
 <div className="layer-lab"><div className="sample-heading"><b>레이어 간 영향</b><span>소스 기반 구조 예시 · 모델 미연결</span></div><div className="sample-options">{conditions.map((c,i)=><button aria-pressed={condition===i} onClick={()=>setCondition(i)} key={c}>{c}</button>)}</div>
 <div className="layer-flow" data-condition={condition}>
 <article className="layer-input"><small>01 · 호스트</small><h3>근거 장부</h3><p>직접 관찰·검증된 기록과 가설을 구분합니다. 코드 참조는 revision·경로·해시로 묶고, 호출 예산도 기록합니다.</p><output>{insufficient?'인용 가능한 제품 근거 부족':'검증 가능한 근거 묶음'}</output></article>
 <div className="layer-fork">{[['제품 기회','사용자에게 바뀌는 결과'],['구조 전이','다른 구현의 원리와 적용 한계'],['실패·운영','실패·차단된 결과에서 찾은 문제']].map(([name,desc])=><article key={name}><small>02 · 독립 생성</small><h3>{name}</h3><p>{desc}</p><span>{insufficient?'근거 없는 후보는 기권':'공유 근거 + 관점별 자료'}</span></article>)}</div>
 <p className="layer-note">생성자는 다른 생성자의 답을 보지 않습니다. 구조 전이는 출처와 적용 대상 양쪽의 근거가 있어야 하며, 실패 관점은 실제 실패·차단 결과가 있어야 합니다.</p>
 <div className="layer-checks"><article><small>03 · 후보 고정</small><h3>원문과 식별값 보존</h3><p>비판을 받기 전에 후보를 고정합니다. 이후 판단이 어느 후보를 대상으로 했는지 추적합니다.</p></article><article><small>04 · 비판과 선택</small><h3>작성자를 가린 검토</h3><p>비판자는 한 번에 한 후보를 검토하고, 선택자는 고정된 후보 ID만 선택합니다. 후보 내용을 다시 쓰지 않습니다.</p></article></div>
 <div className="layer-contract" aria-live="polite"><div><small>05 · 호스트 검증</small><h3>{insufficient?'판단 보류':'미션 초안'}</h3><p>{insufficient?'자격을 갖춘 후보가 없으면 호스트가 defer를 기록합니다. 선택을 강제로 만들어 내지 않습니다.':'고정 후보로 미션을 만들고 식별값을 재검증합니다. 목표·성공 기준·제외 범위·반증 조건을 함께 보존합니다.'}</p></div><code>{insufficient?'decision: defer':'mission: draft'}<br/>delivery_authority: false</code></div>
 <article className="layer-planner" data-blocked={insufficient||condition===2}><small>06 · 플래너 경계</small><h3>{insufficient?'플래너 전달 보류':condition===2?'구현 시작 차단':'전략 검토로 전달'}</h3><p>{insufficient?'추가 근거를 수집한 뒤 다시 판단합니다.':condition===2?'미션이 선택되어도 실행 권한은 생기지 않습니다. 별도 검토·승인 없이 구현 단계로 넘어가지 않습니다.':'첫 전달은 전략 검토입니다. 목표 변경·구현 순서·실행 시작을 이 단계의 응답에 섞지 않도록 검사합니다.'}</p></article>
 </div></div>
 <div className="layer-feedback"><span aria-hidden="true">↶</span><div><h3>결과가 다음 판단에 미치는 영향</h3><p>승인된 미션의 결과를 원 관찰과 후속 해석으로 나눠 남깁니다. 불리하거나 모호한 결과는 후속 검토 조건으로 이어지고, 다음 후보 생성의 근거가 됩니다. 계획 상태는 revision과 복구 이력으로 보존합니다.</p><p className="layer-note">구조를 세분화한 만큼 호출 예산과 검증 비용이 늘어납니다. 현재 연구 단계이며, 실제 의사결정 성과가 개선됐다는 외부 검증을 뜻하지 않습니다.</p></div></div>
 </section>;
}
