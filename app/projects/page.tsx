import {backendProject,extraProjects} from '../components/projectCatalog';
import {projectDetails} from '../components/projectDetails';
import {brainProjects,brainField,brainFields} from '../components/brainProjects';
import '../components/project-expansion.css';
export const metadata={title:'프로젝트 | 이경재',description:'이경재의 프로젝트 목록'};

// Plain list fallback for the 3D brain view. Order and categories follow brainProjects.
const number=(id:string)=>String(brainProjects.findIndex(p=>p.id===id)+1).padStart(2,'0');
const field=(id:string)=>brainFields[brainField(id)].name;
const listed=[{...backendProject,stack:'Java · Spring',private:false},...extraProjects.slice(1)];

export default function Projects(){return <main className="project-catalog">
 <a className="project-back" href="/#brain" aria-label="3D 뇌 화면으로 돌아가기">←</a>
 <h1>프로젝트</h1>
 <p className="catalog-lead">{brainProjects.length}개 프로젝트를 한 번에 볼 수 있는 목록입니다. <a href="/#brain">3D 화면으로 보기 ↗</a></p>
 <div className="catalog-featured">{(['palamedes','gahyeon'] as const).map(id=><a key={id} href={`/projects/${id}/`}><img src={`/assets/projects/keyart-20261027/layers/${id}-background.webp`} alt=""/><div><span>{number(id)} · {field(id)}</span><h2>{projectDetails[id].name} ↗</h2><p>{projectDetails[id].description}</p></div></a>)}</div>
 <a className="catalog-insight" href="/projects/insight-rag/"><div><span>{number('insight-rag')} · {field('insight-rag')} · 구현 참조 검색 · RAG</span><h2>insight-rag ↗</h2><p>{extraProjects[0].description}</p></div><div className="catalog-index-art" aria-hidden="true"><span>CODE / TEST / DOC</span><i>COMPONENT</i><strong>QUERY → EVIDENCE</strong></div></a>
 <div className="catalog-tools">{listed.map(p=><a key={p.id} href={`/projects/${p.id}/`}><span className="catalog-number">{number(p.id)}</span><div><small>{field(p.id)} · {p.kind}</small><h2>{p.name}</h2><p>{p.description}</p><span>{p.stack}{p.private?' · 비공개 저장소':''}</span></div><span aria-hidden="true">↗</span></a>)}</div>
</main>}
