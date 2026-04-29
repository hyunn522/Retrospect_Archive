import { Landing } from '@/components/Landing/Landing';
import { CATEGORIES, type Category } from '@/lib/types';

export const metadata = {
  title: '회고 아카이브 — 결정의 맥락을 1주일 뒤 다시 만나다',
  description:
    '결정의 맥락은 1주일이면 흐려집니다. 한 줄 적어두면 그때의 마음이 다시 돌아와요. 개발/연애/라이프 결정을 위한 회고 메일.',
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const initial: Category | null =
    cat && (CATEGORIES as readonly string[]).includes(cat) ? (cat as Category) : null;
  return <Landing initialCategory={initial} />;
}
