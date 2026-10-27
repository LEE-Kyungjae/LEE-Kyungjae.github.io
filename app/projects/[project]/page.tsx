import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import ProjectIntroduction from '../../components/ProjectIntroduction';
import {projectDetails,type ProjectId} from '../../components/projectDetails';
export const dynamicParams=false;
export function generateStaticParams(){return Object.keys(projectDetails).map(project=>({project}));}
export async function generateMetadata({params}:{params:Promise<{project:string}>}):Promise<Metadata>{const {project}=await params;const data=projectDetails[project as ProjectId];return data?{title:`${data.name} | 이경재`,description:data.description,alternates:{canonical:`/projects/${project}/`}}:{};}
export default async function ProjectPage({params}:{params:Promise<{project:string}>}){const {project}=await params;if(!(project in projectDetails))notFound();return <ProjectIntroduction project={project as ProjectId}/>;}
