"use client";
import {useState} from 'react';
import evidence from '../../assets/projects/purpose-evidence-20261103/promdeck-live.json';
import './purpose-runtime.css';
const root='/assets/projects/purpose-evidence-20261103/';
const labels=['정상 수집 대상','평균 CPU 사용률','헤드 시계열 수'];
export default function DeviceMetrics(){
 const [selected,setSelected]=useState(0);
 const result=evidence.results[selected];
 return <section className="device-metrics" aria-label="실제 인프라 지표와 장치용 출력">
  <header><small>실제 인프라 조회 · 2026-11-03 기록</small><h2>Prometheus 지표를 Stream Deck 키 화면으로</h2><p>서버 지표를 조회하고 숫자·상태·추이를 작은 키 화면으로 변환합니다. 아래 이미지는 실제 인프라의 응답을 원본 렌더러에 전달해 만든 출력입니다.</p></header>
  <div className="metrics-path"><span>Prometheus</span><span aria-hidden="true">→</span><code>evaluate</code><span aria-hidden="true">→</span><code>renderButtonSvg</code></div>
  <div className="metrics-keys">{evidence.results.map((item,index)=><button key={item.spec.title} aria-pressed={selected===index} onClick={()=>setSelected(index)}><img src={root+`promdeck-live-${index}.svg`} alt={`${item.spec.title}: ${item.model.value.toFixed(item.spec.decimals)}${item.model.unit}`}/><span>{labels[index]}</span></button>)}</div>
  <div className="metric-inspection" aria-live="polite"><div><small>실제 조회식</small><code>{result.spec.query}</code></div><div><small>수신 값</small><strong>{result.model.value.toFixed(result.spec.decimals)}{result.model.unit}</strong><span>최근 5분 · {result.model.samples.length}개 표본</span></div></div>
  <p className="runtime-scope">기록된 조회 결과이며 현재 실시간 값은 아닙니다. 연결된 실물 장치가 없어 키 디스플레이 출력·물리 버튼 조작은 이번 실행에서 확인하지 못했습니다.</p><a href={root+'promdeck-live.json'}>조회값·시계열 원문 ↗</a>
 </section>
}
