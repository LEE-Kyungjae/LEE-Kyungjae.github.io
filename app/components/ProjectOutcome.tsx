import GitHubLink from './GitHubLink';
import RecordedCase from './RecordedCase';
import ProjectVerification from './ProjectVerification';
import type {ProjectId} from './projectDetails';
import gate from '../../assets/projects/product-cases-20261030/palamedes.json';
import runtime from '../../assets/projects/product-cases-20261030/gahyeon.json';

export default function ProjectOutcome({project}:{project:ProjectId}){
 if(project==='palamedes')return <section className="product-outcome palamedes-product case-study" aria-label="Palamedes 증거 변경 처리 사례">
  <div className="case-intro"><span>구현 사례 · 실제 함수 재현</span><h2>검토한 뒤 증거 파일이 바뀐 경우</h2><p>검토 시점에는 유효했던 자료도 적용 전에 바뀔 수 있습니다. 검토 완료 여부만 저장하면, 달라진 근거로도 이전 결정을 적용할 위험이 있습니다.</p></div>
  <div className="case-decision"><h3>적용 시점에 다시 검사</h3><p>단순한 승인 플래그 대신 증거의 SHA-256과 제안 fingerprint를 적용 직전에 확인합니다. 불일치하면 쓰기를 거부하고, 정상 적용은 기존 기록을 유지한 채 추가합니다.</p><p>검증과 적용을 나누면 호출 단계가 늘어납니다. 증거가 바뀐 요청은 현재 자료로 다시 검토해야 합니다.</p></div>
  <RecordedCase project={project}/>
  <ol className="case-observations"><li><span>01</span><h3>제안 생성 후 증거 수정</h3><p>임시 fixture에서 제안을 만든 다음, 증거 파일의 내용을 변경했습니다.</p><code>propose → evidence changed</code></li><li><span>02</span><h3>변경된 증거로 적용 요청</h3><p>실제 함수가 오류를 반환했습니다. 게이트는 열린 상태로 유지됐고 기록이 추가되지 않았습니다.</p><code>{gate.recordsAfterRejection} record · {gate.originalStatus}</code></li><li><span>03</span><h3>유효한 증거로 재검토·적용</h3><p>정상 적용 후 새 응답 기록이 추가됐습니다. 첫 번째 기록은 그대로 남았습니다.</p><code>{gate.recordsAfterApply} records · {gate.originalStatus} → {gate.latestStatus}</code></li></ol>
  <div className="case-source"><a href="/assets/projects/product-cases-20261030/palamedes.json" target="_blank" rel="noopener noreferrer">재현 결과 원문 ↗</a><GitHubLink href="https://github.com/LEE-Kyungjae/Palamedes/blob/0d0737dc73664488b1294aac9169b1b5c86b2ea7/palamedes_gate_resolution.py">검증·적용 코드</GitHubLink><GitHubLink href="https://github.com/LEE-Kyungjae/Palamedes/blob/0d0737dc73664488b1294aac9169b1b5c86b2ea7/tests/test_palamedes_gate_resolution.py">회귀 테스트</GitHubLink></div>
  <p className="case-limit">2026.10.30 · 기존 테스트 fixture와 실제 함수를 사용한 로컬 재현입니다. 운영 장애 이력이나 AI 목표 탐색 성과를 의미하지 않습니다.</p>
  <ProjectVerification project={project}/>
  <div className="delivery-scope"><div><h3>구현 범위</h3><p>CLI·HTTP/Python 연동, 목표·증거 저장, 변경 이력, 복구 미리보기와 동시 수정 충돌 검사.</p><p>자율적인 기회 탐색과 미션 생성은 연구 단계입니다. 사업 성과 개선 여부는 검증되지 않았습니다.</p></div><dl><dt>기술</dt><dd>Python · JSON Schema · HTTP / MCP · 파일 기반 이력</dd><dt>실행 권한</dt><dd>실행과 승인은 사람·에이전트 Host가 담당</dd></dl></div>
 </section>;
 return <section className="product-outcome gahyeon-product case-study" aria-label="가현 이전 응답 취소 사례">
  <div className="case-intro"><span>구현 사례 · C++ RuntimeCore 재현</span><h2>새 발화 뒤에 도착한 이전 응답 처리</h2><p>사용자가 말을 끊어도 이미 요청한 답변이나 음성이 늦게 도착할 수 있습니다. 취소 요청을 보내는 것만으로는 뒤늦은 결과의 재생을 막을 수 없습니다.</p></div>
  <div className="case-decision"><h3>현재 대화 번호와 결과의 번호 비교</h3><p>새 발화가 시작되면 generation 번호를 갱신합니다. 응답 수락 단계에서 현재 번호와 다르면 거부하므로, 취소 신호가 늦어져도 이전 결과를 현재 표현에 반영하지 않습니다.</p><p>각 비동기 경로에 번호를 전달하고 검사해야 합니다. 이 구조의 정확성과 실제 음성 지연은 별도의 검증 대상입니다.</p></div>
  <RecordedCase project={project}/>
  <p className="case-observed">기존 응답 수락 → 새 발화 → 이전 응답 재도착 순서로 실제 런타임을 호출했습니다. 이전 응답은 거부됐고, 현재 generation의 듣기 상태가 유지됐습니다.</p>
  <div className="case-source"><a href="/assets/projects/product-cases-20261030/gahyeon.json" target="_blank" rel="noopener noreferrer">재현 결과 원문 ↗</a><GitHubLink href="https://github.com/LEE-Kyungjae/Gahyeon/blob/0edd9c93d13f654b3b80f347ed6bdfae287c677c/unreal/GahyeonStage/Source/GahyeonRuntimeCore/Private/RealtimeCharacterCoordinator.cpp">런타임 코드</GitHubLink><GitHubLink href="https://github.com/LEE-Kyungjae/Gahyeon/blob/0edd9c93d13f654b3b80f347ed6bdfae287c677c/unreal/RuntimeCore/tests/RuntimeCoreTests.cpp">취소 회귀 테스트</GitHubLink></div>
  <p className="case-limit">2026.10.30 · 합성 발화 이벤트와 모의 시각을 입력한 로컬 재현입니다. 실제 마이크·네트워크·음성 재생을 포함한 대화 성능은 이 결과로 판단할 수 없습니다.</p>
  <ProjectVerification project={project}/>
  <div className="gahyeon-delivery"><div><h3>구현 범위</h3><p>공통 대화 Core, 기억 저장, STT/TTS 스트리밍, Discord 연결과 Unreal 런타임의 취소·재연결 처리.</p></div><div><h3>남은 검증</h3><p>전체 음성 대화의 응답 지연과 재생 품질, 배포용 패키지, 최종 캐릭터 승인. 이전 Electron 클라이언트는 폐기됐습니다.</p></div><dl><dt>서버</dt><dd>Java 21 · Spring · PostgreSQL</dd><dt>런타임</dt><dd>C++20 · Unreal · WebSocket</dd><dt>음성</dt><dd>VAD · STT · TTS · viseme</dd></dl></div>
 </section>;
}
