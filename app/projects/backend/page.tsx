import type {Metadata} from 'next';
import BackendIntroduction from '../../components/BackendIntroduction';
import {backendProject} from '../../components/projectCatalog';
export const metadata:Metadata={title:'Backend | 이경재',description:backendProject.description,alternates:{canonical:'/projects/backend/'}};
export default function BackendPage(){return <BackendIntroduction/>;}
