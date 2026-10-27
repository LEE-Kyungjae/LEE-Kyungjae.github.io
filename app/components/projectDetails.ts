const palamedes='https://github.com/LEE-Kyungjae/palamedes/blob/0d0737dc73664488b1294aac9169b1b5c86b2ea7/';
const gahyeon='https://github.com/LEE-Kyungjae/gahyeon/blob/0edd9c93d13f654b3b80f347ed6bdfae287c677c/';
export const projectDetails={
 palamedes:{name:'Palamedes',status:'연구 중',number:'01',description:'AI가 수행할 목표와 제외 범위를 정하고, 검토 결과를 기록하는 도구입니다.',chapters:[
  {label:'목표',title:'전략을 바꿔도 지켜야 할 조건',asset:'lens',body:'전략을 수정할 때 수혜자와 제외 범위가 사라지지 않았는지 검사합니다. 방향 전환이 필요하면 판단 신호, 기준값, 되돌릴 행동을 함께 기록합니다.',facts:['수혜자와 제외 범위 검사','방향 전환 조건 기록'],source:'palamedes_mission/_05_boundary_strategy.py',url:palamedes+'palamedes_mission/_05_boundary_strategy.py#L106'},
  {label:'검토',title:'제안과 실제 변경의 분리',asset:'gate',body:'제안을 만든 뒤 실제로 적용하기 전에 증거 파일의 해시와 제안 버전을 확인합니다. 증거가 바뀌었거나 오래된 제안이면 적용을 거부합니다.',facts:['증거 SHA-256 확인','최신 제안 fingerprint 확인'],source:'palamedes_gate_resolution.py',url:palamedes+'palamedes_gate_resolution.py#L37'},
  {label:'검증',title:'실행 조건을 테스트로 확인',asset:'recovery',body:'게이트와 lifecycle 테스트로 거부 조건과 실행 흐름을 확인합니다. dry-run과 중복 적용 방지를 별도로 다룹니다.',facts:['게이트 및 lifecycle 테스트 8개 통과','2026-10-27 검증 기록'],source:'tests/test_palamedes_gate_resolution.py',url:palamedes+'tests/test_palamedes_gate_resolution.py#L32'},
 ]},
 gahyeon:{name:'Gahyeon',status:'개발 중',number:'02',description:'Discord 음성 비서와 데스크톱 캐릭터의 공통 로직을 개발합니다. Unreal 클라이언트도 연결하고 있습니다.',chapters:[
  {label:'공통 로직',title:'플랫폼 밖에 두는 대화 로직',asset:'runtime',body:'Core, Application, Adapter를 분리해 플랫폼 연결 코드와 대화 로직을 구분합니다. 여러 클라이언트에서 공유할 로직의 경계를 코드로 검사합니다.',facts:['Core / Application / Adapter','의존성 검사 위반 2건 보완 필요'],source:'docs/ARCHITECTURE.md',url:gahyeon+'docs/ARCHITECTURE.md#L14'},
  {label:'실시간 처리',title:'처리하지 못한 이벤트를 다시 받기',asset:'gate',body:'큐가 가득 차면 이벤트를 다시 넣고, 처리가 끝나지 않은 지점의 확인 커서를 앞당기지 않습니다. 취소된 작업의 응답도 현재 동작과 분리합니다.',facts:['Backpressure 시 재처리','처리 전 확인 커서 유지'],source:'ProtocolGameThreadDispatcher.cpp',url:gahyeon+'unreal/GahyeonStage/Source/GahyeonRuntimeCore/Private/ProtocolGameThreadDispatcher.cpp#L16'},
  {label:'복구',title:'취소와 재연결 이후의 상태',asset:'recovery',body:'엔진과 분리한 C++20 RuntimeCore에서 작업 취소, 오프라인 완료 이벤트 재시도, 저장 후 확인 처리를 테스트합니다.',facts:['C++ RuntimeCore 테스트 실행 파일 통과','전체 앱 QA와 별도 검증'],source:'RuntimeCoreTests.cpp',url:gahyeon+'unreal/RuntimeCore/tests/RuntimeCoreTests.cpp#L1471'},
 ]},
} as const;
export type ProjectId=keyof typeof projectDetails;
