'use client';

import type { Question } from '@/lib/types';
import { ScenarioBlock } from './ScenarioBlock';

export function QuestionCard({ q }: { q: Question }) {
  return (
    <div className="card space-y-2">
      <ScenarioBlock scenarioContext={q.scenarioContext} />
      <p className="font-semibold">{q.prompt}</p>
      <p className="text-xs text-slate-400">{q.topic} • {q.session} • {q.farRefs.join(', ')}</p>
    </div>
  );
}
