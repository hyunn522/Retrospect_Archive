export const CATEGORIES = ['devs', 'love', 'life'] as const;
export type Category = (typeof CATEGORIES)[number];

export interface SubmissionInput {
  email: string;
  decision: string;
  category: Category;
}

export interface SubmissionRecord extends SubmissionInput {
  id: string;
  created_at: string;
  remind_at: string;
  reminded_at: string | null;
  email_status: 'sent' | 'failed' | null;
  click_at: string | null;
}
