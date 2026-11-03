'use client';
import {useState} from 'react';
import plan from '../../assets/projects/product-proof-20261029/palamedes-cli.json';
export default function PlanArtifact(){
 const [selected,setSelected]=useState(2);
 const commands=['plan','evidence','show'];
 const outputs=['Result: CRITICAL_FAILURE',plan.records[2].stdout.trim(),`Goal: ${plan.plan.goal}`];
 return <div className="plan-artifact" data-operation={commands[selected]}>
  <div className="artifact-terminal"><div className="terminal-chrome"><span aria-hidden="true"><i/><i/><i/></span><code>palamedes</code><small>실제 로컬 실행 기록</small></div><div className="terminal-commands">{commands.map((command,i)=><button key={command} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span aria-hidden="true">$</span><code>palamedes {command}{i===0?' --goal … --selected-option …':i===1?' --claim …':''}</code><span aria-hidden="true">↵</span></button>)}</div><output aria-live="polite" data-error={selected===0}>{outputs[selected]}</output></div>
  <div className="artifact-connector" aria-hidden="true"><span/><i/>↓</div>
  <article className="result-file"><div><span>실제 저장 결과</span><code>.palamedes/plan.json</code></div><dl><div data-highlight={selected!==1}><dt>목표</dt><dd>{plan.plan.goal}</dd></div><div data-highlight={selected===0}><dt>선택한 방향</dt><dd>{plan.plan.selected_option}</dd></div><div data-highlight={selected===1}><dt>판단 근거</dt><dd>{plan.plan.evidence[0].claim}</dd></div><div><dt>제외 범위</dt><dd>{plan.plan.constraints[0]}</dd></div></dl></article>
 </div>;
}
