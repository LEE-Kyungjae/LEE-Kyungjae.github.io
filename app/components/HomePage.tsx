type Language = 'ko' | 'en';

const copy = {
  ko: {
    nav: ['시스템', '경력', '연락'], role: 'SYSTEMS ENGINEER · SEOUL',
    titleA: '목표를 발견하고,', titleB: '기억하고,', titleC: '계속 작동하게.',
    intro: '에이전트의 판단부터 실시간 캐릭터와 운영 백엔드까지. 저는 빠르게 만든 데모가 아니라, 근거를 남기고 실패에서 복구하는 시스템을 설계합니다.',
    inspect: '시스템 보기', workLabel: 'SELECTED SYSTEMS / 2026', workTitle: '주장보다 구조를 먼저 보여줍니다.', evidence: '확인된 근거', boundary: '현재 한계', source: '소스 보기',
    palamedesBody: '실행 에이전트가 어떻게 만들지 계획하기 전에, 무엇을 추구할 가치가 있는지 발견하고 검토하는 로컬 우선 미션 인텔리전스 계층입니다.',
    palamedesEvidence: '수정·복원 가능한 plan-state kernel, bounded handoff, 블라인드 모델 검토 9표 중 8표.',
    palamedesLimit: 'Research Alpha. 외부 성과와 사람 수준 창의성은 아직 입증되지 않았습니다.',
    gahyeonBody: '하나의 Core가 Discord에서는 음성 비서로, Desktop과 Unreal에서는 지속되는 실시간 AI 캐릭터로 나타나는 멀티 클라이언트 시스템입니다.',
    gahyeonEvidence: 'Core/Application/Adapter 분리, 영속 World, bounded runtime, Desktop·Unreal 프로토콜.',
    gahyeonLimit: 'Unreal 실기 패키징과 최종 hero mesh·물리 장치 검증은 진행 중입니다.',
    architecture: 'ONE PRACTICE / TWO SYSTEMS', architectureTitle: '판단은 기록되고, 실행은 경계를 넘지 않습니다.',
    architectureBody: 'Palamedes와 Gahyeon은 서로 다른 제품이지만 같은 태도를 공유합니다. 상태를 남기고, 권한을 분리하며, 실패를 다음 판단의 입력으로 되돌립니다.',
    signals: '신호', observation: '관찰', decision: '결정', execution: '실행', outcome: '결과',
    principles: ['근거와 추론을 분리', '승인과 실행 권한을 보존', '결과를 다음 상태로 환류'],
    career: 'SYSTEMS IN PRACTICE', careerTitle: '제품의 첫 화면부터 운영의 마지막 경보까지.',
    careerBody: 'Java와 Spring 기반 백엔드, React 인터페이스, PostgreSQL·Redis·Kafka, 컨테이너 운영을 하나의 제품 흐름으로 다룹니다.',
    contact: '함께 만들 시스템이 있다면', contactLink: 'GitHub에서 대화하기',
  },
  en: {
    nav: ['Systems', 'Experience', 'Contact'], role: 'SYSTEMS ENGINEER · SEOUL',
    titleA: 'Discover direction.', titleB: 'Keep memory.', titleC: 'Stay alive.',
    intro: 'From agent judgment to real-time characters and operational backends, I design systems that preserve evidence, recover from failure, and improve over time.',
    inspect: 'Inspect systems', workLabel: 'SELECTED SYSTEMS / 2026', workTitle: 'Structure before claims.', evidence: 'Verified evidence', boundary: 'Current boundary', source: 'View source',
    palamedesBody: 'A local-first mission intelligence layer that discovers and reviews what is worth pursuing before execution agents plan how to build it.',
    palamedesEvidence: 'Revisionable plan-state kernel, bounded handoff, and 8 of 9 votes in an origin-blinded model review.',
    palamedesLimit: 'Research Alpha. Better external outcomes and human-level creativity are not proven.',
    gahyeonBody: 'A multi-client system where one Core appears as a voice assistant in Discord and as a persistent real-time AI character on Desktop and Unreal.',
    gahyeonEvidence: 'Separated Core/Application/Adapters, persistent World, bounded runtime, and Desktop/Unreal protocols.',
    gahyeonLimit: 'Packaged Unreal acceptance, the final hero mesh, and physical-device verification remain in progress.',
    architecture: 'ONE PRACTICE / TWO SYSTEMS', architectureTitle: 'Decisions leave a record. Execution keeps its boundaries.',
    architectureBody: 'Palamedes and Gahyeon are different products with the same discipline: preserve state, separate authority, and return failure as input to the next decision.',
    signals: 'Signals', observation: 'Observe', decision: 'Decide', execution: 'Execute', outcome: 'Outcome',
    principles: ['Separate evidence from inference', 'Preserve approval and execution authority', 'Return outcomes to persistent state'],
    career: 'SYSTEMS IN PRACTICE', careerTitle: 'From the first screen to the last production alert.',
    careerBody: 'I work across Java and Spring backends, React interfaces, PostgreSQL, Redis, Kafka, and container operations as one product flow.',
    contact: 'Have a system worth building?', contactLink: 'Start on GitHub',
  },
};

function ArrowIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5"/></svg>; }

function EvidenceLoop({ language }: { language: Language }) {
  const t = copy[language];
  const nodes = [t.signals, t.observation, t.decision, t.execution, t.outcome];
  return <div className="evidence-loop" aria-label={language === 'ko' ? '신호에서 결과까지 이어지고 다시 관찰로 돌아오는 흐름' : 'A flow from signals to outcomes and back to observation'}>
    <svg className="loop-routes" viewBox="0 0 1000 250" preserveAspectRatio="none" aria-hidden="true"><path className="route-base" d="M95 120H905"/><path className="route-return" d="M905 120V210H300V120"/><path className="route-trace" d="M95 120H905V210H300V120"/></svg>
    {nodes.map((node, index) => <div className={`loop-node n${index + 1}`} key={node}><span>0{index + 1}</span><strong>{node}</strong></div>)}
  </div>;
}

export default function HomePage({ language }: { language: Language }) {
  const t = copy[language]; const prefix = language === 'en' ? '/en' : '';
  return <main>
    <header className="site-header"><a className="wordmark" href={`${prefix}/`} aria-label="Kyungjae Lee home"><b>KJ</b><span>LEE KYUNGJAE<br/>SYSTEMS</span></a><nav>{t.nav.map((item, index) => <a href={['#systems', '#experience', '#contact'][index]} key={item}>{item}</a>)}</nav><a className="language" href={language === 'ko' ? '/en/' : '/'}>{language === 'ko' ? 'EN' : 'KO'}</a></header>
    <section className="hero"><div className="hero-meta"><span>{t.role}</span><span>AVAILABLE FOR SERIOUS SYSTEMS</span></div><h1><span>{t.titleA}</span><span>{t.titleB}</span><span className="outline">{t.titleC}</span></h1><div className="hero-bottom"><p>{t.intro}</p><a href="#systems">{t.inspect}<ArrowIcon/></a></div><div className="hero-signal" aria-hidden="true"><i/><i/><i/><i/><i/></div></section>
    <section className="systems" id="systems"><div className="section-intro"><p>{t.workLabel}</p><h2>{t.workTitle}</h2></div>
      <article className="project palamedes"><div className="project-id"><span>PALAMEDES</span><b>RESEARCH ALPHA</b></div><div className="project-copy"><p className="project-index">P—01</p><h3>Before tasks,<br/><em>choose the mission.</em></h3><p className="project-body">{t.palamedesBody}</p><dl><div><dt>{t.evidence}</dt><dd>{t.palamedesEvidence}</dd></div><div><dt>{t.boundary}</dt><dd>{t.palamedesLimit}</dd></div></dl><a href="https://github.com/LEE-Kyungjae/palamedes">{t.source}<ArrowIcon/></a></div><figure className="project-visual"><img src="/assets/projects/palamedes.png" alt="Palamedes project identity"/><figcaption>GOAL DISCOVERY · REVISION · FALSIFICATION</figcaption></figure></article>
      <article className="project gahyeon"><div className="project-id"><span>GAHYEON</span><b>ACTIVE DEVELOPMENT</b></div><figure className="project-visual gahyeon-visual"><div className="orbit"><i/><i/><i/><img src="/assets/projects/gahyeon.png" alt="Gahyeon character portrait"/></div><figcaption>ONE CORE · DISCORD · DESKTOP · UNREAL</figcaption></figure><div className="project-copy"><p className="project-index">G—02</p><h3>One mind,<br/><em>many presences.</em></h3><p className="project-body">{t.gahyeonBody}</p><dl><div><dt>{t.evidence}</dt><dd>{t.gahyeonEvidence}</dd></div><div><dt>{t.boundary}</dt><dd>{t.gahyeonLimit}</dd></div></dl><a href="https://github.com/LEE-Kyungjae/gahyeon">{t.source}<ArrowIcon/></a></div></article>
    </section>
    <section className="architecture"><div className="architecture-copy"><p>{t.architecture}</p><h2>{t.architectureTitle}</h2><div><p>{t.architectureBody}</p><ol>{t.principles.map(item => <li key={item}>{item}</li>)}</ol></div></div><EvidenceLoop language={language}/></section>
    <section className="experience" id="experience"><p>{t.career}</p><h2>{t.careerTitle}</h2><div><p>{t.careerBody}</p><ul><li>BACKEND / JAVA · SPRING · EVENT SYSTEMS</li><li>AGENTS / MISSION · MEMORY · TOOL RUNTIME</li><li>OPERATIONS / CONTAINERS · DATA · OBSERVABILITY</li></ul></div></section>
    <section className="contact" id="contact"><p>{t.contact}</p><a href="https://github.com/LEE-Kyungjae">{t.contactLink}<ArrowIcon/></a></section>
    <footer><span>© 2026 LEE KYUNGJAE</span><nav><a href={`${prefix}/services/`}>Services</a><a href={`${prefix}/legal/`}>Legal</a><a href={`${prefix}/contact/`}>Contact</a></nav><span>SEOUL · KST</span></footer>
  </main>;
}
