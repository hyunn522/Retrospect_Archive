import { LandingShell } from '@/components/LandingShell';
import { love } from '@/content/love';

export const metadata = {
  title: '관계의 결정을 다시 만나기',
  description: '관계의 결정은 시간이 지나면 마음이 흐려져요.',
};

export default function LovePage() {
  return <LandingShell content={love} />;
}
