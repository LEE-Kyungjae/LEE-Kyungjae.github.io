# 이경재 개발 방식 — 레포 기반 분석

분석일: 2026-10-27. 요청: 기술 이름 나열 대신 개발 스타일에서 차별화할 만한 역량을 추려 포트폴리오에 제시하고, 이미지젠을 활용한 인터랙티브 다이어그램으로 표현한다.

## 판단

가장 설득력 있는 공통점은 **문제 정의, 실행 권한, 플랫폼 경계, 실패 복구를 별개의 관심사로 분리한 뒤 코드와 검증으로 연결하는 방식**이다. 기술 스택의 개수나 코드량보다 이 연결에 무게를 두었다. 업계 대비 우월성, 개인의 모든 코드 단독 작성, 매출·채용 성과, 대규모 운영 안정성을 증명하는 분석은 아니다.

### 1. 모호한 문제를 실행 조건으로 바꾸는 능력

- 근거: Palamedes의 `validate_strategy_meaning_invariants`는 전략 최적화 중 원래 수혜자와 non-goal이 사라지는지 검사한다. `validate_*`의 방향 전환 조건은 signal/threshold/reversal_action을 요구한다.
- 강점 해석: 작업을 분해하기 전에 무엇을 지켜야 하고 언제 판단을 바꿀지 구조화한다.
- 필요한 상황: 탐색 단계의 AI 제품, 여러 목표가 경쟁하는 도구, 구현보다 문제 정의가 불확실한 프로젝트.
- 한계: 이 구조가 더 나은 외부 사업 성과를 낸다는 인과적 증거는 검토하지 않았다. Palamedes의 Research Alpha 표기를 유지한다.

### 2. AI의 제안과 실제 변경을 분리하는 능력

- 근거: `palamedes_gate_resolution.py`의 증거 sha256 검증, 2단계 propose/apply, 최신 proposal fingerprint 요구, append-only 및 flock/fsync 기록. lifecycle은 dry-run, immutable handoff, 중복 적용 방지를 구현한다.
- 검증: `python3 -m unittest tests.test_palamedes_gate_resolution tests.test_palamedes_lifecycle` — 8 tests PASS.
- 강점 해석: 모델의 확신과 실행 권한을 혼동하지 않고, 자동화에서 잘못된 변경을 막을 조건을 명시한다.
- 필요한 상황: 에이전트가 파일·업무 상태·외부 시스템을 변경하는 서비스.

### 3. 제품의 핵심과 플랫폼 연결부를 분리하는 능력

- 근거: Gahyeon의 Core/Application/Adapter 구조, `verify_core_platform_boundaries.py`가 금지 의존성을 실제 import 수준에서 검사함. RuntimeCore는 엔진 독립 C++20 라이브러리로 별도 빌드된다.
- 강점 해석: 여러 클라이언트를 하나의 제품에 연결하고, 경계가 무너지는 것을 검사 가능한 규칙으로 만든다.
- 한계: 현재 로컬 작업 트리의 경계 검사 FAIL. `SttLearningConversation.java`의 infrastructure dependency, `PersonalizedNewsCollector.java`의 Discord adapter dependency 두 건. 이를 ‘경계 분리 완료’나 검사 PASS로 소개하지 않는다. UI에도 보완 필요를 표시한다. 다른 저장소의 문제는 이번 포트폴리오 작업에서 수정하지 않았다.

### 4. 실패 이후의 상태를 다루는 능력

- 근거: Gahyeon `ProtocolGameThreadDispatcher::Drain`은 backpressure 시 이벤트를 requeue하고 확인 커서를 앞당기지 않는다. RuntimeCore 회귀 테스트는 generation 변경에 따른 행동 취소, 백엔드 취소, 오프라인 완료 outbox 재시도, save-before-ack 등을 검증한다.
- 검증: 별도 CMake 디렉터리에서 C++ RuntimeCore 빌드 및 CTest — 1 test executable PASS. 이를 1개 동작 테스트 또는 전체 앱 QA PASS와 혼동하지 않는다.
- 운영 근거: 공개 `verify-production.yml`은 배포 이미지 태그와 Kubernetes rollout을 확인한다. 현재 운영 무장애나 SLA를 증명하는 검사는 수행하지 않았다.
- 필요한 상황: 실시간 음성·캐릭터·이벤트 처리처럼 취소, 지연, 재연결이 사용자 경험에 직접 영향을 주는 제품.

## 조사 범위와 공개 근거

- Palamedes 로컬 HEAD: `9c1e292f7c3f1a04bd63c697342b00fa92a4ff9b` (원격 미게시).
- 포트폴리오 링크는 실제 공개 커밋 `0d0737dc73664488b1294aac9169b1b5c86b2ea7`에 고정. 게이트 코드·테스트 및 미션 경계/방향 전환 소스 4개의 Git blob hash가 로컬 파일과 동일함을 확인했다.
- Gahyeon 공개 커밋: `0edd9c93d13f654b3b80f347ed6bdfae287c677c`. 분석 소스 및 검증 스크립트는 변경하지 않았다.
- DataGround는 README, 프로비저닝 진입점과 코드 인덱스를 통해 수집/스케줄링/관측과 엔진-collector 경계를 교차 검토했다. 비공개 저장소이므로 내부 코드·수집처·운영 정보는 공개 페이지에 넣지 않고, 공개 Palamedes/Gahyeon 근거로만 화면을 구성했다.
- GitNexus query/context는 탐색 보조로 사용했고 실제 파일을 다시 읽었다. 인덱스가 현재 작업 트리 전체와 동일하다는 가정은 하지 않았다.

## UI 표현

기존 Backend / Agents / Operations 및 단순 5노드 화살표를 대체했다. 상단은 채용/협업 시 필요한 상황을 설명하고, 4개 탭은 가치 → 구현 사례 → 실제 공개 소스 순서로 펼쳐진다. ‘탁월함’을 수식어 대신 검토 가능한 설계 선택으로 설명한다.

이미지젠 원화는 네 설계 관심사를 해석한 개념도다. 실제 서비스들이 물리적으로 연결된 프로덕션 아키텍처로 표현하지 않는다. 원화에는 텍스트를 굽지 않고, 버튼·흐름선·피드백 경로·설명·링크는 실제 DOM/SVG로 구현한다. 이미지와 최종 생성 프롬프트: `assets/projects/engineering-20261027/`. 원본 PNG와 분석 로그: `output/repo-analysis-20261027/`.

한국어 신규 설명만 작성했다. `/en`에도 같은 신규 한국어 블록을 사용하며 별도 번역을 지어내지 않았다. 서비스·연락처 등 기존 페이지는 유지한다. 포트폴리오 운영 배포는 수행하지 않았다.

## 화면 검증

정적 빌드 통과. 탭·원화 핫스팟 선택, 키보드 이동, 근거 패널 연결, 실제 흐름 애니메이션, 320/390/430px 반응형, 모션 감소·화면 밖 정지 등 30개 UI 검사 통과. 공개 커밋의 근거 링크 9개를 GitHub API로 확인. 데스크톱과 모바일 이미지 실제 렌더 검수 완료. 자세한 결과는 `output/playwright/engineering-result.json`.
