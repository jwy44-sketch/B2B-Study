'use client';

import { useEffect, useMemo, useState } from 'react';
import { scenarioQuestions, type ScenarioQuestion } from '@/lib/scenarioQuestions';

type ScenarioSessionQuestion = Omit<ScenarioQuestion, 'choices'> & {
  choices: ScenarioQuestion['choices'];
};

type ScenarioSession = {
  startedAt: number;
  order: string[];
  questions: ScenarioSessionQuestion[];
  index: number;
  answers: Record<string, { selectedChoiceId: string; isCorrect: boolean }>;
};

const STORAGE_KEY = 'b2b_scenario_session_v1';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createSession(): ScenarioSession {
  const shuffledQuestions = shuffle(scenarioQuestions).map((q) => ({ ...q, choices: shuffle(q.choices) }));
  return {
    startedAt: Date.now(),
    order: shuffledQuestions.map((q) => q.id),
    questions: shuffledQuestions,
    index: 0,
    answers: {}
  };
}

export default function ScenarioQuiz() {
  const [session, setSession] = useState<ScenarioSession | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ScenarioSession;
        if (Array.isArray(parsed.questions) && parsed.questions.length === scenarioQuestions.length) {
          setSession(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
    const fresh = createSession();
    setSession(fresh);
  }, []);

  useEffect(() => {
    if (!session) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const total = session?.questions.length ?? scenarioQuestions.length;
  const current = session?.questions[session.index] ?? null;
  const completed = !!session && session.index >= session.questions.length;

  const score = useMemo(() => {
    if (!session) return { correct: 0, total: 0 };
    const correct = Object.values(session.answers).filter((a) => a.isCorrect).length;
    return { correct, total: Object.keys(session.answers).length };
  }, [session]);

  const resetSession = () => {
    const fresh = createSession();
    setSession(fresh);
  };

  const submit = (choiceId: string) => {
    if (!session || !current) return;
    const isCorrect = choiceId === current.correctChoiceId;
    setSession({
      ...session,
      answers: {
        ...session.answers,
        [current.id]: { selectedChoiceId: choiceId, isCorrect }
      }
    });
  };

  const next = () => {
    if (!session) return;
    setSession({ ...session, index: session.index + 1 });
  };

  if (!session) return <div className="card">Loading scenario session...</div>;

  if (completed) {
    const missed = session.questions.filter((q) => !session.answers[q.id]?.isCorrect);
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Scenario-Based Questions</h1>
        <p className="text-slate-300">DAU-style scenario practice for CON 3990V</p>
        <div className="card space-y-2">
          <p className="text-lg font-semibold">Score: {score.correct}/{total}</p>
          <p className="text-sm text-slate-300">Accuracy: {Math.round((score.correct / total) * 100)}%</p>
          <button className="btn" onClick={resetSession}>Start new shuffled session</button>
        </div>
        {missed.length > 0 && (
          <div className="card space-y-3">
            <p className="font-semibold">Review missed questions</p>
            {missed.map((q) => (
              <div key={q.id} className="rounded border border-slate-700 p-3">
                <p className="text-sm uppercase tracking-wide text-brand">{q.topic}</p>
                <p className="font-semibold">{q.stem}</p>
                <p className="mt-1 text-sm text-slate-300">Correct answer: {q.choices.find((c) => c.id === q.correctChoiceId)?.text}</p>
                <p className="mt-1 text-sm text-slate-300">{q.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!current) return <div className="card">Loading question...</div>;

  const answer = session.answers[current.id] ?? null;
  const answered = !!answer;
  const correctText = current.choices.find((c) => c.id === current.correctChoiceId)?.text;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Scenario-Based Questions</h1>
      <p className="text-slate-300">DAU-style scenario practice for CON 3990V</p>

      <div className="card flex items-center justify-between text-sm">
        <span>Progress: {session.index + 1}/{total}</span>
        <span>Score: {score.correct}/{score.total}</span>
      </div>

      <div className="card space-y-3">
        <p className="text-sm uppercase tracking-wide text-brand">{current.topic}</p>
        <p className="font-semibold">Q{current.questionNumber}. {current.stem}</p>
        <div className="space-y-2">
          {current.choices.map((choice, idx) => {
            const label = String.fromCharCode(65 + idx);
            const isSelected = answer?.selectedChoiceId === choice.id;
            const isCorrectChoice = choice.id === current.correctChoiceId;
            const stateClass = answered
              ? isCorrectChoice
                ? 'border-green-500 bg-green-900/30'
                : isSelected
                  ? 'border-red-500 bg-red-900/30'
                  : 'border-slate-700'
              : 'border-slate-700 hover:border-brand';
            return (
              <button
                key={`${current.id}-${choice.id}`}
                className={`block w-full rounded border p-3 text-left ${stateClass}`}
                onClick={() => submit(choice.id)}
                disabled={answered}
              >
                <span className="font-semibold mr-2">{label}.</span>{choice.text}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className="rounded border border-slate-700 bg-slate-900/70 p-3 text-sm space-y-1">
            <p className={answer.isCorrect ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'}>
              {answer.isCorrect ? 'Correct' : 'Incorrect'}
            </p>
            {!answer.isCorrect && <p className="text-slate-300"><span className="font-semibold">Correct answer:</span> {correctText}</p>}
            <p className="text-slate-300"><span className="font-semibold">Topic:</span> {current.topic}</p>
            <p className="text-slate-300"><span className="font-semibold">Explanation:</span> {current.explanation}</p>
            <button className="btn mt-2" onClick={next}>{session.index + 1 >= total ? 'Finish' : 'Next question'}</button>
          </div>
        )}
      </div>

      <button className="rounded border border-slate-600 px-3 py-2 text-sm" onClick={resetSession}>Start new shuffled session</button>
    </div>
  );
}
