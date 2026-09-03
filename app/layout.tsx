import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://lee-kyungjae.github.io'),
  title: '이경재 — Systems Engineer',
  description: 'Goal discovery, persistent AI characters, backend engineering and systems built to keep running.',
  openGraph: {
    title: '이경재 — Systems Engineer',
    description: 'I build systems that discover direction, preserve memory and keep running.',
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
