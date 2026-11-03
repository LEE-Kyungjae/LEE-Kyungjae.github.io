'use client';
import {useEffect,useState} from 'react';
const examples=[
 {title:'일상 대화',turns:[['나','나 오늘 아무것도 못 했어.'],['가현','하려던 건 있었는데 못 한 거야, 아니면 시작할 기운부터 없었어?'],['나','시작할 기운부터 없었어. 조언 말고 그냥 들어줘.'],['가현','응. 오늘 무슨 일이 있었는지 얘기해 줘.']]},
 {title:'취향의 변화',turns:[['나','전에는 사람 많은 카페 좋아했는데, 요즘은 조용한 곳이 좋아.'],['가현','요즘은 조용한 쪽이 편하구나. 다음에 같이 고를 땐 그쪽으로 볼게.'],['나','응, 작업할 때 갈 곳으로.'],['가현','그럼 대화하기 좋은 곳보다 조용히 작업할 수 있는 곳을 먼저 볼게.']]},
 {title:'근거가 없을 때',turns:[['나','내가 지난번에 말한 책 제목 뭐였지?'],['가현','지금 확인할 수 있는 기억에는 제목이 없어. 어떤 내용이었는지 단서 하나만 줄래?']]},
];
export default function GahyeonDialogue(){
 const [selected,setSelected]=useState(0),[visible,setVisible]=useState(99),[playing,setPlaying]=useState(false);
 const turns=examples[selected].turns;
 useEffect(()=>{if(!playing)return;if(visible>=turns.length){setPlaying(false);return;}const timer=setTimeout(()=>setVisible(v=>v+1),850);return()=>clearTimeout(timer);},[playing,visible,turns.length]);
 return <div className="dialogue-sample"><div className="sample-heading"><b>대화 샘플</b><span>미리 작성한 예시 · 모델·음성 미연결</span></div><div className="sample-options">{examples.map((e,i)=><button key={e.title} aria-pressed={selected===i} onClick={()=>{setSelected(i);setVisible(99);setPlaying(false);}}>{e.title}</button>)}</div><ol className="sample-messages" aria-label={examples[selected].title}>{turns.slice(0,visible).map(([who,line],i)=><li key={`${selected}-${i}`} data-speaker={who}><small>{who}</small><p>{line}</p></li>)}</ol><div className="sample-controls"><button onClick={()=>{if(playing){setPlaying(false);setVisible(99);}else if(matchMedia('(prefers-reduced-motion: reduce)').matches){setVisible(99);}else{setVisible(1);setPlaying(true);}}}>{playing?'전체 보기':'대화 재생'}</button><span>{playing?'순서대로 표시 중':'전체 대화 표시'}</span></div></div>;
}
