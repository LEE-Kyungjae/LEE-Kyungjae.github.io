import type {ReactNode} from 'react';

export default function GitHubLink({href,label,children}:{href:string;label?:string;children?:ReactNode}){
 return <a className={`github-link${children?'':' github-link-icon'}`} href={href} target="_blank" rel="noopener noreferrer" aria-label={label??(children?undefined:'GitHub')} title={label}>
  <span className="github-mark" aria-hidden="true"/>{children}
 </a>;
}
