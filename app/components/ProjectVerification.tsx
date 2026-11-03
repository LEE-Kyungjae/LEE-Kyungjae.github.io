import type {ProjectId} from './projectDetails';
import palamedes from '../../assets/projects/verification-20261030/palamedes.json';
import gahyeon from '../../assets/projects/verification-20261030/gahyeon.json';

export default function ProjectVerification({project}:{project:ProjectId}){
 const result=project==='palamedes'?palamedes:gahyeon;
 const tests=palamedes.stderr.match(/Ran (\d+) tests/)?.[1];
 const boundary=JSON.parse(gahyeon.stdout) as {ready:boolean;violations:{file:string;reason:string}[]};
 return <section className={`project-verification verification-${project}`} aria-label="실제 코드 검증 기록">
  <div className="verification-heading"><span>실제 코드 검증 · 2026.10.30</span><h2>{project==='palamedes'?'실행 전 검증과 중복 적용 방지':'Core 의존성 경계 검사'}</h2><p>{project==='palamedes'?'검토한 증거가 바뀌거나 제안 식별값이 다르면 적용을 거부합니다. 동일 작업의 재적용과 기존 이력 보존도 테스트합니다.':'공통 대화 로직이 플랫폼 코드에 의존하는지 검사합니다. 현재 검사에서는 Application과 공용 서비스에 위반이 남아 있습니다.'}</p></div>
  <div className="verification-result" data-passed={result.exitCode===0}><strong>{project==='palamedes'?`${tests} tests · ${palamedes.exitCode===0?'PASS':'FAIL'}`:`${boundary.violations.length}건 · ${boundary.ready?'PASS':'FAIL'}`}</strong><code>{project==='palamedes'?'gate resolution / lifecycle':'core / platform boundary'}</code><p>{project==='palamedes'?'임시 fixture를 사용한 기능 검사입니다. 목표 탐색 품질과 운영 성능은 이 결과에 포함되지 않습니다.':'구조 검사 결과입니다. 음성 응답 지연이나 전체 앱의 동작을 검증한 결과는 아닙니다.'}</p><a href={`/assets/projects/verification-20261030/${project}.json`} target="_blank" rel="noopener noreferrer">명령·검사 결과 원문 ↗</a></div>
  <p className="verification-provenance">검사 기준: 로컬 작업 트리 · 미커밋 변경 포함 · HEAD {result.sourceHead.slice(0,7)}</p>
 </section>;
}
