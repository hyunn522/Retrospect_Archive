import './globals.css';
import { PostHogProvider } from '@/components/PostHogProvider';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: '회고 아카이브',
  description: '결정의 맥락을 기록하고 1주일 뒤 회고하세요.',
};

export const viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light' as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
      </head>
      <body>
        <PostHogProvider>{children}</PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
