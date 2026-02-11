'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { buildExplanation } from '@/lib/explanations';
import { inferFarRef } from '@/lib/farReferences';
import { computeDatasetVersion } from '@/lib/datasetVersion';
import { loadLearnSession, saveLearnSession } from '@/lib/learnPersistence';
import { recordQuestionResult, type LearnEngineState } from '@/lib/learnEngine';
import { loadQuestions } from '@/lib/questions';
import { presentQuestion } from '@/lib/presentQuestion';
import type { Question } from '@/lib/types';

export default function ReviewPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [datasetVersion, setDatasetVersion] = useState('');
  const [engine, setEngine] = useState<LearnEngineState | null>(null);
  const [queue, setQueue] = useState<string[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [filter, setFilter] = useState<'session' | 'all' | 'most'>('all');
  const [started, setStarted] = useState(false);
  const [missedSession, setMissedSession] = useState<Set<string>>(new Set());
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    loadQuestions().then((data) => {
      setQuestions(data);
      setDatasetVersion(computeDatasetVersion(data));
      const saved = loadLearnSession();
      setEngine(saved?.engine ?? null);
    });
  }, []);

  useEffect(() => {
    if (!engine || !datasetVersion) return;
    saveLearnSession({ datasetVersion, engine });
  }, [engine, datasetVersion]);

  const byId = useMemo(() => new Map(questions.map((question) => [question.id, question])), [questions]);

  const candidates = useMemo(() => {
    if (!engine) return [];
    const base = questions.filter((question) => {
      const stats = engine.statsById[question.id];
      if (!stats) return false;
      if (stats.incorrectCount <= 0) return false;
      return !stats.mastered;
    });

    if (filter === 'session') {
      return base.filter((question) => missedSession.has(question.id));
    }

    if (filter === 'most') {
      return [...base].sort((a, b) => (engine.statsById[b.id]?.incorrectCount ?? 0) - (engine.statsById[a.id]?.incorrectCount ?? 0));
    }

    return base;
  }, [engine, questions, filter, missedSession]);

  const currentQuestion = currentId ? byId.get(currentId) ?? null : null;
  const presented = useMemo(() => (currentQuestion ? presentQuestion(currentQuestion, { shuffleChoices: true }) : null), [currentQuestion]);

  const startReview = () => {
    const ids = candidates.map((question) => question.id);
    setQueue(ids);
    setCurrentId(ids[0] ?? null);
    setStarted(true);
    setSelected(null);
    setSubmitted(false);
    setCorrect(null);
  };

  const submit = (index: number | null) => {
    if (!presented || submitted || !engine) return;
    const wasCorrect = index === presented.presentedCorrectIndex;
    const nextEngine = recordQuestionResult(engine, presented.question.id, wasCorrect);
    setEngine(nextEngine);
    if (!wasCorrect) {
      setMissedSession((prev) => new Set(prev).add(presented.question.id));
    }
    setSelected(index);
    setCorrect(wasCorrect);
    setSubmitted(true);
  };

  const next = () => {
    if (!presented || !engine) return;
    const updatedStats = engine.statsById[presented.question.id];
    const nextQueue = updatedStats?.mastered ? queue.filter((id) => id !== presented.question.id) : [...queue.filter((id) => id !== presented.question.id), presented.question.id];
    setQueue(nextQueue);
    setCurrentId(nextQueue[0] ?? null);
    setSelected(null);
    setSubmitted(false);
    setCorrect(null);
  };

  const clearMissed = () => {
    if (!engine) return;
    if (!window.confirm('Clear missed history for all questions?')) return;
    const statsById = Object.fromEntries(Object.entries(engine.statsById).map(([id, stats]) => [id, { ...stats, incorrectCount: 0 }]));
    setEngine({ ...engine, statsById });
    setMissedSession(new Set());
    setQueue([]);
    setCurrentId(null);
    setStarted(false);
  };

  const explanation = presented ? buildExplanation({
    questionText: presented.question.prompt,
    options: presented.presentedChoices,
    correctIndex: presented.presentedCorrectIndex,
    selectedIndex: selected,
    farRef: inferFarRef(presented.question.prompt)
  }) : null;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Review Missed</h1>
      <div className="card space-y-2">
        <div className="flex flex-wrap gap-2">
          <button className={`rounded border px-3 py-1 ${filter === 'session' ? 'border-brand text-brand' : 'border-slate-600'}`} onClick={() => setFilter('session')}>Missed this session</button>
          <button className={`rounded border px-3 py-1 ${filter === 'all' ? 'border-brand text-brand' : 'border-slate-600'}`} onClick={() => setFilter('all')}>All-time missed</button>
          <button className={`rounded border px-3 py-1 ${filter === 'most' ? 'border-brand text-brand' : 'border-slate-600'}`} onClick={() => setFilter('most')}>Most missed</button>
        </div>
        <p className="text-sm text-slate-300">{candidates.length} review question(s)</p>
        <div className="flex gap-2">
          <button className="btn" onClick={startReview}>Start Review</button>
          <button className="rounded border border-slate-600 px-3 py-2" onClick={clearMissed}>Clear missed history</button>
        </div>
      </div>

      {!started && (
        <div className="space-y-2">
          {candidates.slice(0, 20).map((question) => {
            const stats = engine?.statsById[question.id];
            const farRef = inferFarRef(question.prompt);
            return (
              <div key={question.id} className="card">
                <p>{question.prompt}</p>
                <p className="text-sm text-slate-300">Missed {stats?.incorrectCount ?? 0}x • FAR Part {farRef.part}</p>
              </div>
            );
          })}
        </div>
      )}

      {started && presented && (
        <div className="card space-y-3">
          <p className="text-sm text-slate-300">Remaining in review queue: {queue.length}</p>
          <p className="font-semibold">{presented.question.prompt}</p>
          {presented.presentedChoices.map((choice, index) => {
            const selectedChoice = submitted && index === selected;
            const isCorrectChoice = index === presented.presentedCorrectIndex;
            const stateClass = submitted
              ? selectedChoice && isCorrectChoice
                ? 'border-green-500 bg-green-900/30'
                : selectedChoice && !isCorrectChoice
                  ? 'border-red-500 bg-red-900/30'
                  : !selectedChoice && isCorrectChoice
                    ? 'border-green-500 bg-green-950/30'
                    : 'border-slate-700'
              : 'border-slate-700 hover:border-brand';

            return (
              <motion.button
                key={`${presented.question.id}-${index}`}
                disabled={submitted}
                onClick={() => submit(index)}
                className={`block w-full rounded border p-3 text-left ${stateClass}`}
                animate={reduceMotion ? {} : submitted && selectedChoice && !isCorrectChoice ? { x: [0, -6, 6, -4, 4, 0] } : submitted && selectedChoice ? { scale: [1, 1.02, 1] } : {}}
              >
                {index + 1}. {choice}
              </motion.button>
            );
          })}
          <button className="rounded border border-amber-400 px-3 py-2 text-amber-300" onClick={() => submit(null)} disabled={submitted}>I don't know</button>

          {submitted && explanation && (
            <div className="rounded border border-slate-700 bg-slate-950/60 p-3 text-sm">
              <p className="font-semibold">{correct ? 'Correct' : 'Incorrect'}</p>
              <p>FAR reference: {explanation.farLine}</p>
              <a href={inferFarRef(presented.question.prompt).url} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">{explanation.linkLabel}</a>
              <p className="mt-1"><span className="font-semibold">Why this is correct:</span> {explanation.whyCorrect}</p>
              <ul className="list-disc pl-5">{explanation.wrongBullets.map((item) => <li key={item}>{item}</li>)}</ul>
              <p><span className="font-semibold">Key takeaway:</span> {explanation.keyTakeaway}</p>
              <button className="btn mt-2" onClick={next}>Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
