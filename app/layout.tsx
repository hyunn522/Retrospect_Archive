import './globals.css';
import { PostHogProvider } from '@/components/PostHogProvider';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Decision Validate',
  description: '결정의 맥락을 기록하고 1주일 뒤 회고하세요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-zinc-900 antialiased">
        <PostHogProvider>{children}</PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
