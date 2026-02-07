'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadQuestions } from '@/lib/questions';
import type { Question } from '@/lib/types';
import { useBookmarks } from '@/components/useBookmarks';

export default function FlashcardsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [topic, setTopic] = useState('All');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const { lookup, toggle } = useBookmarks();

  useEffect(() => { loadQuestions().then(setQuestions); }, []);

  const topics = useMemo(() => ['All', ...new Set(questions.map((q) => q.topic))], [questions]);
  const deck = useMemo(() => questions.filter((q) => (topic === 'All' || q.topic === topic) && (!onlyBookmarked || lookup.has(q.id))), [questions, topic, onlyBookmarked, lookup]);
  const q = deck[index % Math.max(1, deck.length)];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((x) => x + 1);
      if (e.key === 'ArrowLeft') setIndex((x) => Math.max(0, x - 1));
      if (e.key === ' ') setShowAnswer((x) => !x);
      if (e.key.toLowerCase() === 'e') setShowExplanation((x) => !x);
      if (e.key.toLowerCase() === 'b' && q) toggle(q.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [q, toggle]);

  if (!q) return <div>Loading...</div>;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Flashcards</h1>
      <div className="card flex flex-wrap gap-3">
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-slate-800 p-2">{topics.map((t) => <option key={t}>{t}</option>)}</select>
        <label><input type="checkbox" checked={onlyBookmarked} onChange={(e) => setOnlyBookmarked(e.target.checked)} className="mr-2" />only bookmarked</label>
      </div>
      <div className="card space-y-2" onClick={() => setShowAnswer(true)}>
        <p>{q.prompt}</p>
        {showAnswer && <p className="text-brand">Answer: {q.choices[q.correctIndex]}</p>}
        {showExplanation && <p className="text-slate-300">{q.explanation.whyCorrect}</p>}
        <div className="flex gap-2">
          <button className="btn" onClick={() => setShowAnswer((x) => !x)}>Space: reveal answer</button>
          <button className="btn" onClick={() => setShowExplanation((x) => !x)}>E: explanation</button>
          <button className="btn" onClick={() => toggle(q.id)}>{lookup.has(q.id) ? '★' : '☆'} Bookmark (B)</button>
        </div>
      </div>
    </div>
  );
}
