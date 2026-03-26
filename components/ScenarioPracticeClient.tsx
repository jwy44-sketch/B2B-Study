'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadScenarioQuestions } from '@/lib/scenarioQuestions';
import type { ScenarioQuestion } from '@/lib/scenarioTypes';
import { loadJson, saveJson, storageKeys } from '@/lib/storage';

type ScenarioPracticeProgress = {
  questionOrder: string[];
  choiceOrderByQuestion: Record<string, string[]>;
  currentIndex: number;
  answers: Record<string, { selectedChoiceId: string; isCorrect: boolean }>;
};

const labelForIndex = ['A', 'B', 'C', 'D'];

function shuffle<T>(input: T[]): T[] {
  const copy = [...input];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function initProgress(questions: ScenarioQuestion[]): ScenarioPracticeProgress {
  const questionOrder = shuffle(questions.map((q) => q.id));
  const choiceOrderByQuestion = Object.fromEntries(
    questions.map((q) => [q.id, shuffle(q.choices.map((c) => c.id))])
  );

  return {
    questionOrder,
    choiceOrderByQuestion,
    currentIndex: 0,
    answers: {}
  };
}

export default function ScenarioPracticeClient() {
  const [questions, setQuestions] = useState<ScenarioQuestion[]>([]);
  const [progress, setProgress] = useState<ScenarioPracticeProgress | null>(null);
  const [submittedChoiceId, setSubmittedChoiceId] = useState<string | null>(null);

  useEffect(() => {
    loadScenarioQuestions().then((data) => {
      setQuestions(data);
      const saved = loadJson<ScenarioPracticeProgress | null>(storageKeys.scenarioPracticeProgress, null);
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
    saveJson(storageKeys.scenarioPracticeProgress, progress);
  }, [progress]);

  const mapById = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions]);

  const currentQuestion = useMemo(() => {
    if (!progress) return null;
    const id = progress.questionOrder[progress.currentIndex];
    return id ? mapById.get(id) ?? null : null;
  }, [mapById, progress]);

  const orderedChoices = useMemo(() => {
    if (!currentQuestion || !progress) return [];
    const order = progress.choiceOrderByQuestion[currentQuestion.id] ?? currentQuestion.choices.map((c) => c.id);
    return order
      .map((choiceId) => currentQuestion.choices.find((c) => c.id === choiceId))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
  }, [currentQuestion, progress]);

  if (!progress || !currentQuestion) return <div>Loading scenario practice…</div>;

  const total = progress.questionOrder.length;
  const answeredCount = Object.keys(progress.answers).length;
  const selectedBefore = progress.answers[currentQuestion.id]?.selectedChoiceId ?? null;
  const selected = submittedChoiceId ?? selectedBefore;
  const isSubmitted = Boolean(selected);

  const submit = (choiceId: string) => {
    if (!progress || isSubmitted) return;
    const isCorrect = choiceId === currentQuestion.correctChoiceId;
    setSubmittedChoiceId(choiceId);
    setProgress({
      ...progress,
      answers: {
        ...progress.answers,
        [currentQuestion.id]: { selectedChoiceId: choiceId, isCorrect }
      }
    });
  };

  const next = () => {
    if (!progress) return;
    setSubmittedChoiceId(null);
    if (progress.currentIndex + 1 >= progress.questionOrder.length) return;
    setProgress({ ...progress, currentIndex: progress.currentIndex + 1 });
  };

  const restart = () => {
    const fresh = initProgress(questions);
    setSubmittedChoiceId(null);
    setProgress(fresh);
  };

  const correctChoice = currentQuestion.choices.find((c) => c.id === currentQuestion.correctChoiceId);
  const selectedIsCorrect = selected === currentQuestion.correctChoiceId;

  return (
    <div className="space-y-3">
      <div className="card space-y-2">
        <h2 className="text-xl font-semibold">Scenario Practice</h2>
        <p className="text-sm text-slate-300">DAU-style scenario questions for CON 3990V</p>
        <p className="text-sm text-slate-300">Question {progress.currentIndex + 1} of {total} • Answered {answeredCount}</p>
        <div className="flex gap-2 text-xs">
          <span className="rounded bg-slate-800 px-2 py-1">{currentQuestion.topic}</span>
          <span className="rounded bg-slate-800 px-2 py-1">{currentQuestion.sessionSource}</span>
        </div>
        <div className="flex gap-2">
          <button className="btn" onClick={restart}>Restart Session</button>
          {progress.currentIndex > 0 && <span className="text-xs text-slate-400 self-center">Resumed previous scenario practice progress.</span>}
        </div>
      </div>

      <div className="card space-y-3">
        <p className="font-semibold">{currentQuestion.stem}</p>
        <div className="grid gap-2">
          {orderedChoices.map((choice, idx) => {
            const isCorrect = choice.id === currentQuestion.correctChoiceId;
            const isSelected = selected === choice.id;
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
            <p className="font-semibold">{selectedIsCorrect ? 'Correct' : 'Incorrect'}</p>
            <p className="text-sm text-slate-300">Correct answer: {correctChoice?.text}</p>
            <p className="text-sm text-slate-300 whitespace-pre-line">{currentQuestion.explanation}</p>
            <p className="text-xs text-slate-400">{currentQuestion.topic} • {currentQuestion.sessionSource}</p>
            <button className="btn" onClick={next}>
              {progress.currentIndex + 1 >= total ? 'Review Complete' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
