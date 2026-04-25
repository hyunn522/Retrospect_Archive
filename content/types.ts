import type { Category } from '@/lib/types';

export interface LandingContent {
  category: Category;
  accent: string;
  hookLine: string;
  subline: string;
  placeholder: string;
  ctaButton: string;
  socialProofPrefix: string;
}
