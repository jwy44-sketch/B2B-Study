'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadScenarioQuestions } from '@/lib/scenarioQuestions';
import type { ScenarioQuestion } from '@/lib/scenarioTypes';
import { loadJson, saveJson, storageKeys } from '@/lib/storage';

const BATCH_SIZE = 10;
const MASTERY_TARGET = 2;
const labelForIndex = ['A', 'B', 'C', 'D'];

type ScenarioLearnProgress = {
  questionOrder: string[];
  choiceOrderByQuestion: Record<string, string[]>;
  batchStart: number;
  batchQueue: string[];
  batchCursor: number;
  masteryByQuestion: Record<string, number>;
  completedBatches: number;
};

function shuffle<T>(input: T[]): T[] {
  const copy = [...input];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function initProgress(questions: ScenarioQuestion[]): ScenarioLearnProgress {
  const questionOrder = shuffle(questions.map((q) => q.id));
  const choiceOrderByQuestion = Object.fromEntries(
    questions.map((q) => [q.id, shuffle(q.choices.map((c) => c.id))])
  );

  return {
    questionOrder,
    choiceOrderByQuestion,
    batchStart: 0,
    batchQueue: questionOrder.slice(0, BATCH_SIZE),
    batchCursor: 0,
    masteryByQuestion: {},
    completedBatches: 0
  };
}

export default function ScenarioLearnClient() {
  const [questions, setQuestions] = useState<ScenarioQuestion[]>([]);
  const [progress, setProgress] = useState<ScenarioLearnProgress | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  useEffect(() => {
    loadScenarioQuestions().then((data) => {
      setQuestions(data);
      const saved = loadJson<ScenarioLearnProgress | null>(storageKeys.scenarioLearnProgress, null);
      if (
        saved &&
        saved.questionOrder.length === data.length &&
        Object.keys(saved.choiceOrderByQuestion).length === data.length
      ) {
        setProgress(saved);
      } else {
        setProgress(initProgress(data));
      }
    });
  }, []);

  useEffect(() => {
    if (!progress) return;
    saveJson(storageKeys.scenarioLearnProgress, progress);
  }, [progress]);

  const mapById = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions]);
  const sessionComplete = (progress?.batchStart ?? 0) >= (progress?.questionOrder.length ?? Number.MAX_SAFE_INTEGER);
  const currentQuestionId = progress?.batchQueue[progress.batchCursor];
  const currentQuestion = currentQuestionId ? mapById.get(currentQuestionId) ?? null : null;

  const orderedChoices = useMemo(() => {
    if (!currentQuestion || !progress) return [];
    const order = progress.choiceOrderByQuestion[currentQuestion.id] ?? currentQuestion.choices.map((c) => c.id);
    return order
      .map((choiceId) => currentQuestion.choices.find((c) => c.id === choiceId))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
  }, [currentQuestion, progress]);

  if (!progress) return <div>Loading scenario learn…</div>;

  const batchIds = progress.questionOrder.slice(progress.batchStart, progress.batchStart + BATCH_SIZE);
  const masteredInBatch = batchIds.filter((id) => (progress.masteryByQuestion[id] ?? 0) >= MASTERY_TARGET).length;
  const masteredOverall = Object.values(progress.masteryByQuestion).filter((v) => v >= MASTERY_TARGET).length;

  const submit = (choiceId: string) => {
    if (!progress || selectedChoiceId || !currentQuestion) return;
    const isCorrect = choiceId === currentQuestion.correctChoiceId;
    const currentMastery = progress.masteryByQuestion[currentQuestion.id] ?? 0;
    const nextMastery = isCorrect ? Math.min(MASTERY_TARGET, currentMastery + 1) : 0;

    const nextProgress: ScenarioLearnProgress = {
      ...progress,
      masteryByQuestion: {
        ...progress.masteryByQuestion,
        [currentQuestion.id]: nextMastery
      }
    };

    setSelectedChoiceId(choiceId);
    setProgress(nextProgress);
  };

  const advance = () => {
    if (!progress) return;

    const isEndOfQueue = progress.batchCursor + 1 >= progress.batchQueue.length;

    if (!isEndOfQueue) {
      setSelectedChoiceId(null);
      setProgress({ ...progress, batchCursor: progress.batchCursor + 1 });
      return;
    }

    const batchIdsNow = progress.questionOrder.slice(progress.batchStart, progress.batchStart + BATCH_SIZE);
    const unmastered = batchIdsNow.filter((id) => (progress.masteryByQuestion[id] ?? 0) < MASTERY_TARGET);

    if (unmastered.length > 0) {
      setSelectedChoiceId(null);
      setProgress({
        ...progress,
        batchQueue: [...progress.batchQueue, ...unmastered],
        batchCursor: progress.batchCursor + 1
      });
      return;
    }

    const nextBatchStart = progress.batchStart + BATCH_SIZE;
    if (nextBatchStart >= progress.questionOrder.length) {
      setSelectedChoiceId(null);
      setProgress({
        ...progress,
        batchStart: nextBatchStart,
        completedBatches: Math.ceil(progress.questionOrder.length / BATCH_SIZE)
      });
      return;
    }

    setSelectedChoiceId(null);
    setProgress({
      ...progress,
      batchStart: nextBatchStart,
      batchQueue: progress.questionOrder.slice(nextBatchStart, nextBatchStart + BATCH_SIZE),
      batchCursor: 0,
      completedBatches: progress.completedBatches + 1
    });
  };

  const restart = () => {
    setSelectedChoiceId(null);
    setProgress(initProgress(questions));
  };

  if (sessionComplete) {
    return (
      <div className="card space-y-3">
        <h2 className="text-xl font-semibold">Scenario Learn Complete</h2>
        <p className="text-sm text-slate-300">You mastered all 150 scenario questions.</p>
        <button className="btn" onClick={restart}>Restart Scenario Learn</button>
      </div>
    );
  }

  if (!currentQuestion) return <div>Loading scenario learn…</div>;

  const isSubmitted = Boolean(selectedChoiceId);
  const correctChoice = currentQuestion.choices.find((c) => c.id === currentQuestion.correctChoiceId);

  return (
    <div className="space-y-3">
      <div className="card space-y-2">
        <h2 className="text-xl font-semibold">Scenario Learn</h2>
        <p className="text-sm text-slate-300">Batch-based scenario learning for CON 3990V</p>
        <p className="text-sm text-slate-300">Batch size: {BATCH_SIZE} • Mastered in batch: {masteredInBatch}/{Math.min(BATCH_SIZE, progress.questionOrder.length - progress.batchStart)}</p>
        <p className="text-sm text-slate-300">Mastered overall: {masteredOverall}/{progress.questionOrder.length}</p>
        <div className="flex gap-2 text-xs">
          <span className="rounded bg-slate-800 px-2 py-1">{currentQuestion.topic}</span>
          <span className="rounded bg-slate-800 px-2 py-1">{currentQuestion.sessionSource}</span>
          <span className="rounded bg-slate-800 px-2 py-1">Batch {Math.floor(progress.batchStart / BATCH_SIZE) + 1}</span>
        </div>
        <button className="btn w-fit" onClick={restart}>Restart Session</button>
      </div>

      <div className="card space-y-3">
        <p className="font-semibold">{currentQuestion.stem}</p>
        <div className="grid gap-2">
          {orderedChoices.map((choice, idx) => {
            const isCorrect = choice.id === currentQuestion.correctChoiceId;
            const isSelected = selectedChoiceId === choice.id;
            const color = isSubmitted
              ? isCorrect
                ? 'border-emerald-500 bg-emerald-900/20'
                : isSelected
                  ? 'border-red-500 bg-red-900/20'
                  : 'border-slate-700'
              : 'border-slate-700';

            return (
              <button
                key={choice.id}
                disabled={isSubmitted}
                onClick={() => submit(choice.id)}
                className={`rounded border p-3 text-left ${color}`}
              >
                {labelForIndex[idx]}. {choice.text}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="space-y-2 rounded border border-slate-700 p-3">
            <p className={`inline-block rounded px-3 py-1 text-sm font-bold ${selectedChoiceId === currentQuestion.correctChoiceId ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-600/60' : 'bg-rose-900/40 text-rose-300 border border-rose-600/60'}`}>
              {selectedChoiceId === currentQuestion.correctChoiceId ? 'Correct' : 'Incorrect'}
            </p>
            <p className="text-sm text-slate-300">Correct answer: {correctChoice?.text}</p>
            <p className="text-sm text-slate-300 whitespace-pre-line">{currentQuestion.explanation}</p>
            <button className="btn" onClick={advance}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
