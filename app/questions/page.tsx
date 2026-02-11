'use client';

import { useEffect, useMemo, useState } from 'react';
import { QuestionFilters } from '@/components/QuestionFilters';
import { QuestionList } from '@/components/QuestionList';
import { inferFarRef } from '@/lib/farReferences';
import { loadLearnSession } from '@/lib/learnPersistence';
import { loadQuestions } from '@/lib/questions';
import type { LearnStats } from '@/lib/learnEngine';
import type { Question } from '@/lib/types';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [statsById, setStatsById] = useState<Record<string, LearnStats>>({});
  const [search, setSearch] = useState('');
  const [farPart, setFarPart] = useState('all');
  const [status, setStatus] = useState<'all' | 'mastered' | 'unmastered' | 'missed'>('all');
  const [preview, setPreview] = useState<Question | null>(null);

  useEffect(() => {
    loadQuestions().then(setQuestions);
    const saved = loadLearnSession();
    setStatsById(saved?.engine.statsById ?? {});
  }, []);

  const mapped = useMemo(() => {
    return questions.map((question) => {
      const stats = statsById[question.id];
      const missedCount = stats?.incorrectCount ?? 0;
      const derivedStatus: 'mastered' | 'unmastered' | 'missed' = stats?.mastered
        ? 'mastered'
        : missedCount > 0
          ? 'missed'
          : 'unmastered';

      return {
        question,
        farPart: inferFarRef(question.prompt).part,
        status: derivedStatus,
        missedCount
      };
    });
  }, [questions, statsById]);

  const farParts = useMemo(() => [...new Set(mapped.map((entry) => entry.farPart))].sort((a, b) => a - b), [mapped]);

  const filtered = useMemo(() => {
    return mapped.filter((entry) => {
      const bySearch = entry.question.prompt.toLowerCase().includes(search.toLowerCase());
      const byFar = farPart === 'all' || entry.farPart === Number(farPart);
      const byStatus = status === 'all' || entry.status === status;
      return bySearch && byFar && byStatus;
    });
  }, [mapped, search, farPart, status]);

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Questions Index</h1>
      <QuestionFilters
        search={search}
        onSearch={setSearch}
        farPart={farPart}
        onFarPart={setFarPart}
        status={status}
        onStatus={setStatus}
        farParts={farParts}
      />
      <p className="text-sm text-slate-300">{filtered.length} result(s)</p>
      <QuestionList questions={filtered} onPreview={setPreview} />

      {preview && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/50 p-3 md:items-center md:justify-center" role="dialog" aria-modal>
          <div className="card w-full max-w-2xl space-y-2">
            <p className="text-sm text-slate-300">Preview</p>
            <p className="font-semibold">{preview.prompt}</p>
            <p className="text-sm text-slate-300">Answers hidden for practice integrity.</p>
            <div className="flex gap-2">
              <a className="btn" href={`/practice?ids=${preview.id}`}>Practice this</a>
              <button className="rounded border border-slate-600 px-3 py-2" onClick={() => setPreview(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
