import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kyungjae Lee',
  description: 'Agentic systems, backend engineering and developer tools.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
