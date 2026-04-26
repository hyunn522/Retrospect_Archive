import { LandingShell } from '@/components/LandingShell';
import { life } from '@/content/life';

export const metadata = {
  title: '라이프 회고 아카이브',
  description: '이직, 자취, 큰 소비. 결정의 맥락을 1주일 뒤 다시 만나요.',
};

export default function LifePage() {
  return <LandingShell content={life} />;
}
