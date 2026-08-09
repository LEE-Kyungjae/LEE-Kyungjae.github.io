'use client';

import { useState } from 'react';

type Language = 'ko' | 'en';
type ProjectKey = 'palamedes' | 'gahyeon' | 'adelie';

const projects = {
  palamedes: {
    number: '01', title: 'Palamedes', state: 'RESEARCH BETA',
    ko: { summary: '실행 방법보다 먼저, 계획할 가치가 있는 임무를 발견하는 자율형 AI 사전 계획기.', detail: '경쟁 해석과 증거·반증을 거쳐 살아남은 임무만 실행 계층으로 전달합니다.' },
    en: { summary: 'An autonomous pre-planner that finds the mission worth pursuing before deciding how to execute.', detail: 'Competing interpretations, evidence and falsification filter missions before they reach execution.' },
    stack: 'Python · TypeScript · Multi-agent', href: 'https://github.com/LEE-Kyungjae/Palamedes', accent: 'mission'
  },
  gahyeon: {
    number: '02', title: 'GahyeonBot', state: 'ACTIVE',
    ko: { summary: 'Discord 안에서 텍스트와 음성으로 대화하며 일상 작업을 이어가는 AI 비서.', detail: 'Discord 이벤트, Spring 서비스 로직과 음성 AI를 하나의 운영 가능한 시스템으로 연결했습니다.' },
    en: { summary: 'A Discord-native AI assistant that carries everyday work across text and voice.', detail: 'Discord events, Spring services and voice AI operate as one connected system.' },
    stack: 'Java 21 · Spring Boot · Voice AI', href: 'https://github.com/LEE-Kyungjae/gahyeonbot', accent: 'voice'
  },
  adelie: {
    number: '03', title: 'Adelie Terminal', state: 'ACTIVE',
    ko: { summary: '웹과 모바일에서 원격 개발 세션을 이어가는 개발자용 서버 인터페이스.', detail: '원격 세션과 서버를 여러 클라이언트에 안전하게 연결하고 직접 운영합니다.' },
    en: { summary: 'A server interface for continuing remote development sessions from web and mobile.', detail: 'Remote sessions and servers stay connected across clients as an operated product.' },
    stack: 'Server · Web · Mobile', href: '/termi-agent/', accent: 'terminal'
  }
} as const;

const copy = {
  ko: {
    nav: ['작업', '서비스', '정책'], status: 'KoreaPDS IT서비스 연구원 · 2025—현재',
    heroA: '서비스를 만들고,', heroB: '끝까지 운영합니다.', lede: '에이전트부터 백엔드와 인터페이스까지. 직접 쓰이고 오래 남는 시스템을 설계합니다.',
    explore: '프로젝트 보기', selected: 'Selected systems', projectTitle: '결과와 구조를\n한 화면에.', surface: '무엇을 만드는가', inside: '어떻게 작동하는가', open: '프로젝트 열기',
    process: 'How I build', processTitle: '출시가 끝이 아니라\n운영의 시작입니다.',
    steps: [['01','구상','쓸 이유를 찾습니다.'],['02','구축','끝까지 연결합니다.'],['03','출시','사용 가능한 상태로 냅니다.'],['04','운영','실패를 관찰하고 복구합니다.'],['05','진화','다시 쓰기 좋게 만듭니다.']],
    capabilities: 'Capability, with evidence', career: 'Career', running: '만든 서비스는\n계속 움직입니다.', services: '서비스 보기', language: 'EN'
  },
  en: {
    nav: ['Work', 'Services', 'Legal'], status: 'IT Service Researcher at KoreaPDS · 2025—Present',
    heroA: 'I build services', heroB: 'and keep them running.', lede: 'From agents to backends and interfaces, I design systems made to be used and improved over time.',
    explore: 'Explore projects', selected: 'Selected systems', projectTitle: 'See the result.\nThen see inside.', surface: 'What it does', inside: 'How it works', open: 'Open project',
    process: 'How I build', processTitle: 'Shipping is not the end.\nIt starts operations.',
    steps: [['01','Frame','Find a reason to exist.'],['02','Build','Connect the whole path.'],['03','Ship','Make it usable.'],['04','Operate','Observe and recover.'],['05','Evolve','Make it better again.']],
    capabilities: 'Capability, with evidence', career: 'Career', running: 'The services I build\nkeep moving.', services: 'View services', language: 'KO'
  }
} as const;

export default function HomePage({ language }: { language: Language }) {
  const t = copy[language];
  const [selected, setSelected] = useState<ProjectKey>('palamedes');
  const [mode, setMode] = useState<'surface' | 'inside'>('surface');
  const project = projects[selected];
  const home = language === 'ko' ? '/' : '/en/';
  const prefix = language === 'ko' ? '' : '/en';

  return <div className="site-frame">
    <header className="topbar">
      <a className="brand" href={home}><span className="brand-dot">KJ</span><span>Kyungjae Lee</span></a>
      <nav><a href="#work">{t.nav[0]}</a><a href={`${prefix}/services/`}>{t.nav[1]}</a><a href={`${prefix}/legal/`}>{t.nav[2]}</a></nav>
      <div className="nav-actions"><a className="lang" href={language === 'ko' ? '/en/' : '/'}>{t.language}</a><a className="github" href="https://github.com/LEE-Kyungjae">GitHub ↗</a></div>
    </header>

    <main>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><i />{t.status}</p>
          <h1>{t.heroA}<br/><em>{t.heroB}</em></h1>
          <p className="hero-lede">{t.lede}</p>
          <div className="hero-actions"><a href="#work" className="primary">{t.explore}<span>↓</span></a><a href="https://github.com/LEE-Kyungjae" className="plain">GitHub ↗</a></div>
        </div>
        <div className="system-map" aria-label="Live system map">
          <div className="map-head"><span>LIVE SYSTEM MAP</span><span>37° N / 127° E</span></div>
          <div className="radar"><div className="core"><strong>KJ</strong><small>BUILD / OPERATE</small></div><span className="node n1">AGENT</span><span className="node n2">BACKEND</span><span className="node n3">INTERFACE</span><span className="node n4">OPS</span><i className="packet p1"/><i className="packet p2"/></div>
          <div className="map-foot"><span>DESIGN</span><i/><span>BUILD</span><i/><span>SHIP</span><i/><b>OPERATE</b></div>
        </div>
        <div className="scroll-cue">SCROLL TO EXPLORE <span>↓</span></div>
      </section>

      <section className="proof"><div><span>01 / SCOPE</span><strong>Agent · Backend · Interface</strong></div><div><span>02 / PRACTICE</span><strong>Design → Build → Operate</strong></div><div><span>03 / STATUS</span><strong><i/> Systems in production</strong></div></section>

      <section className="work" id="work">
        <div className="section-head"><div><p>{t.selected}</p><h2>{t.projectTitle.split('\n').map((x,i)=><span key={x}>{x}{i===0&&<br/>}</span>)}</h2></div><div className="mode-switch"><button className={mode==='surface'?'active':''} onClick={()=>setMode('surface')}>SERVICE</button><button className={mode==='inside'?'active':''} onClick={()=>setMode('inside')}>SYSTEM</button></div></div>
        <div className="project-browser">
          <div className="project-tabs">{(Object.keys(projects) as ProjectKey[]).map(key=><button key={key} className={selected===key?'active':''} onClick={()=>setSelected(key)}><span>{projects[key].number}</span><strong>{projects[key].title}</strong><small>{projects[key].state}</small></button>)}</div>
          <article className="project-card">
            <div className="project-top"><span><i/>{project.state}</span><b>{project.number} / 03</b></div>
            <div className="project-main">
              <div className="project-copy"><small>{mode==='surface'?t.surface:t.inside}</small><h3>{project.title}</h3><p>{project[language][mode==='surface'?'summary':'detail']}</p><a href={project.href}>{t.open} ↗</a></div>
              <div className={`project-visual ${project.accent}`}><span>{project.stack}</span><div className="visual-lines"><i/><i/><i/></div><strong>{mode==='surface'?'BUILD THE SERVICE':'SEE THE SYSTEM'}</strong></div>
            </div>
            <footer><div><span>ROLE</span><b>Design · Build · Operate</b></div><div><span>STACK</span><b>{project.stack}</b></div><div><span>OWNERSHIP</span><b>End to end</b></div></footer>
          </article>
        </div>
      </section>

      <section className="process"><div className="process-head"><p>{t.process}</p><h2>{t.processTitle.split('\n').map((x,i)=><span key={x}>{x}{i===0&&<br/>}</span>)}</h2></div><ol>{t.steps.map(step=><li key={step[0]}><span>{step[0]}</span><strong>{step[1]}</strong><small>{step[2]}</small></li>)}</ol></section>

      <section className="evidence"><p>{t.capabilities}</p><div>{[['01','Agent systems','Palamedes · GahyeonBot','Planning · Tools · Voice'],['02','Backend systems','Spring · Kafka · Redis','Events · State · Recovery'],['03','Full-stack product','Web · Mobile · Server','Experience through deployment'],['04','Service operations','k3s · Docker · PostgreSQL','Operations after launch']].map(row=><article key={row[0]}><span>{row[0]}</span><h3>{row[1]}</h3><p>{row[2]}</p><b>{row[3]}</b></article>)}</div></section>

      <section className="career"><p>{t.career}</p><div><time>2025—{language==='ko'?'현재':'Present'}</time><strong>KoreaPDS <i/></strong><span>{language==='ko'?'IT서비스 연구원':'IT Service Researcher'}</span></div><div><time>2023</time><strong>立命館大学</strong><span>情報システム工学 学士</span></div><div><time>{language==='ko'?'자격':'Certificate'}</time><strong>SQLD</strong><span>SQL Developer</span></div></section>

      <section className="cta"><p>STILL RUNNING</p><h2>{t.running.split('\n').map((x,i)=><span key={x}>{x}{i===0&&<br/>}</span>)}</h2><a href={`${prefix}/services/`}>{t.services} →</a></section>
    </main>
    <footer className="footer"><strong>Kyungjae Lee</strong><nav><a href={`${prefix}/contact/`}>Contact</a><a href={`${prefix}/legal/`}>Legal</a><a href="https://github.com/LEE-Kyungjae">GitHub ↗</a></nav><span>THINK · ACT · RECOVER</span></footer>
  </div>;
}
