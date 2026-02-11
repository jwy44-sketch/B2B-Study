'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildInsights, computeOverallStats, computePartStats, mostMissedQuestions } from '@/lib/stats';
import { loadLearnSession } from '@/lib/learnPersistence';
import { loadQuestions } from '@/lib/questions';
import type { LearnStats } from '@/lib/learnEngine';
import type { Question } from '@/lib/types';

export default function StatsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [statsById, setStatsById] = useState<Record<string, LearnStats>>({});

  useEffect(() => {
    loadQuestions().then(setQuestions);
    const saved = loadLearnSession();
    setStatsById(saved?.engine.statsById ?? {});
  }, []);

  const overall = useMemo(() => computeOverallStats(questions, statsById), [questions, statsById]);
  const partStats = useMemo(() => computePartStats(questions, statsById), [questions, statsById]);
  const missed = useMemo(() => mostMissedQuestions(questions, statsById), [questions, statsById]);
  const insights = useMemo(() => buildInsights(partStats), [partStats]);

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Stats Dashboard</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="card"><p className="text-sm text-slate-300">Overall accuracy</p><p className="text-2xl font-semibold">{overall.accuracyPct}%</p></div>
        <div className="card"><p className="text-sm text-slate-300">Attempts</p><p className="text-2xl font-semibold">{overall.totalAttempts}</p></div>
        <div className="card"><p className="text-sm text-slate-300">Mastered</p><p className="text-2xl font-semibold">{overall.masteredCount}/{questions.length}</p></div>
      </div>

      <div className="card space-y-2">
        <h2 className="font-semibold">By FAR Part</h2>
        {partStats.map((part) => (
          <div key={part.part}>
            <div className="mb-1 flex justify-between text-sm">
              <span>Part {part.part} — {part.title}</span>
              <span>{part.accuracyPct}% accuracy • {part.masteredPct}% mastered</span>
            </div>
            <div className="h-2 overflow-hidden rounded bg-slate-700">
              <div className="h-full bg-brand" style={{ width: `${part.accuracyPct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card space-y-1">
        <h2 className="font-semibold">Insights</h2>
        <p>{insights.strongest}</p>
        <p>{insights.weakest}</p>
      </div>

      <div className="card space-y-1">
        <h2 className="font-semibold">Most missed questions</h2>
        {missed.map((entry) => (
          <p key={entry.question.id} className="text-sm">{entry.question.prompt} <span className="text-slate-300">(missed {entry.incorrectCount}x)</span></p>
        ))}
      </div>
    </div>
  );
}
