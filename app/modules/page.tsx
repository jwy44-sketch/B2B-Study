'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildModules } from '@/lib/modules';
import { loadQuestions } from '@/lib/questions';
import { loadLearnSession } from '@/lib/learnPersistence';
import type { LearnStats } from '@/lib/learnEngine';
import type { Question } from '@/lib/types';

export default function ModulesPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [statsById, setStatsById] = useState<Record<string, LearnStats>>({});

  useEffect(() => {
    loadQuestions().then(setQuestions);
    const saved = loadLearnSession();
    setStatsById(saved?.engine.statsById ?? {});
  }, []);

  const modules = useMemo(() => buildModules(questions, statsById), [questions, statsById]);

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Modules (Study by FAR Part)</h1>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((moduleEntry) => (
          <div key={moduleEntry.id} className="card space-y-2">
            <h2 className="font-semibold">{moduleEntry.title}</h2>
            <p className="text-sm text-slate-300">{moduleEntry.counts.total} questions</p>
            <p className="text-sm text-slate-300">Mastered {moduleEntry.counts.mastered}/{moduleEntry.counts.total} ({moduleEntry.counts.masteredPct}%)</p>
            <div className="h-2 overflow-hidden rounded bg-slate-700">
              <div className="h-full bg-brand transition-[width] duration-300" style={{ width: `${moduleEntry.counts.masteredPct}%` }} />
            </div>
            <a className="btn inline-block" href={`/learn?module=${moduleEntry.id}`}>Start Learn for this module</a>
          </div>
        ))}
      </div>
    </div>
  );
}
