import type {Metadata} from 'next';
import BackendIntroduction from '../../components/BackendIntroduction';
export const metadata:Metadata={title:'Backend | 이경재',description:'Java와 Spring 기반 서버 개발',alternates:{canonical:'/projects/backend/'}};
export default function BackendPage(){return <BackendIntroduction/>;}
