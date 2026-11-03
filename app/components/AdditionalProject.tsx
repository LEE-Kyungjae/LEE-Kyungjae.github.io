import CoreFeatureEvidence from './CoreFeatureEvidence';
import GitHubLink from './GitHubLink';
import ActualProjectSurface from './ActualProjectSurface';
import {RankingExperiment} from './ProjectExperiments';
import {TerminalScene,DeckScene,TrackpadScene,WorkspaceScene,OceanScene,LedgerScene,LooperScene,RagEvidenceScene} from './ImplementationScenes';
import type {ExtraProject} from './projectCatalog';
import './project-expansion.css';
export default function AdditionalProject({project:p}:{project:ExtraProject}){return <main className={`extended-project extended-${p.id}`}><a className="project-back" href="/#brain" aria-label="뇌로 돌아가기">←</a><section className="extended-opening"><span>{p.kind}</span><h1>{p.name}</h1><p>{p.description}</p><div className="extended-meta"><span>{p.stack}</span>{p.private?<span>비공개 저장소</span>:<GitHubLink href={`https://github.com/LEE-Kyungjae/${p.id}`}>GitHub</GitHubLink>}</div></section>
 {p.id==='ClaudeCodeLooper'&&<CoreFeatureEvidence id={p.id}/>}
 <ActualProjectSurface id={p.id}/>
 {p.id!=='ClaudeCodeLooper'&&<CoreFeatureEvidence id={p.id}/>}
 {p.id==='insight-rag'?<><RankingExperiment/><RagEvidenceScene/><section className="rag-indices"><div><small>원본 근거 인덱스</small><h2>코드·테스트·문서</h2><p>저장소, commit, 파일 경로, 줄 범위와 심볼을 보존합니다. 추천 근거를 원본까지 다시 확인할 수 있도록 구성합니다.</p><code>repo / commit / path / lines / symbol</code></div><div><small>파생 컴포넌트 인덱스</small><h2>역할·제약·참조 적합도</h2><p>기능과 구조, 테스트·운영 신호를 컴포넌트 단위로 정리합니다. 검색어가 비슷한지와 실제 구현에 참고할 만한지를 나눠 계산합니다.</p><code>capabilities / constraints / evidence</code></div></section><section className="rag-modes"><h2>컴포넌트 추천의 조회 범위</h2><div>{[['fast','파생 인덱스 조회'],['fresh','제공된 현재 commit과 스냅샷 비교'],['deep','원본 근거 검색 추가']].map(([a,b])=><article key={a}><h3>{a}</h3><p>{b}</p></article>)}</div><p>추천에는 뒷받침하는 근거와 부족한 근거, 적용 제약을 함께 전달합니다. 위 순위 예제는 로컬 점수 함수의 실행이며 이 조회 경로 전체를 실행한 결과는 아닙니다.</p></section></>:p.id==='promdeck'?<DeckScene/>:p.id==='termi'?<TerminalScene/>:p.id==='pocketterm-touch-trackpad'?<TrackpadScene/>:p.id==='brain-workspace-demo'?<WorkspaceScene/>:p.id==='ocean-atlas-scroll'?<OceanScene/>:p.id==='laplaces-demon'?<LedgerScene/>:p.id==='ClaudeCodeLooper'?<LooperScene/>:null}
 <section className="extended-detail"><h2>현재 범위</h2><p>{p.limit}</p></section><a className="catalog-return" href="/projects/">프로젝트 목록 →</a></main>}
