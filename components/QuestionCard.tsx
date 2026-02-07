'use client';

import type { Question } from '@/lib/types';

export function QuestionCard({ q }: { q: Question }) {
  return (
    <div className="card space-y-2">
      <p className="font-semibold">{q.prompt}</p>
      <p className="text-xs text-slate-400">{q.topic} • {q.session} • {q.farRefs.join(', ')}</p>
    </div>
  );
}
