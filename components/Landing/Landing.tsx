'use client';

import { useEffect } from 'react';
import type { Category } from '@/lib/types';
import { track } from '@/lib/analytics';
import { Hero } from './Hero';
import { Problem } from './Problem';
import { HowItWorks } from './HowItWorks';
import { CategoryForm } from './CategoryForm';
import { Faq } from './Faq';
import { Footer } from './Footer';

export function Landing({ initialCategory }: { initialCategory: Category | null }) {
  useEffect(() => {
    track('landing_view', initialCategory ? { category: initialCategory } : {});
  }, [initialCategory]);

  return (
    <>
      <main className="min-h-screen bg-white text-zinc-900">
        <Hero />
        <Problem />
        <HowItWorks />
        <CategoryForm initialCategory={initialCategory} />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
