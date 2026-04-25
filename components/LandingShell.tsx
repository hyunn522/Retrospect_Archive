'use client';

import { useEffect, useState } from 'react';
import type { LandingContent } from '@/content/types';
import { DecisionForm } from '@/components/DecisionForm';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SocialProof } from '@/components/SocialProof';
import { track } from '@/lib/analytics';

export function LandingShell({ content }: { content: LandingContent }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [remindAt, setRemindAt] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState('');

  useEffect(() => {
    track('landing_view', { category: content.category });
  }, [content.category]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-6 pt-16 pb-24 sm:pt-24">
      <section className="text-center max-w-[640px] mb-10">
        <h1
          className="text-3xl sm:text-4xl font-bold leading-tight mb-5"
          style={{ color: content.accent }}
        >
          {content.hookLine}
        </h1>
        <p className="text-base sm:text-lg text-zinc-700 whitespace-pre-line">
          {content.subline}
        </p>
      </section>

      <DecisionForm
        content={content}
        onSuccess={({ remindAt: at, email }) => {
          setSubmittedEmail(email);
          setRemindAt(at);
          setDialogOpen(true);
        }}
      />

      <div className="mt-10">
        <SocialProof content={content} />
      </div>

      <ConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        remindAt={remindAt}
        email={submittedEmail}
        category={content.category}
      />
    </main>
  );
}
