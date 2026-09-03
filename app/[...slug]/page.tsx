import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { notFound } from 'next/navigation';

type Entry = { permalink: string; title: string; lang: 'ko' | 'en'; content: string; file: string };

function sourceEntries(): Entry[] {
  const roots = ['_pages', '_legal'];
  return roots.flatMap(root => fs.readdirSync(path.join(process.cwd(), root)).map(file => {
    const full = path.join(process.cwd(), root, file);
    const parsed = matter(fs.readFileSync(full, 'utf8'));
    return {
      permalink: String(parsed.data.permalink || ''),
      title: String(parsed.data.title || '이경재'),
      lang: parsed.data.lang === 'en' ? 'en' : 'ko',
      content: parsed.content,
      file,
    } as Entry;
  })).filter(entry => entry.permalink && entry.permalink !== '/en/');
}

const entries = sourceEntries();

export function generateStaticParams() {
  return entries.map(entry => ({ slug: entry.permalink.split('/').filter(Boolean) }));
}

function Header({ lang }: { lang: 'ko' | 'en' }) {
  const prefix = lang === 'en' ? '/en' : '';
  return <header className="sub-header"><a href={`${prefix}/`}><b aria-hidden="true"/>이경재</a><nav><a href={`${prefix}/`}>{lang === 'ko' ? '작업' : 'Work'}</a><a href={`${prefix}/services/`}>{lang === 'ko' ? '서비스' : 'Services'}</a><a href={`${prefix}/legal/`}>{lang === 'ko' ? '정책' : 'Legal'}</a></nav><a href={lang === 'ko' ? '/en/' : '/'}>{lang === 'ko' ? 'EN' : 'KO'}</a></header>;
}

const serviceData = [
  ['GH', 'GahyeonBot', 'Discord · Text · Voice', 'https://github.com/LEE-Kyungjae/gahyeonbot'],
  ['AT', 'Adelie Terminal', 'Web · Mobile · Remote', '/termi-agent/'],
  ['PM', 'Palamedes', 'Planning · Evaluation · Agents', 'https://github.com/LEE-Kyungjae/Palamedes'],
];

export default async function LegacyPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const permalink = `/${slug.join('/')}/`;
  const entry = entries.find(item => item.permalink === permalink);
  if (!entry) notFound();
  const lang = entry.lang;
  const prefix = lang === 'en' ? '/en' : '';

  if (permalink === '/services/' || permalink === '/en/services/') return <><Header lang={lang}/><main className={`sub-page lang-${lang}`}><p className="sub-kicker">LIVE PRODUCTS</p><h1>{lang === 'ko' ? '서비스' : 'Services'}</h1><div className="service-cards">{serviceData.map(item => <a href={item[3]} key={item[1]}><i>{item[0]}</i><div><h2>{item[1]}</h2><p>{item[2]}</p></div><b>↗</b></a>)}</div></main></>;

  if (permalink === '/legal/' || permalink === '/en/legal/') {
    const docs = entries.filter(item => item.lang === lang && item.permalink.includes('/legal/') && item.permalink !== permalink);
    return <><Header lang={lang}/><main className={`sub-page lang-${lang}`}><p className="sub-kicker">POLICY ARCHIVE</p><h1>{lang === 'ko' ? '운영 정책' : 'Legal'}</h1><div className="legal-list">{docs.map(doc => <a href={doc.permalink} key={doc.permalink}><span>{doc.title}</span><small>{doc.permalink}</small><b>→</b></a>)}</div></main></>;
  }

  const html = await marked.parse(entry.content);
  const isDownload = permalink.includes('/termi-agent/');
  const isLegal = permalink.includes('/legal/');
  const backHref = isDownload ? `${prefix}/services/` : isLegal ? `${prefix}/legal/` : `${prefix}/`;
  const backLabel = lang === 'ko' ? '목록으로' : 'Back to list';
  return <><Header lang={lang}/><main className={`document lang-${lang}`}><p className="sub-kicker">DOCUMENT / {entry.file.replace(/\.(md|html)$/,'')}</p><h1>{entry.title}</h1><div className="prose" dangerouslySetInnerHTML={{ __html: html }}/><a className="back-link" href={backHref}>← {backLabel}</a></main></>;
}
