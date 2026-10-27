'use client';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';

const palamedes = 'https://github.com/LEE-Kyungjae/palamedes/blob/0d0737dc73664488b1294aac9169b1b5c86b2ea7/';
const gahyeon = 'https://github.com/LEE-Kyungjae/gahyeon/blob/0edd9c93d13f654b3b80f347ed6bdfae287c677c/';
const practices = [
  {
    label: '문제 정의', title: '전략 변경 검증',
    example: '전략을 수정할 때 원래 목표와 제외 범위가 유지되는지 검사합니다. 목표를 바꿔야 한다면 재검토 조건을 별도로 기록합니다.',
    fact: 'Palamedes', asset: 'lens', core: [55,61], x: 16, y: 50,
    sources: [
      {label: '목표 보존 검사', url: palamedes + 'palamedes_mission/_05_boundary_strategy.py#L106'},
      {label: '방향 전환 조건', url: palamedes + 'palamedes_mission/_03_authority_portfolio.py#L356'},
    ],
  },
  {
    label: '실행 경계', title: '실행 전 증거 확인',
    example: 'AI의 제안을 실행하기 전에 증거 파일의 해시와 제안 버전을 확인합니다. 증거가 바뀌었거나 오래된 제안이면 실행을 거부합니다.',
    fact: 'Palamedes', asset: 'gate', core: [50,49], x: 39, y: 54,
    sources: [
      {label: '실행 검증 코드', url: palamedes + 'palamedes_gate_resolution.py#L37'},
      {label: '거부 테스트', url: palamedes + 'tests/test_palamedes_gate_resolution.py#L32'},
    ],
  },
  {
    label: '런타임 구조', title: '클라이언트 간 공통 로직',
    example: '대화 로직과 플랫폼 연결 코드를 분리해 Discord, 데스크톱, Unreal에서 재사용합니다. 의존성 검사로 두 영역이 다시 얽히는지 확인합니다.',
    fact: 'Gahyeon', note: '현재 의존성 검사에서 위반 2건이 남아 있습니다.', asset: 'runtime', core: [52.5,19], x: 62, y: 48,
    sources: [
      {label: '공통 로직 구조', url: gahyeon + 'docs/ARCHITECTURE.md#L14'},
      {label: '경계 위반 검사 코드', url: gahyeon + 'scripts/verify_core_platform_boundaries.py#L34'},
    ],
  },
  {
    label: '검증과 복구', title: '취소와 재처리',
    example: '취소된 작업의 응답을 무시하고, 큐가 가득 차 처리하지 못한 이벤트는 재시도합니다. C++ 런타임 테스트로 취소와 복구 동작을 확인했습니다.',
    fact: 'Gahyeon', asset: 'recovery', core: [53.5,33.5], x: 85, y: 56,
    sources: [
      {label: '이벤트 재처리', url: gahyeon + 'unreal/GahyeonStage/Source/GahyeonRuntimeCore/Private/ProtocolGameThreadDispatcher.cpp#L16'},
      {label: '취소와 복구 테스트', url: gahyeon + 'unreal/RuntimeCore/tests/RuntimeCoreTests.cpp#L1471'},
      {label: '배포 확인', url: gahyeon + '.github/workflows/verify-production.yml#L40'},
    ],
  },
];

// Separated stepped traces avoid overlapping bundles around the footprint.
const floorTraces = Array.from({length:12},(_,index)=>{
  const lane=index%3, turn=Math.floor(index/3);
  return {d:`M4 ${5+lane*7}H${18+lane*7}V${27+lane*4}H${37+lane*2}`,turn};
});

export default function EngineeringPractice({ calm }: { calm: boolean }) {
  const [selected, setSelected] = useState(0), [visible, setVisible] = useState(false);
  const section = useRef<HTMLElement>(null), tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = practices[selected];
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [focused, setFocused] = useState(0);
  const [zoomed, setZoomed] = useState<number|null>(null);
  const [request, setRequest] = useState<{from:number|null;to:number;id:number}|null>(null);
  const [arrived, setArrived] = useState<{to:number;id:number}|null>(null);
  const [moving, setMoving] = useState(false);
  const lastActivated = useRef<number|null>(null), sequence = useRef(0);
  const activate = (index:number) => {
    setZoomed(index);
    if (lastActivated.current===index) return;
    const from=lastActivated.current; lastActivated.current=index;
    setActive(null); setSelected(index); setFocused(index); setArrived(null);
    setRequest({from,to:index,id:++sequence.current});
  };
  useEffect(() => {
    let inView = false;
    const update = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); }, {threshold: .05});
    observer.observe(section.current!); document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  useEffect(() => {
    if (!request) return;
    setMoving(true);
    const collect=window.setTimeout(()=>setArrived({to:request.to,id:request.id}),calm?0:180);
    const complete=window.setTimeout(()=>{setActive(request.to);setMoving(false);},calm?0:1250);
    return ()=>{window.clearTimeout(collect);window.clearTimeout(complete);};
  },[request,calm]);
  const keydown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % practices.length;
    else if (event.key === 'ArrowLeft') next = (index + practices.length - 1) % practices.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = practices.length - 1;
    else return;
    event.preventDefault(); setFocused(next); tabs.current[next]?.focus();
  };
  return <section ref={section} className="engineering" id="experience" data-animate={visible && !calm} aria-labelledby="engineering-heading">
    <div className="engineering-intro"><h2 id="engineering-heading">개발 방식</h2></div>
    <div className="engineering-map" data-selected={selected}>
      <div ref={stage} className="engineering-stage" data-active={active ?? 'none'} data-from={request?.from ?? 'none'} data-to={request?.to ?? 'none'} data-moving={moving} role="tablist" aria-label="설계 역량" onClick={event=>{if(!(event.target as Element).closest('.engineering-device'))setZoomed(null);}} onKeyDown={event=>{if(event.key==='Escape')setZoomed(null);}}>
        <div className="engineering-world" data-focused={zoomed!==null} style={{'--focus-x':`${practices[zoomed??selected].x}%`,'--focus-y':`${practices[zoomed??selected].y+8}%`,'--mobile-focus-x':`${(zoomed??selected)%2?75:25}%`,'--mobile-focus-y':`${(zoomed??selected)<2?25:75}%`} as CSSProperties}>
        <img className="engineering-background" src="/assets/projects/engineering-20261027/sky/sky.webp" alt="" width="1536" height="768" loading="lazy" draggable={false}/>
        <div className="engineering-clouds engineering-clouds-far" aria-hidden="true"/>
        <div className="engineering-clouds engineering-clouds-near" aria-hidden="true"/>
        {practices.map((item,index)=><button type="button" role="tab" className="engineering-device" data-energized={active===index} data-sending={moving && request?.from===index} data-collecting={moving && arrived?.to===index} data-receiving={arrived?.to===index} id={`engineering-tab-${index}`} aria-controls="engineering-panel" aria-selected={selected===index} tabIndex={focused===index?0:-1} ref={el=>{tabs.current[index]=el;}} key={item.asset} style={{'--float-delay':`${-index*1.7}s`,'--device-x':`${item.x}%`,'--device-y':`${item.y}%`,'--device-color':index===2?'#85e8f1':'#efc185','--phase':'0s','--core-x':`${item.core[0]}%`,'--core-y':`${item.core[1]}%`} as CSSProperties} onFocus={()=>setFocused(index)} onKeyDown={e=>keydown(e,index)} onClick={()=>activate(index)}>
          <span className="engineering-airframe">
          <img className="engineering-island" src={`/assets/projects/engineering-20261027/sky/${item.asset}-island.webp`} alt="" width="1536" height="1024" loading="lazy" draggable={false}/>
          <svg key={`floor-${request?.id??0}`} className="island-floor-energy" viewBox="0 0 100 160" aria-hidden="true">
            <defs><clipPath id={`floor-clip-${item.asset}`}><ellipse cx="50" cy="94" rx="43" ry="12"/></clipPath></defs>
            <g clipPath={`url(#floor-clip-${item.asset})`}>
              <g transform="matrix(.88 .1 -.52 .23 50 94)">
                {floorTraces.map(({d,turn},i)=><g key={i} transform={`rotate(${turn*90})`}>
                  <path className="floor-etch" vectorEffect="non-scaling-stroke" d={d}/>
                  <path className="floor-energy" vectorEffect="non-scaling-stroke" pathLength="100" d={d} style={{'--trace-delay':`${(i%3)*.055}s`} as CSSProperties}/>
                </g>)}
              </g>
            </g>
          </svg>
          <span className="engineering-device-ground" aria-hidden="true"/>
          <span className="engineering-machine">
            <span className={`engineering-port engineering-port-${item.asset}`} aria-hidden="true"/>
            <img className="engineering-device-art" src={`/assets/projects/engineering-20261027/layers/${item.asset}.webp`} alt="" width="1024" height="1024" loading="lazy" draggable={false}/>
            {index===3 ? <span className="engineering-rotor-plane" aria-hidden="true"><img className="engineering-rotor" src="/assets/projects/engineering-20261027/vfx/rotor-v2.png" alt="" width="700" height="700" loading="eager" decoding="async" draggable={false}/></span> : <span className={`engineering-attachment engineering-attachment-${item.asset}`} aria-hidden="true"><span key={item.asset} className={`engineering-vfx engineering-vfx-${index===2?'runtime':'condense'}`}/></span>}
            {active===index && <img key={`relight-${arrived?.id}`} className="engineering-relight" src={`/assets/projects/engineering-20261027/layers/${item.asset}.webp`} alt="" width="1024" height="1024" draggable={false}/>}
          </span>
          </span>
          <span className="engineering-device-label"><span>0{index+1}</span><strong>{item.label}</strong></span>
        </button>)}
        </div>
      </div>
      <div id="engineering-panel" className="engineering-panel" role="tabpanel" aria-labelledby={`engineering-tab-${selected}`} tabIndex={0}>
        <div className="engineering-value"><span className="engineering-fact">{current.fact}</span><h3>{current.title}</h3></div>
        <div className="engineering-evidence"><p>{current.example}</p>{current.note&&<p className="engineering-note">{current.note}</p>}<div className="engineering-sources">{current.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<span aria-hidden="true">↗</span></a>)}</div></div>
      </div>
    </div>
  </section>;
}
