import { Resend } from 'resend';
import { env } from '@/lib/env';
import type { Category } from '@/lib/types';

let _client: Resend | null = null;
export function getResend(): Resend {
  if (_client) return _client;
  _client = new Resend(env().RESEND_API_KEY);
  return _client;
}

interface BuildArgs {
  to: string;
  category: Category;
  decision: string;
  submissionId: string;
  siteUrl: string;
}

const SUBJECT = '1주일 전 그 결정, 어떻게 됐어요?';

const HEADLINE: Record<Category, string> = {
  devs: '1주일 전 적어두신 그 기술 결정, 지금은 어떻게 됐나요?',
  love: '1주일 전 적어두신 마음, 지금은 어떻게 됐나요?',
  life: '1주일 전 적어두신 그 결정, 지금은 어떻게 됐나요?',
};

export interface BuiltEmail {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export function buildReminderEmail(args: BuildArgs): BuiltEmail {
  const trackUrl = `${args.siteUrl}/api/track/click?id=${args.submissionId}`;
  const html = `
<!doctype html>
<html lang="ko">
<body style="font-family:system-ui,sans-serif;max-width:520px;margin:24px auto;padding:0 16px;color:#111;">
  <h2 style="font-weight:600;font-size:18px;margin:0 0 16px;">${HEADLINE[args.category]}</h2>
  <blockquote style="border-left:3px solid #d4d4d8;margin:0 0 24px;padding:8px 12px;color:#52525b;">${escapeHtml(args.decision)}</blockquote>
  <p style="margin:0 0 24px;line-height:1.6;">잘 됐든, 후회되든, 30초만 적어두시면 다음 회고 때 큰 도움이 됩니다.</p>
  <p><a href="${trackUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;">회고 한 줄 남기기 →</a></p>
  <p style="margin-top:32px;font-size:12px;color:#a1a1aa;">— 회고 아카이브</p>
</body>
</html>`.trim();
  return {
    to: args.to,
    from: '회고 아카이브 <onboarding@resend.dev>',
    subject: SUBJECT,
    html,
  };
}

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
