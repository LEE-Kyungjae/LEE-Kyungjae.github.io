import GahyeonCharacter from './GahyeonCharacter';
import PlanArtifact from './PlanArtifact';
import type {ProjectId} from './projectDetails';
import GahyeonDialogue from './GahyeonDialogue';

export default function ProjectResult({project}:{project:ProjectId}){
 if(project==='palamedes')return <section className="project-result result-plan" aria-label="Palamedes 사용 결과">
  <div className="result-context"><span>Palamedes · 상태 저장 인터페이스</span><h2>목표·근거 저장과 조회</h2><p>판단 파이프라인 아래에는 계획·증거·변경 이력을 보존하는 상태 계층이 있습니다. 다음은 이 계층의 CLI를 직접 실행한 기록입니다.</p><div className="result-command"><small>실제 예제 입력 · 모델 호출 없음</small></div></div>
  <PlanArtifact/>
  <p className="result-limit">이 예제는 직접 입력한 계획의 저장·조회 기록입니다. 필수 항목이 누락되어 계획 QA는 실패했으며, AI가 목표를 생성한 결과는 아닙니다. <a href="/assets/projects/product-proof-20261029/palamedes-cli.json" target="_blank" rel="noopener noreferrer">입력·출력 원문 ↗</a></p>
 </section>;
 return <section className="project-result result-character" aria-label="가현 런타임 구현 결과">
  <figure className="character-exhibit"><div className="character-exhibit-grid" aria-hidden="true"/><span className="character-exhibit-label">Gahyeon</span><GahyeonCharacter/><figcaption>기존 3D 모델·대기 모션 · 웹 재생</figcaption></figure>
  <div className="result-context"><span>Gahyeon · 음성 대화 AI 캐릭터</span><h2>음성 대화와 캐릭터 런타임</h2><p>Discord와 Unreal의 입력을 공통 대화 Core에 연결하고, 응답·기억과 캐릭터 표현을 처리합니다. 캐릭터의 대화 방식을 먼저 샘플로 볼 수 있습니다.</p>
   <GahyeonDialogue/>
  </div>
  <p className="result-limit">캐릭터는 기존 모델의 웹 재생입니다. 대화는 인격 프롬프트를 바탕으로 작성한 가상 예시이며 실제 모델 응답이나 사용자 기록이 아닙니다. 아래 기술 사례에는 별도의 C++ RuntimeCore 실행 결과를 제공합니다. <a href="/assets/projects/product-cases-20261030/gahyeon.json" target="_blank" rel="noopener noreferrer">런타임 결과 원문 ↗</a></p>
 </section>;
}
