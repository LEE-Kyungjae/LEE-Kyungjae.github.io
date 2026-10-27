'use client';
import { useEffect, useRef, useState } from 'react';
import BrainScene from './BrainScene';
import ProjectArtwork from './ProjectArtwork';
import EngineeringPractice from './EngineeringPractice';
type Language = 'ko' | 'en';

const projectCopy = {
  palamedesBody: 'AI가 수행할 목표와 제외 범위를 정하고, 검토 결과를 기록하는 도구입니다.',
  gahyeonBody: 'Discord 음성 비서와 데스크톱 캐릭터의 공통 로직을 개발합니다. Unreal 클라이언트도 연결하고 있습니다.',
  careerBody: 'Java와 Spring 기반 서버 개발',
};
const copy = {
  ko: {
    ...projectCopy,
    nav: ['프로젝트', '개발 방식', '연락'], role: '소프트웨어 개발자',
    inspect: '프로젝트 보기', workLabel: '프로젝트', source: 'GitHub', contactLink: 'GitHub',
  },
  en: {
    ...projectCopy,
    nav: ['Systems', 'Experience', 'Contact'], role: 'SYSTEMS ENGINEER',
    inspect: 'Inspect systems', workLabel: 'SELECTED SYSTEMS', source: 'GitHub', contactLink: 'GitHub',
  },
};

function ArrowIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5"/></svg>; }

export default function HomePage({ language }: { language: Language }) {
  const t = copy[language]; const prefix = language === 'en' ? '/en' : '';
  const track = useRef<HTMLElement>(null), progress = useRef(0);
  const [selected, setSelected] = useState(0), [calm, setCalm] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setCalm(media.matches); sync(); media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0; const el = track.current; if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = calm ? 0 : Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight + 76)));
      progress.current = p;
      const blend = Math.max(0, Math.min(1, (p - .1) / .5));
      const eased = blend * blend * (3 - 2 * blend);
      el.style.setProperty('--travel', String(eased));
      el.style.setProperty('--intro-opacity', String(1 - Math.min(1, p * 3.3)));
      el.style.setProperty('--detail-opacity', String(Math.max(0, Math.min(1, (p - .28) * 3))));
      el.dataset.chapter = p < .35 ? 'intro' : 'detail';
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', scroll, { passive: true }); window.addEventListener('resize', scroll); update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); };
  }, [calm]);
  const names = ['Palamedes', 'Gahyeon', 'Backend'];
  const descriptions = ['AI 목표 설정 도구', '음성 대화와 실시간 캐릭터', t.careerBody];
  const choose = (index: number) => { setSelected(index); if (calm) document.getElementById(['palamedes', 'gahyeon', 'experience'][index])?.scrollIntoView({ behavior: 'instant' }); if (!calm && track.current) window.scrollTo({ top: track.current.offsetTop + (track.current.offsetHeight - innerHeight + 76) * .7, behavior: 'smooth' }); };
  return <main className={`portfolio ${calm ? 'is-calm' : ''}`}>
    <a className="skip-link" href="#systems">{t.inspect}</a>
    <header className="portfolio-header"><a className="portfolio-logo" href={`${prefix}/`}><span className="logo-orbit" aria-hidden="true">✳</span> 이경재<span className="logo-dot"/></a><nav aria-label="메뉴">{t.nav.map((item, index) => <a href={['#systems','#experience','#contact'][index]} key={item}>{item}</a>)}</nav><div className="header-tools"><button onClick={() => setCalm(v => !v)} aria-pressed={calm} aria-label="모션 줄이기">{calm ? 'Ⅱ' : '◌'}</button><a href={language === 'ko' ? '/en/' : '/'}>{language === 'ko' ? 'EN' : 'KO'}</a></div></header>
    <section ref={track} className="atlas-track" aria-label="프로젝트 탐색">
      <div className="atlas-stage">
        <div className="atlas-grid" aria-hidden="true"/>
        <div className="atlas-intro"><p className="eyebrow">{t.role}</p><h1>이경재</h1><a className="pill-action" href="#systems">{t.inspect}<ArrowIcon/></a></div>
        <div className="atlas-brain"><BrainScene progress={progress} selected={selected} onSelect={choose}/></div>
        <div className="atlas-detail"><span className="eyebrow">0{selected + 1} / 03</span><h2>{names[selected]}</h2><p>{descriptions[selected]}</p><a className="text-action" href={selected === 0 ? '#palamedes' : selected === 1 ? '#gahyeon' : '#experience'}>{t.inspect}<ArrowIcon/></a></div>
        <nav className="project-rail" aria-label="프로젝트 선택">{names.map((name,index) => <button key={name} aria-pressed={selected===index} onClick={() => choose(index)}><small>0{index+1}</small><strong>{name}</strong><span>↗</span></button>)}</nav>
        <div className="atlas-scroll" aria-hidden="true"><span>↓</span><div><i/></div></div>
      </div>
    </section>
    <section className="work-section" id="systems"><div className="work-heading"><p className="eyebrow">{t.workLabel}</p></div><div className="work-grid">
      <article className="work-card" id="palamedes"><ProjectArtwork project="palamedes" number="01" status="연구 중" calm={calm}/><div className="work-card-info"><p>{t.palamedesBody}</p><a className="text-action" href="https://github.com/LEE-Kyungjae/palamedes">{t.source}<ArrowIcon/></a></div></article>
      <article className="work-card" id="gahyeon"><ProjectArtwork project="gahyeon" number="02" status="개발 중" calm={calm}/><div className="work-card-info"><p>{t.gahyeonBody}</p><a className="text-action" href="https://github.com/LEE-Kyungjae/gahyeon">{t.source}<ArrowIcon/></a></div></article>
    </div></section>
    <EngineeringPractice calm={calm}/>
    <section className="portfolio-contact" id="contact"><p className="eyebrow">{t.nav[2]}</p><a href="https://github.com/LEE-Kyungjae">{t.contactLink}<span>↗</span></a><span className="contact-star" aria-hidden="true">✳</span></section>
    <footer className="portfolio-footer"><span>© 2026 이경재</span><nav><a href={`${prefix}/services/`}>Services</a><a href={`${prefix}/legal/`}>Legal</a><a href={`${prefix}/contact/`}>Contact</a><a href="/assets/brain/MODEL-LICENSE.txt">3D credits</a></nav><a href="#">↑</a></footer>
  </main>;
}
