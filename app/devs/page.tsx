import { LandingShell } from '@/components/LandingShell';
import { devs } from '@/content/devs';

export const metadata = {
  title: '개발자를 위한 회고 아카이브',
  description: '6개월 전 그 기술 결정의 이유, 지금 기억나세요?',
};

export default function DevsPage() {
  return <LandingShell content={devs} />;
}
