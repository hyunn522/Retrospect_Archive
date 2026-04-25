import { z } from 'zod';
import { CATEGORIES, type SubmissionInput } from '@/lib/types';

const submissionSchema = z.object({
  email: z.email(),
  decision: z.string().min(10).max(500),
  category: z.enum(CATEGORIES),
});

export type ValidationResult =
  | { success: true; data: SubmissionInput }
  | { success: false; error: string };

export function validateSubmission(input: unknown): ValidationResult {
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'invalid' };
  }
  return { success: true, data: parsed.data };
}
