'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { getFarReference } from '@/lib/farReferences';
import { getBatchMastery, initializeLearnEngine, restartLearnEngine, submitLearnAnswer, type LearnEngineState } from '@/lib/learnEngine';
import { loadQuestions } from '@/lib/questions';
import { presentQuestion } from '@/lib/presentQuestion';
import type { Question } from '@/lib/types';
import { ScenarioBlock } from './ScenarioBlock';

type Mode = 'LOADING' | 'IN_BATCH' | 'FEEDBACK' | 'SESSION_COMPLETE';
type OptionVisualState = 'default' | 'selectedCorrect' | 'selectedWrong' | 'revealCorrect';

const BATCH_SIZE = 10;
const MASTERY_TARGET = 2;

export default function LearnClient() {
  const [mode, setMode] = useState<Mode>('LOADING');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [engine, setEngine] = useState<LearnEngineState | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [transitionMessage, setTransitionMessage] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    loadQuestions().then((data) => {
      setAllQuestions(data);
      setEngine(initializeLearnEngine(data.map((q) => q.id), BATCH_SIZE, MASTERY_TARGET));
      setMode('IN_BATCH');
    });
  }, []);

  const questionsById = useMemo(() => new Map(allQuestions.map((q) => [q.id, q])), [allQuestions]);
  const currentQuestion = engine?.currentQuestionId ? questionsById.get(engine.currentQuestionId) ?? null : null;
  const presented = useMemo(() => (currentQuestion ? presentQuestion(currentQuestion, { shuffleChoices: true }) : null), [currentQuestion]);
  const farReference = useMemo(() => (presented ? getFarReference(presented.question) : null), [presented]);
  const batchProgress = useMemo(() => (engine ? getBatchMastery(engine) : null), [engine]);

  const displayedBatchProgress = useMemo(() => {
    if (!engine || !batchProgress) return batchProgress;
    if (!isSubmitted || isCorrect !== true || !engine.currentQuestionId) return batchProgress;

    const currentStats = engine.stats[engine.currentQuestionId];
    if (!currentStats || currentStats.mastered) return batchProgress;

    const nextStreak = currentStats.correctStreak + 1;
    if (nextStreak < engine.masteryTarget) return batchProgress;

    const masteredCount = Math.min(batchProgress.batchSize, batchProgress.masteredCount + 1);
    return {
      ...batchProgress,
      masteredCount,
      remainingInBatch: Math.max(0, batchProgress.batchSize - masteredCount)
    };
  }, [engine, batchProgress, isSubmitted, isCorrect]);

  useEffect(() => {
    if (engine?.sessionComplete) setMode('SESSION_COMPLETE');
  }, [engine]);

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
    if (visualState === 'selectedCorrect') return 'border-green-500 bg-green-900/30 text-green-100 ring-2 ring-green-400 shadow-[0_0_18px_rgba(34,197,94,0.35)]';
    if (visualState === 'selectedWrong') return 'border-red-500 bg-red-900/30 text-red-100 ring-2 ring-red-400';
    if (visualState === 'revealCorrect') return 'border-green-500 bg-green-950/20 text-green-100 ring-1 ring-green-400';
    return 'border-slate-700 text-slate-100 hover:border-brand';
  };

  const onAnswer = (idx: number | null) => {
    if (!presented || isSubmitted || mode !== 'IN_BATCH') return;
    setSelectedIndex(idx);
    const ok = idx === presented.presentedCorrectIndex;
    setIsCorrect(ok);
    setIsSubmitted(true);
    setMode('FEEDBACK');
  };

  const next = () => {
    if (!engine) return;

    let nextState: LearnEngineState = engine;
    const previousBatchStart = engine.batchStartIndex;

    setEngine((prev) => {
      if (!prev) return prev;
      nextState = submitLearnAnswer(prev, isCorrect === true);
      return nextState;
    });

    setSelectedIndex(null);
    setIsCorrect(null);
    setIsSubmitted(false);

    if (nextState.sessionComplete) {
      setMode('SESSION_COMPLETE');
      return;
    }

    if (nextState.batchStartIndex !== previousBatchStart) {
      setTransitionMessage('Batch complete — starting next set');
      window.setTimeout(() => setTransitionMessage(null), 1400);
    }

    setMode('IN_BATCH');
  };

  const restartLearn = () => {
    if (!engine) return;
    setEngine(restartLearnEngine(engine));
    setSelectedIndex(null);
    setIsCorrect(null);
    setIsSubmitted(false);
    setTransitionMessage(null);
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

  if (mode === 'LOADING' || !engine || !presented || !farReference || !displayedBatchProgress) return <div>Loading...</div>;

  const batchPct = displayedBatchProgress.batchSize ? Math.round((displayedBatchProgress.masteredCount / displayedBatchProgress.batchSize) * 100) : 0;
  const correctAnswerText = presented.presentedChoices[presented.presentedCorrectIndex];
  const selectedAnswerText = selectedIndex === null ? "I don't know" : presented.presentedChoices[selectedIndex];
  const commonTrapText = selectedIndex !== null && selectedIndex !== presented.presentedCorrectIndex
    ? selectedAnswerText
    : presented.presentedChoices.find((choice, idx) => idx !== presented.presentedCorrectIndex) ?? 'the noncompliant option';

  return (
    <div>
      <div className="mb-3 rounded-lg border border-slate-700 bg-slate-900/90 p-3">
        <div className="mb-1 flex justify-between text-sm">
          <span>Batch {displayedBatchProgress.batchNumber}</span>
          <span>Mastered {displayedBatchProgress.masteredCount}/{displayedBatchProgress.batchSize}</span>
        </div>
        <div className="h-2 overflow-hidden rounded bg-slate-700">
          <motion.div className="h-full bg-brand" animate={{ width: `${batchPct}%` }} transition={{ duration: 0.25 }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
          <span>{engine.reviewingMissed ? 'Reviewing missed questions' : 'Learning new questions'}</span>
          <span>Remaining: {displayedBatchProgress.remainingInBatch}</span>
        </div>
      </div>

      {transitionMessage && <div className="mb-3 rounded border border-green-500/60 bg-green-950/40 p-2 text-sm text-green-200">{transitionMessage}</div>}

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
                    <span>{i + 1}. {choice}</span>
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
            <p className="text-sm text-slate-300">FAR reference: FAR Part {farReference.partNumber} — {farReference.partTitle}</p>
            <a href={farReference.url} target="_blank" rel="noreferrer" className="text-sm text-sky-300 underline">Open FAR Part {farReference.partNumber} on Acquisition.gov</a>
            <p className="mt-2 text-sm text-slate-200"><span className="font-semibold">Why this is correct:</span> The best answer is <span className="font-semibold">{correctAnswerText}</span> because it aligns with FAR Part {farReference.partNumber} and the procedural rule this prompt is testing.</p>
            <ul className="mt-1 list-disc pl-5 text-sm text-slate-300">
              <li><span className="font-semibold">Why the other options are wrong:</span> <span className="font-semibold">{commonTrapText}</span> is a common distractor because it conflicts with the controlling FAR requirement in this context.</li>
            </ul>
            <p className="mt-1 text-sm text-slate-300"><span className="font-semibold">Key takeaway:</span> Anchor your answer to the governing FAR part, then pick the option that keeps the action compliant.</p>
            <div className="mt-3 flex gap-2">
              <button className="btn" onClick={next}>Next (N / Enter)</button>
              <button className="rounded border border-slate-600 px-3 py-2 text-sm" onClick={restartLearn}>Restart Learn</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {mode === 'SESSION_COMPLETE' && (
        <div className="card mt-4 space-y-2">
          <h3 className="text-lg font-semibold">Session complete</h3>
          <p>You mastered all available batches in this run.</p>
          <button className="btn" onClick={restartLearn}>Restart Learn</button>
        </div>
      )}
    </div>
  );
}
