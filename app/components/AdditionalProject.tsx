import RemoteSessionProof from './RemoteSessionProof';
import DeviceMetrics from './DeviceMetrics';
import AgentContinuity from './AgentContinuity';
import ResearchObservation from './ResearchObservation';
import InteractionLibrary from './InteractionLibrary';
import CoreFeatureEvidence from './CoreFeatureEvidence';
import GitHubLink from './GitHubLink';
import ActualProjectSurface from './ActualProjectSurface';
import {RankingExperiment} from './ProjectExperiments';
import {TrackpadScene,WorkspaceScene,LedgerScene} from './ImplementationScenes';
import type {ExtraProject} from './projectCatalog';
import './project-expansion.css';
export default function AdditionalProject({project:p}:{project:ExtraProject}){return <main className={`extended-project extended-${p.id}`}><a className="project-back" href="/#brain" aria-label="뇌로 돌아가기">←</a><section className="extended-opening"><span>{p.kind}</span><h1>{p.name}</h1><p>{p.description}</p><div className="extended-meta"><span>{p.stack}</span>{p.private?<span>비공개 저장소</span>:<GitHubLink href={`https://github.com/LEE-Kyungjae/${p.id}`}>GitHub</GitHubLink>}</div></section>
 {p.id==='termi'&&<RemoteSessionProof/>}
 {p.id==='promdeck'&&<DeviceMetrics/>}
 {p.id==='ClaudeCodeLooper'&&<AgentContinuity/>}
 {p.id==='insight-rag'&&<ResearchObservation/>}
 {p.id==='ocean-atlas-scroll'&&<InteractionLibrary/>}
 {p.id==='termi'&&<ActualProjectSurface id={p.id}/>}
 {p.id==='promdeck'&&<ActualProjectSurface id={p.id}/>}
 {p.id==='ocean-atlas-scroll'&&<section><h2>Ocean 장면의 실제 연출</h2><ActualProjectSurface id={p.id}/></section>}
 {p.id==='insight-rag'&&<details className="research-implementation-detail"><summary>검색 순위 구현과 실행 결과</summary><RankingExperiment/></details>}
 {!['termi','promdeck','ocean-atlas-scroll','insight-rag','ClaudeCodeLooper'].includes(p.id)&&<><ActualProjectSurface id={p.id}/><CoreFeatureEvidence id={p.id}/>{p.id==='pocketterm-touch-trackpad'?<TrackpadScene/>:p.id==='brain-workspace-demo'?<WorkspaceScene/>:p.id==='laplaces-demon'?<LedgerScene/>:null}</>}
 <section className="extended-detail"><h2>현재 범위</h2><p>{p.limit}</p></section><a className="catalog-return" href="/projects/">프로젝트 목록 →</a></main>}
