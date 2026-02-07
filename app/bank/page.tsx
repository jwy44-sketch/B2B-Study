'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadQuestions } from '@/lib/questions';
import type { Question } from '@/lib/types';
import { useBookmarks } from '@/components/useBookmarks';

export default function BankPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topic, setTopic] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const { lookup, toggle } = useBookmarks();

  useEffect(() => { loadQuestions().then(setQuestions); }, []);
  const topics = useMemo(() => ['All', ...new Set(questions.map((q) => q.topic))], [questions]);
  const filtered = useMemo(() => {
    let out = questions.filter((q) => (topic === 'All' || q.topic === topic) && q.prompt.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'bookmarked') out = [...out].sort((a, b) => Number(lookup.has(b.id)) - Number(lookup.has(a.id)));
    return out;
  }, [questions, topic, search, sort, lookup]);

  return (
    <div className="grid gap-3 md:grid-cols-[220px_1fr]">
      <aside className="card h-fit">
        <h2 className="mb-2 font-semibold">Topics</h2>
        {topics.map((t) => <button key={t} onClick={() => setTopic(t)} className="mb-1 block text-left text-sm hover:text-brand">{t}</button>)}
      </aside>
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">Question Bank</h1>
        <div className="card flex gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-slate-800 p-2" placeholder="search" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-slate-800 p-2"><option value="default">default</option><option value="bookmarked">bookmarked first</option></select>
        </div>
        {filtered.slice(0, 80).map((q) => (
          <details key={q.id} className="card">
            <summary className="cursor-pointer">{q.prompt}</summary>
            <button onClick={() => toggle(q.id)}>{lookup.has(q.id) ? '★' : '☆'}</button>
            <ul className="list-disc pl-5">{q.choices.map((c) => <li key={c}>{c}</li>)}</ul>
            <p>Answer: {q.choices[q.correctIndex]}</p>
            <p>{q.explanation.whyCorrect}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
