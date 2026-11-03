import {extraProjects} from './projectCatalog';

// One node per destination; keep the original three indices stable.
export const brainProjects=[
 {id:'palamedes',name:'Palamedes'},
 {id:'gahyeon',name:'Gahyeon'},
 {id:'backend',name:'Backend'},
 ...extraProjects.map(({id,name})=>({id,name:id==='termi'?'termi · 아델리 터미널':name})),
];

export const brainFields={
 ai:{name:'AI·판단',color:'#c7a5ff'},
 tools:{name:'개발·운영 도구',color:'#78d9bc'},
 web:{name:'인터랙티브 웹',color:'#7cc7ff'},
 backend:{name:'백엔드',color:'#f3bd76'},
} as const;
export function brainField(id:string):keyof typeof brainFields{
 if(['palamedes','gahyeon','insight-rag','laplaces-demon'].includes(id))return 'ai';
 if(['brain-workspace-demo','ocean-atlas-scroll'].includes(id))return 'web';
 return id==='backend'?'backend':'tools';
}
