'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { loadQuestions } from '@/lib/questions';
import { presentQuestion } from '@/lib/presentQuestion';
import type { Question } from '@/lib/types';
import { ProgressHeader } from './ProgressHeader';

type Mode = 'LOADING' | 'IN_BATCH' | 'FEEDBACK' | 'BATCH_SUMMARY' | 'SESSION_COMPLETE';

const BATCH_SIZE = 10;

export default function LearnClient() {
  const [mode, setMode] = useState<Mode>('LOADING');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [queue, setQueue] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [missed, setMissed] = useState<Question[]>([]);
  const [focusWeak, setFocusWeak] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    loadQuestions().then((data) => {
      setAllQuestions(data);
      setQueue(data.slice(0, BATCH_SIZE));
      setMode('IN_BATCH');
    });
  }, []);

  const presented = useMemo(() => (queue[index] ? presentQuestion(queue[index], { shuffleChoices: true }) : null), [queue, index]);

  const onAnswer = (idx: number | null) => {
    if (!presented) return;
    setSelected(idx);
    const ok = idx === presented.presentedCorrectIndex;
    if (ok) {
      setCorrect((c) => c + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
      setMissed((m) => [...m, presented.question]);
      const insertAt = Math.min(queue.length, index + 3);
      const copy = [...queue];
      copy.splice(insertAt, 0, presented.question);
      setQueue(copy);
    }
    setMode('FEEDBACK');
  };

  const next = () => {
    setSelected(null);
    if (index + 1 >= BATCH_SIZE) {
      setMode('BATCH_SUMMARY');
      return;
    }
    setIndex((i) => i + 1);
    setMode('IN_BATCH');
  };

  const nextBatch = () => {
    const pool = focusWeak && missed.length ? missed : allQuestions;
    const start = Math.floor(Math.random() * Math.max(1, pool.length - BATCH_SIZE));
    setQueue(pool.slice(start, start + BATCH_SIZE));
    setIndex(0);
    setCorrect(0);
    setMissed([]);
    setMode('IN_BATCH');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mode === 'IN_BATCH' && ['1', '2', '3', '4'].includes(e.key)) onAnswer(Number(e.key) - 1);
      if (mode === 'IN_BATCH' && e.key.toLowerCase() === 'i') onAnswer(null);
      if ((mode === 'FEEDBACK' && (e.key === 'Enter' || e.key.toLowerCase() === 'n')) || (mode === 'IN_BATCH' && e.key === 'Enter')) next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (mode === 'LOADING' || !presented) return <div>Loading...</div>;

  return (
    <div>
      <ProgressHeader current={index} total={BATCH_SIZE} streak={streak} />
      <label className="mb-3 block text-sm">
        <input type="checkbox" checked={focusWeak} onChange={(e) => setFocusWeak(e.target.checked)} className="mr-2" />
        Focus Weak Areas
      </label>

      <AnimatePresence mode="wait">
        <motion.div
          key={presented.question.id + mode}
          initial={reduceMotion ? false : { opacity: 0, x: 14 }}
          animate={reduceMotion ? {} : { opacity: 1, x: 0 }}
          exit={reduceMotion ? {} : { opacity: 0, x: -14 }}
          transition={{ duration: 0.24 }}
          className="card space-y-3"
        >
          <h2 className="text-xl font-semibold">{presented.question.prompt}</h2>
          <div className="grid gap-2">
            {presented.presentedChoices.map((choice, i) => (
              <button key={choice} disabled={mode === 'FEEDBACK'} onClick={() => onAnswer(i)} className="rounded-lg border border-slate-700 p-3 text-left hover:border-brand">
                {i + 1}. {choice}
              </button>
            ))}
          </div>
          <button className="rounded border border-amber-400 px-3 py-2 text-amber-300" onClick={() => onAnswer(null)}>
            I don't know
          </button>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {mode === 'FEEDBACK' && (
          <motion.div initial={reduceMotion ? false : { y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed inset-x-0 bottom-0 mx-auto max-w-4xl rounded-t-xl border border-slate-700 bg-slate-900 p-4">
            <p className="font-semibold">{selected === presented.presentedCorrectIndex ? 'Correct' : 'Incorrect'}</p>
            <p className="text-sm text-slate-300">{presented.question.explanation.whyCorrect}</p>
            <p className="text-sm text-slate-300">Key takeaway: {presented.question.explanation.keyTakeaway}</p>
            <p className="text-sm text-slate-300">Common trap: {presented.question.explanation.commonTrap}</p>
            <button className="btn mt-3" onClick={next}>Next (N / Enter)</button>
          </motion.div>
        )}
      </AnimatePresence>

      {mode === 'BATCH_SUMMARY' && (
        <div className="card mt-4 space-y-2">
          <h3 className="text-lg font-semibold">Batch Summary</h3>
          <p>Accuracy: {Math.round((correct / BATCH_SIZE) * 100)}%</p>
          <p>Missed: {missed.length}</p>
          <div className="flex gap-2">
            <button className="btn" onClick={() => { setQueue(missed.slice(0, BATCH_SIZE)); setIndex(0); setMode(missed.length ? 'IN_BATCH' : 'SESSION_COMPLETE'); }}>
              Retry Missed
            </button>
            <button className="btn" onClick={nextBatch}>Next Batch</button>
          </div>
        </div>
      )}

      {mode === 'SESSION_COMPLETE' && <div className="card mt-4">Session complete.</div>}
    </div>
  );
}
