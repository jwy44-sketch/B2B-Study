'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadScenarioQuestions } from '@/lib/scenarioQuestions';
import type { ScenarioQuestion } from '@/lib/scenarioTypes';
import { loadJson, saveJson, storageKeys } from '@/lib/storage';
import {
  createScenarioPracticeProgress,
  findNextUnansweredIndex,
  isValidSavedScenarioPracticeProgress,
  normalizeSavedScenarioPracticeProgress,
  selectScenarioPracticeChunkQuestions,
  type ScenarioPracticeProgress
} from '@/lib/scenarioPracticeState';

const labelForIndex = ['A', 'B', 'C', 'D'];

export default function ScenarioPracticeClient() {
  const [questions, setQuestions] = useState<ScenarioQuestion[]>([]);
  const [progress, setProgress] = useState<ScenarioPracticeProgress | null>(null);
  const [submittedChoiceId, setSubmittedChoiceId] = useState<string | null>(null);
  const [lockedQuestionId, setLockedQuestionId] = useState<string | null>(null);

  useEffect(() => {
    loadScenarioQuestions().then((data) => {
      const chunkQuestions = selectScenarioPracticeChunkQuestions(data);
      setQuestions(chunkQuestions);
      const saved = loadJson<ScenarioPracticeProgress | null>(storageKeys.scenarioPracticeProgress, null);
      if (isValidSavedScenarioPracticeProgress(saved, chunkQuestions)) {
        setProgress(normalizeSavedScenarioPracticeProgress(saved, chunkQuestions));
      } else {
        setProgress(createScenarioPracticeProgress(chunkQuestions));
      }
    });
  }, []);

  useEffect(() => {
    if (!progress) return;
    saveJson(storageKeys.scenarioPracticeProgress, progress);
  }, [progress]);

  const mapById = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions]);

  const activeIndex = useMemo(() => {
    if (!progress || progress.completed) return -1;
    if (lockedQuestionId) return progress.questionOrder.indexOf(lockedQuestionId);
    return findNextUnansweredIndex(progress, progress.currentIndex);
  }, [lockedQuestionId, progress]);

  const currentQuestion = useMemo(() => {
    if (!progress || progress.completed || activeIndex < 0) return null;
    const id = progress.questionOrder[activeIndex];
    return id ? mapById.get(id) ?? null : null;
  }, [activeIndex, mapById, progress]);

  const orderedChoices = useMemo(() => {
    if (!currentQuestion || !progress) return [];
    const order = progress.choiceOrderByQuestion[currentQuestion.id] ?? currentQuestion.choices.map((c) => c.id);
    return order
      .map((choiceId) => currentQuestion.choices.find((c) => c.id === choiceId))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
  }, [currentQuestion, progress]);

  if (!progress || questions.length === 0) return <div>Loading scenario practice…</div>;

  const total = progress.questionOrder.length;
  const answeredCount = Object.keys(progress.answers).length;

  const startOverSameOrder = () => {
    setSubmittedChoiceId(null);
    setLockedQuestionId(null);
    setProgress(createScenarioPracticeProgress(questions, progress.questionOrder));
  };

  const startNewShuffledRun = () => {
    setSubmittedChoiceId(null);
    setLockedQuestionId(null);
    setProgress(createScenarioPracticeProgress(questions));
  };

  if (progress.completed || !currentQuestion) {
    return (
      <div className="space-y-3">
        <div className="card space-y-2">
          <h2 className="text-xl font-semibold">Scenario Practice</h2>
          <p className="text-sm text-slate-300">DAU-style scenario questions for CON 3990V</p>
          <p className="text-sm text-slate-300">Run complete: {answeredCount} of {total} answered.</p>
          <div className="flex flex-wrap gap-2">
            <button className="btn" onClick={startOverSameOrder}>Start Over</button>
            <button className="btn" onClick={startNewShuffledRun}>New Shuffled Run</button>
            <a className="btn" href="/">Back to Home</a>
          </div>
        </div>
      </div>
    );
  }

  const selectedBefore = progress.answers[currentQuestion.id]?.selectedChoiceId ?? null;
  const selected = submittedChoiceId ?? selectedBefore;
  const isSubmitted = lockedQuestionId === currentQuestion.id && Boolean(selected);

  const submit = (choiceId: string) => {
    if (!progress || isSubmitted || progress.answers[currentQuestion.id]) return;

    const questionIdAtSubmit = currentQuestion.id;
    const isCorrect = choiceId === currentQuestion.correctChoiceId;

    setLockedQuestionId(questionIdAtSubmit);
    setSubmittedChoiceId(choiceId);
    setProgress({
      ...progress,
      answers: {
        ...progress.answers,
        [questionIdAtSubmit]: { selectedChoiceId: choiceId, isCorrect }
      }
    });
  };

  const next = () => {
    if (!progress) return;
    setSubmittedChoiceId(null);
    setLockedQuestionId(null);
    const nextIndex = findNextUnansweredIndex(progress, activeIndex + 1);
    if (nextIndex === -1) {
      setProgress({ ...progress, completed: true, currentIndex: progress.questionOrder.length });
      return;
    }
    setProgress({ ...progress, currentIndex: nextIndex });
  };

  const correctChoice = currentQuestion.choices.find((c) => c.id === currentQuestion.correctChoiceId);
  const selectedIsCorrect = selected === currentQuestion.correctChoiceId;

  return (
    <div className="space-y-3">
      <div className="card space-y-2">
        <h2 className="text-xl font-semibold">Scenario Practice</h2>
        <p className="text-sm text-slate-300">DAU-style scenario questions for CON 3990V</p>
        <p className="text-sm text-slate-300">Question {activeIndex + 1} of {total} • Answered {answeredCount}</p>
        <div className="flex gap-2 text-xs">
          <span className="rounded bg-slate-800 px-2 py-1">{currentQuestion.topic}</span>
          <span className="rounded bg-slate-800 px-2 py-1">{currentQuestion.sessionSource}</span>
        </div>
        <div className="flex gap-2">
          <button className="btn" onClick={startOverSameOrder}>Start Over</button>
          <button className="btn" onClick={startNewShuffledRun}>New Shuffled Run</button>
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
              {activeIndex + 1 >= total ? 'Finish Run' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
