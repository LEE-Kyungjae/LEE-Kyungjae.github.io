import type { Metadata } from 'next';
import './globals.css';
import './portfolio.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://lee-kyungjae.github.io'),
  title: '이경재 — Systems Engineer',
  description: '이경재의 개발 프로젝트. Palamedes와 Gahyeon의 구현 사례와 소스 코드.',
  openGraph: {
    title: '이경재 — Systems Engineer',
    description: '이경재의 개발 프로젝트. Palamedes와 Gahyeon의 구현 사례와 소스 코드.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
