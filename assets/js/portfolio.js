(() => {
  const browser = document.querySelector('.system-browser');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('motion-ready');

  const projects = {
    ko: {
      palamedes: { number: '01', title: 'Palamedes', status: 'RESEARCH BETA', service: '실행 에이전트가 방법을 정하기 전에, 계획할 가치가 있는 임무부터 판단하는 자율형 AI 사전 계획기.', system: '수정·복원 가능한 계획 상태 위에서 경쟁 해석, 후보 임무, 증거와 반증을 거쳐 살아남은 임무만 전달하는 plan-state kernel.', role: 'Product research · System design · Evaluation', surface: 'Research interface', stack: 'Python · TypeScript · Plan-state kernel', link: 'https://github.com/LEE-Kyungjae/Palamedes' },
      gahyeon: { number: '02', title: '가현봇', status: 'ACTIVE', service: 'Discord 안에서 텍스트와 음성으로 대화하고 일상 작업을 이어가는 AI 비서.', system: 'Spring 기반 서비스 로직에 Discord 이벤트와 음성 AI 인터페이스를 연결한 대화형 시스템.', role: 'Backend · AI features · Operations', surface: 'Discord · Text · Voice', stack: 'Java 21 · Spring Boot · Voice AI', link: 'https://github.com/LEE-Kyungjae/gahyeonbot' },
      adelie: { number: '03', title: '아델리 터미널', status: 'ACTIVE', service: '웹과 앱에서 개발 환경에 원격으로 접속해 바이브코딩을 이어가는 서버 인터페이스.', system: '원격 개발 세션과 서버를 웹·모바일 클라이언트에 연결하도록 설계한 개발자 도구.', role: 'Product design · Server · Full stack', surface: 'Web · Mobile · Remote', stack: 'Server · Web · Mobile', link: '/termi-agent/' }
    },
    en: {
      palamedes: { number: '01', title: 'Palamedes', status: 'RESEARCH BETA', service: 'An autonomous pre-planner that decides which mission is worth planning before execution agents decide how.', system: 'A plan-state kernel that preserves revision and restore state, then passes only missions surviving competing interpretations, evidence and falsification.', role: 'Product research · System design · Evaluation', surface: 'Research interface', stack: 'Python · TypeScript · Plan-state kernel', link: 'https://github.com/LEE-Kyungjae/Palamedes' },
      gahyeon: { number: '02', title: 'GahyeonBot', status: 'ACTIVE', service: 'A Discord-native AI assistant that carries everyday work across text and voice conversations.', system: 'A conversational system connecting Discord events and voice AI to Spring-based service logic.', role: 'Backend · AI features · Operations', surface: 'Discord · Text · Voice', stack: 'Java 21 · Spring Boot · Voice AI', link: 'https://github.com/LEE-Kyungjae/gahyeonbot' },
      adelie: { number: '03', title: 'Adelie Terminal', status: 'ACTIVE', service: 'A server interface for continuing vibe-coding sessions remotely from web and mobile.', system: 'A developer tool connecting remote development sessions and servers to web and mobile clients.', role: 'Product design · Server · Full stack', surface: 'Web · Mobile · Remote', stack: 'Server · Web · Mobile', link: '/en/termi-agent/' }
    }
  };

  if (browser) {
    const language = document.documentElement.lang === 'en' ? 'en' : 'ko';
    const switchButtons = document.querySelectorAll('.view-switch button');
    const projectButtons = browser.querySelectorAll('.project-tabs button');
    const setText = (field, value) => browser.querySelectorAll(`[data-field="${field}"]`).forEach((node) => { node.textContent = value; });

    switchButtons.forEach((button) => button.addEventListener('click', () => {
      const mode = button.dataset.view;
      switchButtons.forEach((item) => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
      browser.querySelectorAll('.view-copy').forEach((item) => item.classList.add('is-changing'));
      window.setTimeout(() => {
        browser.dataset.mode = mode;
        document.querySelectorAll('[data-service][data-system]').forEach((item) => { item.textContent = item.dataset[mode]; });
        browser.querySelectorAll('.view-copy').forEach((item) => item.classList.remove('is-changing'));
      }, reducedMotion ? 0 : 130);
    }));

    projectButtons.forEach((button) => button.addEventListener('click', () => {
      const data = projects[language][button.dataset.project];
      projectButtons.forEach((item) => item.setAttribute('aria-selected', String(item === button)));
      const stage = browser.querySelector('.project-stage');
      stage.classList.add('is-updating');
      window.setTimeout(() => {
        ['number', 'title', 'status', 'service', 'system', 'role', 'surface', 'stack'].forEach((field) => setText(field, data[field]));
        const link = browser.querySelector('[data-field="link"]'); link.href = data.link;
        stage.classList.remove('is-updating');
      }, reducedMotion ? 0 : 150);
    }));
  }

  document.querySelectorAll('.lifecycle button').forEach((button, index, buttons) => button.addEventListener('click', () => {
    buttons.forEach((item) => item.classList.toggle('is-active', item === button));
    const progress = document.querySelector('.lifecycle-line b');
    if (progress) {
      if (window.matchMedia('(max-width: 640px)').matches) progress.style.height = `${(index + .5) * 20}%`;
      else progress.style.width = `${(index + .5) * 20}%`;
    }
  }));

  const revealItems = document.querySelectorAll('.systems-head, .system-browser, .lifecycle-section header, .lifecycle, .capability-evidence, .career-section, .service-cta');
  revealItems.forEach((item) => item.classList.add('reveal-item'));
  if (reducedMotion || !('IntersectionObserver' in window)) revealItems.forEach((item) => item.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach((item) => observer.observe(item));
    window.setTimeout(() => revealItems.forEach((item) => item.classList.add('is-visible')), 900);
  }
})();
