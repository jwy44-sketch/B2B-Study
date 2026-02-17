'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildExplanation } from '@/lib/explanations';
import { inferFarRef } from '@/lib/farReferences';
import { getBatchMetrics, restartLearnEngine, submitLearnAnswer, type LearnEngineState } from '@/lib/learnEngine';
import { getModuleById } from '@/lib/modules';
import { clearLearnSession, restoreOrInitializeLearnEngine, saveLearnSession } from '@/lib/learnPersistence';
import { loadQuestions } from '@/lib/questions';
import { presentQuestion } from '@/lib/presentQuestion';
import { applySrsResult } from '@/lib/srsEngine';
import type { Question } from '@/lib/types';
import { computeDatasetVersion } from '@/lib/datasetVersion';
import { LearnProgress } from './LearnProgress';
import { ScenarioBlock } from './ScenarioBlock';

type Mode = 'LOADING' | 'IN_BATCH' | 'FEEDBACK' | 'SESSION_COMPLETE';
type OptionVisualState = 'default' | 'selectedCorrect' | 'selectedWrong' | 'revealCorrect';

const BATCH_SIZE = 10;
const MASTERY_TARGET = 2;

export default function LearnClient() {
  const params = useSearchParams();
  const [mode, setMode] = useState<Mode>('LOADING');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [engine, setEngine] = useState<LearnEngineState | null>(null);
  const [datasetVersion, setDatasetVersion] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [transitionMessage, setTransitionMessage] = useState<string | null>(null);
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);
  const [srsMode, setSrsMode] = useState(false);
  const reduceMotion = useReducedMotion();
  const moduleId = params.get('module');

  useEffect(() => {
    loadQuestions().then((data) => {
      const moduleInfo = moduleId ? getModuleById(moduleId, data) : null;
      const scoped = moduleInfo ? data.filter((question) => moduleInfo.questionIds.includes(question.id)) : data;
      const version = computeDatasetVersion(scoped);
      const ids = scoped.map((q) => q.id);
      const restored = restoreOrInitializeLearnEngine({
        allIds: ids,
        batchSize: BATCH_SIZE,
        masteryTarget: MASTERY_TARGET,
        datasetVersion: version
      });

      setAllQuestions(scoped);
      setDatasetVersion(version);
      setEngine(restored.engine);

      if (restored.resetReason === 'version_mismatch') {
        setResumeNotice('Saved Learn progress was reset because the question set changed.');
      } else if (restored.resetReason === 'corrupt') {
        setResumeNotice('Saved Learn progress was corrupted and has been reset safely.');
      } else {
        setResumeNotice('Continuing where you left off.');
      }

      setMode(restored.engine.sessionComplete ? 'SESSION_COMPLETE' : 'IN_BATCH');
    });
  }, [moduleId]);

  useEffect(() => {
    if (!engine || !datasetVersion) return;
    const timer = window.setTimeout(() => {
      saveLearnSession({ datasetVersion, engine });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [engine, datasetVersion]);

  const questionsById = useMemo(() => new Map(allQuestions.map((q) => [q.id, q])), [allQuestions]);
  const currentQuestion = engine?.currentQuestionId ? questionsById.get(engine.currentQuestionId) ?? null : null;
  const presented = useMemo(() => (currentQuestion ? presentQuestion(currentQuestion, { shuffleChoices: true }) : null), [currentQuestion]);
  const farRef = useMemo(() => (presented ? inferFarRef(`${presented.question.prompt} ${presented.presentedChoices.join(' ')}`) : null), [presented]);

  const baseMetrics = useMemo(() => (engine ? getBatchMetrics(engine) : null), [engine]);

  const displayedMetrics = useMemo(() => {
    if (!engine || !baseMetrics) return baseMetrics;
    if (!isSubmitted || isCorrect !== true || !engine.currentQuestionId) return baseMetrics;

    const currentStats = engine.statsById[engine.currentQuestionId];
    if (!currentStats || currentStats.mastered) return baseMetrics;

    const nextStreak = currentStats.correctStreak + 1;
    if (nextStreak < engine.masteryTarget) return baseMetrics;

    const masteredCount = Math.min(baseMetrics.totalInBatch, baseMetrics.masteredCount + 1);
    const remaining = Math.max(0, baseMetrics.totalInBatch - masteredCount);
    const progressPct = baseMetrics.totalInBatch ? Math.round((masteredCount / baseMetrics.totalInBatch) * 100) : 0;
    return { ...baseMetrics, masteredCount, remaining, progressPct };
  }, [engine, baseMetrics, isSubmitted, isCorrect]);

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

  const onAnswer = useCallback((idx: number | null) => {
    if (!presented || isSubmitted || mode !== 'IN_BATCH') return;
    setSelectedIndex(idx);
    setIsCorrect(idx === presented.presentedCorrectIndex);
    setIsSubmitted(true);
    setMode('FEEDBACK');
  }, [isSubmitted, mode, presented]);

  const next = useCallback(() => {
    if (!engine || mode !== 'FEEDBACK') return;
    const prevBatchStart = engine.batchStartIndex;
    const answeredId = engine.currentQuestionId;
    let nextState: LearnEngineState = submitLearnAnswer(engine, isCorrect === true);
    if (srsMode && answeredId) {
      nextState = applySrsResult(nextState, answeredId, isCorrect === true);
    }

    setEngine(nextState);

    setSelectedIndex(null);
    setIsCorrect(null);
    setIsSubmitted(false);

    if (nextState.sessionComplete) {
      setMode('SESSION_COMPLETE');
      return;
    }

    if (nextState.batchStartIndex !== prevBatchStart) {
      setTransitionMessage('Batch complete — starting next set');
      window.setTimeout(() => setTransitionMessage(null), 1400);
    }

    setMode('IN_BATCH');
  }, [engine, isCorrect, mode, srsMode]);

  const resetProgress = useCallback(() => {
    if (!engine) return;
    if (!window.confirm('This will erase saved Learn progress. Continue?')) return;
    clearLearnSession();
    setEngine(restartLearnEngine(engine));
    setSelectedIndex(null);
    setIsCorrect(null);
    setIsSubmitted(false);
    setTransitionMessage(null);
    setResumeNotice('Learn progress reset. Starting from batch 1.');
    setMode('IN_BATCH');
  }, [engine]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mode === 'IN_BATCH' && ['1', '2', '3', '4'].includes(e.key)) onAnswer(Number(e.key) - 1);
      if (mode === 'IN_BATCH' && e.key.toLowerCase() === 'i') onAnswer(null);
      if (mode === 'FEEDBACK' && (e.key === 'Enter' || e.key.toLowerCase() === 'n')) next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, onAnswer, next]);

  if (mode === 'LOADING' || !engine || !presented || !farRef || !displayedMetrics) return <div>Loading...</div>;

  const explanation = buildExplanation({
    questionId: presented.question.id,
    questionText: presented.question.prompt,
    options: presented.presentedChoices,
    correctIndex: presented.presentedCorrectIndex,
    selectedIndex,
    farRef
  });

  return (
    <div>
      {resumeNotice && <div className="mb-3 rounded border border-sky-500/50 bg-sky-950/30 p-2 text-sm text-sky-200">{resumeNotice}</div>}

      <LearnProgress
        batchNumber={displayedMetrics.batchNumber}
        totalBatches={displayedMetrics.totalBatches}
        masteredCount={displayedMetrics.masteredCount}
        batchSize={displayedMetrics.totalInBatch}
        progressPct={displayedMetrics.progressPct}
        modeLabel={engine.reviewingMissed ? 'Reviewing missed questions' : 'Learning new questions'}
        remaining={displayedMetrics.remaining}
      />

      <div className="mb-3 flex items-center justify-between rounded border border-slate-700 bg-slate-900/70 p-2 text-sm">
        <span>{moduleId ? `Module session: ${moduleId}` : 'Full-deck session'}</span>
        <button
          className={`rounded border px-3 py-1 ${srsMode ? 'border-brand text-brand' : 'border-slate-600 text-slate-200'}`}
          onClick={() => setSrsMode((prev) => !prev)}
          type="button"
        >
          {srsMode ? 'Spaced Repetition' : 'Standard Learn'}
        </button>
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
              {isCorrect ? 'Correct' : `Incorrect — correct answer: ${presented.presentedChoices[presented.presentedCorrectIndex]}`}
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
            <div className="text-sm text-slate-300">
              <p>FAR reference:</p>
              <a href={explanation.references.part.url} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">FAR Part {explanation.references.part.part} — {explanation.references.part.title}</a>
              {explanation.references.subpart && (
                <p>
                  <a href={explanation.references.subpart.url} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">FAR Subpart {explanation.references.subpart.code} — {explanation.references.subpart.title}</a>
                </p>
              )}
              {explanation.references.sections.map((section) => (
                <p key={section.cite}>
                  <a href={section.url} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">FAR {section.cite} — {section.title}</a>
                </p>
              ))}
            </div>
            <p className="mt-2 text-sm text-slate-200"><span className="font-semibold">Why this is correct:</span> {explanation.whyCorrect}</p>
            <ul className="mt-1 list-disc pl-5 text-sm text-slate-300">
              {explanation.wrongBullets.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className="mt-1 text-sm text-slate-300"><span className="font-semibold">Key takeaway:</span> {explanation.keyTakeaway}</p>
            <div className="mt-3 flex gap-2">
              <button className="btn" onClick={next}>Next (N / Enter)</button>
              <button className="rounded border border-slate-600 px-3 py-2 text-sm" onClick={resetProgress}>Reset Progress</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {mode === 'SESSION_COMPLETE' && (
        <div className="card mt-4 space-y-2">
          <h3 className="text-lg font-semibold">Session complete</h3>
          <p>You mastered all available batches in this run.</p>
          <button className="btn" onClick={resetProgress}>Reset Progress</button>
        </div>
      )}
    </div>
  );
}
