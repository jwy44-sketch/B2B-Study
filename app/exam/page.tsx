'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadQuestions } from '@/lib/questions';
import { presentQuestion } from '@/lib/presentQuestion';
import type { Question } from '@/lib/types';

export default function ExamPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [size, setSize] = useState(10);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  useEffect(() => { loadQuestions().then(setQuestions); }, []);

  const pool = useMemo(() => {
    if (!bookmarkedOnly) return questions;
    const bookmarks = typeof window === 'undefined' ? [] : JSON.parse(localStorage.getItem('b2b_bookmarks_v1') || '[]');
    return questions.filter((q) => bookmarks.includes(q.id));
  }, [questions, bookmarkedOnly]);

  const set = useMemo(() => pool.slice(0, size), [pool, size]);
  const pq = set[i] ? presentQuestion(set[i], { shuffleChoices: true }) : null;

  if (!pq) return <div>Loading...</div>;
  if (done) return <div className="card"><h1 className="text-xl">Results</h1><p>{score}/{set.length}</p></div>;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Exam Sprint</h1>
      <div className="card flex flex-wrap gap-3">
        <label>Set size <input value={size} type="number" min={10} max={50} onChange={(e) => setSize(Number(e.target.value))} className="ml-2 w-20 bg-slate-800" /></label>
        <label><input type="checkbox" checked={bookmarkedOnly} onChange={(e) => setBookmarkedOnly(e.target.checked)} className="mr-2" />only bookmarked</label>
      </div>
      <div className="card space-y-2">
        <p className="font-semibold">{pq.question.prompt}</p>
        {pq.presentedChoices.map((c, idx) => (
          <button key={c} className="block w-full rounded border border-slate-700 p-2 text-left" onClick={() => {
            if (idx === pq.presentedCorrectIndex) setScore((s) => s + 1);
            if (i + 1 >= set.length) setDone(true); else setI((x) => x + 1);
          }}>{idx + 1}. {c}</button>
        ))}
      </div>
    </div>
  );
}
