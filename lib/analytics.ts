'use client';

import posthog from 'posthog-js';
import type { Category } from '@/lib/types';

export type AnalyticsEvent =
  | 'landing_view'
  | 'category_select'
  | 'form_focus'
  | 'form_submit_try'
  | 'form_submit_success'
  | 'form_submit_fail'
  | 'dialog_close';

export function track(
  event: AnalyticsEvent,
  props: { category?: Category; [key: string]: unknown } = {}
): void {
  if (typeof window === 'undefined') return;
  posthog.capture(event, props);
}
