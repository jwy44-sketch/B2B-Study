'use client';

import { useEffect, useMemo, useState } from 'react';
import { useBookmarks } from '@/components/useBookmarks';
import { loadQuestions } from '@/lib/questions';
import type { Question } from '@/lib/types';

export default function BookmarksPage() {
  const { lookup, toggle } = useBookmarks();
  const [questions, setQuestions] = useState<Question[]>([]);
  useEffect(() => { loadQuestions().then(setQuestions); }, []);
  const bookmarked = useMemo(() => questions.filter((q) => lookup.has(q.id)), [questions, lookup]);

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Bookmarks</h1>
      {bookmarked.map((q) => (
        <div key={q.id} className="card">
          <p>{q.prompt}</p>
          <button onClick={() => toggle(q.id)}>Remove</button>
        </div>
      ))}
      {!bookmarked.length && <div className="card">No bookmarks yet.</div>}
    </div>
  );
}
