'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { getFarReference } from '@/lib/farReferences';
import { loadQuestions } from '@/lib/questions';
import { presentQuestion } from '@/lib/presentQuestion';
import type { Question } from '@/lib/types';
import { ProgressHeader } from './ProgressHeader';
import { ScenarioBlock } from './ScenarioBlock';

type Mode = 'LOADING' | 'IN_BATCH' | 'FEEDBACK' | 'BATCH_SUMMARY' | 'SESSION_COMPLETE';
type OptionVisualState = 'default' | 'selectedCorrect' | 'selectedWrong' | 'revealCorrect';

const BATCH_SIZE = 10;

export default function LearnClient() {
  const [mode, setMode] = useState<Mode>('LOADING');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [queue, setQueue] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
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

  const farReference = useMemo(() => (presented ? getFarReference(presented.question) : null), [presented]);

  const optionStateFor = (choiceIndex: number): OptionVisualState => {
    if (!isSubmitted || !presented) return 'default';
    const isSelected = choiceIndex === selectedIndex;
    const isActualCorrect = choiceIndex === presented.presentedCorrectIndex;

    if (isSelected && isActualCorrect) return 'selectedCorrect';
    if (isSelected && !isActualCorrect) return 'selectedWrong';
    if (!isSelected && isActualCorrect) return 'revealCorrect';
    return 'default';
  };

  const optionClassFor = (visualState: OptionVisualState): string => {
    if (visualState === 'selectedCorrect') {
      return 'border-green-500 bg-green-900/30 text-green-100 ring-2 ring-green-400 shadow-[0_0_18px_rgba(34,197,94,0.35)]';
    }
    if (visualState === 'selectedWrong') {
      return 'border-red-500 bg-red-900/30 text-red-100 ring-2 ring-red-400';
    }
    if (visualState === 'revealCorrect') {
      return 'border-green-500 bg-green-950/20 text-green-100 ring-1 ring-green-400';
    }
    return 'border-slate-700 text-slate-100 hover:border-brand';
  };

  const onAnswer = (idx: number | null) => {
    if (!presented || isSubmitted) return;

    setSelectedIndex(idx);
    const ok = idx === presented.presentedCorrectIndex;
    setIsCorrect(ok);
    setIsSubmitted(true);

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
    setSelectedIndex(null);
    setIsCorrect(null);
    setIsSubmitted(false);
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
    setSelectedIndex(null);
    setIsCorrect(null);
    setIsSubmitted(false);
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

  if (mode === 'LOADING' || !presented || !farReference) return <div>Loading...</div>;

  const correctAnswerText = presented.presentedChoices[presented.presentedCorrectIndex];
  const selectedAnswerText = selectedIndex === null ? "I don't know" : presented.presentedChoices[selectedIndex];
  const commonTrapText = selectedIndex !== null && selectedIndex !== presented.presentedCorrectIndex
    ? selectedAnswerText
    : presented.presentedChoices.find((choice, idx) => idx !== presented.presentedCorrectIndex) ?? 'the noncompliant option';

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
          <ScenarioBlock scenarioContext={presented.question.scenarioContext} />
          <h2 className="text-xl font-semibold">{presented.question.prompt}</h2>
          <div className="grid gap-2">
            {presented.presentedChoices.map((choice, i) => {
              const visualState = optionStateFor(i);
              const isSelected = i === selectedIndex;
              const isActualCorrect = i === presented.presentedCorrectIndex;

              return (
                <motion.button
                  key={`${presented.question.id}-${i}`}
                  disabled={isSubmitted}
                  onClick={() => onAnswer(i)}
                  className={`rounded-lg border p-3 text-left transition-colors duration-200 ${optionClassFor(visualState)}`}
                  animate={
                    reduceMotion
                      ? {}
                      : visualState === 'selectedCorrect'
                        ? { scale: [1, 1.02, 1] }
                        : visualState === 'selectedWrong'
                          ? { x: [0, -6, 6, -4, 4, 0] }
                          : { x: 0, scale: 1 }
                  }
                  transition={{ duration: visualState === 'selectedWrong' ? 0.34 : 0.24 }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>
                      {i + 1}. {choice}
                    </span>
                    {isSubmitted && isSelected && isCorrect && <span aria-hidden>✓</span>}
                    {isSubmitted && isSelected && isCorrect === false && <span aria-hidden>✕</span>}
                    {isSubmitted && !isSelected && isActualCorrect && <span aria-hidden>✓</span>}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {isSubmitted && (
            <p className={`text-sm font-semibold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
              {isCorrect ? 'Correct' : `Incorrect — correct answer: ${correctAnswerText}`}
            </p>
          )}

          <button className="rounded border border-amber-400 px-3 py-2 text-amber-300" onClick={() => onAnswer(null)} disabled={isSubmitted}>
            I don't know
          </button>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {mode === 'FEEDBACK' && (
          <motion.div initial={reduceMotion ? false : { y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed inset-x-0 bottom-0 mx-auto max-w-4xl rounded-t-xl border border-slate-700 bg-slate-900 p-4">
            <p className="font-semibold">{isCorrect ? 'Correct' : 'Incorrect'}</p>
            <p className="text-sm text-slate-300">
              FAR reference: FAR Part {farReference.partNumber} — {farReference.partTitle}
            </p>
            <a href={farReference.url} target="_blank" rel="noreferrer" className="text-sm text-sky-300 underline">
              Open FAR Part {farReference.partNumber} on Acquisition.gov
            </a>
            <p className="mt-2 text-sm text-slate-200">
              <span className="font-semibold">Why this is correct:</span> The best answer is <span className="font-semibold">{correctAnswerText}</span> because it aligns with the governing policy in FAR Part {farReference.partNumber} for this scenario and matches what the Government must do procedurally before award or administration action.
            </p>
            <ul className="mt-1 list-disc pl-5 text-sm text-slate-300">
              <li>
                <span className="font-semibold">Why the other options are wrong:</span> <span className="font-semibold">{commonTrapText}</span> is a common distractor because it sounds practical, but it skips or conflicts with the FAR Part {farReference.partNumber} requirement the question is testing.
              </li>
            </ul>
            <p className="mt-1 text-sm text-slate-300">
              <span className="font-semibold">Key takeaway:</span> Tie your answer to the controlling FAR part first, then choose the option that preserves compliance, documentation, and fair process.
            </p>
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
