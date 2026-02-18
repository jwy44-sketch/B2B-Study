'use client';

import { useEffect, useMemo, useState } from 'react';
import { computeDatasetVersion } from '@/lib/datasetVersion';
import { recordQuestionResult, type LearnEngineState } from '@/lib/learnEngine';
import { loadLearnSession, saveLearnSession } from '@/lib/learnPersistence';
import { createPracticeSession, practiceScore, submitPracticeAnswer, type PracticeSession } from '@/lib/practiceEngine';
import { loadQuestions } from '@/lib/questions';
import type { Question } from '@/lib/types';

export default function PracticeClient() {
  const [idFilter, setIdFilter] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [datasetVersion, setDatasetVersion] = useState('');
  const [learnEngine, setLearnEngine] = useState<LearnEngineState | null>(null);
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState<'random' | 'sequential'>('random');
  const [timer, setTimer] = useState<'off' | 'stopwatch' | 'countdown-10' | 'countdown-20'>('off');
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [timeNow, setTimeNow] = useState(Date.now());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIdFilter(new URLSearchParams(window.location.search).get('ids'));
    }

    loadQuestions().then((loaded) => {
      setQuestions(loaded);
      setDatasetVersion(computeDatasetVersion(loaded));
    });
    const saved = loadLearnSession();
    setLearnEngine(saved?.engine ?? null);
  }, []);

  useEffect(() => {
    if (!session) return;
    const id = window.setInterval(() => setTimeNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [session]);

  useEffect(() => {
    if (!learnEngine || !datasetVersion) return;
    saveLearnSession({ datasetVersion, engine: learnEngine });
  }, [learnEngine, datasetVersion]);

  const pool = useMemo(() => {
    const singleIds = idFilter;
    if (!singleIds) return questions;
    const set = new Set(singleIds.split(','));
    return questions.filter((question) => set.has(question.id));
  }, [questions, idFilter]);

  const byId = useMemo(() => new Map(questions.map((question) => [question.id, question])), [questions]);
  const currentId = session?.ids[session.index] ?? null;
  const currentQuestion = currentId ? byId.get(currentId) ?? null : null;

  const timerDisplay = useMemo(() => {
    if (!session) return '00:00';
    const elapsedSeconds = Math.max(0, Math.floor((timeNow - session.startedAt) / 1000));
    if (session.timerMode === 'stopwatch') {
      const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
      const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    }

    if (session.timerMode === 'countdown') {
      const remaining = Math.max(0, session.countdownSeconds - elapsedSeconds);
      const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
      const seconds = (remaining % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    }

    return 'Off';
  }, [session, timeNow]);

  const start = () => {
    const countdownSeconds = timer === 'countdown-10' ? 600 : timer === 'countdown-20' ? 1200 : 0;
    const timerMode = timer === 'off' ? 'off' : timer === 'stopwatch' ? 'stopwatch' : 'countdown';
    setSession(createPracticeSession(pool.map((question) => question.id), count, mode, timerMode, countdownSeconds));
  };

  const answer = (selectedIndex: number | null) => {
    if (!session || !currentQuestion || !learnEngine) return;
    const next = submitPracticeAnswer(session, currentQuestion.id, selectedIndex, currentQuestion.correctIndex);
    setSession(next);
    setLearnEngine(recordQuestionResult(learnEngine, currentQuestion.id, selectedIndex === currentQuestion.correctIndex));
  };

  if (!session) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Practice Test</h1>
        <div className="card grid gap-3 md:grid-cols-2">
          <label>Question count
            <input className="mt-1 w-full rounded border border-slate-700 bg-slate-800 p-2" type="number" min={1} max={pool.length || 1} value={count} onChange={(event) => setCount(Number(event.target.value))} />
          </label>
          <label>Mode
            <select className="mt-1 w-full rounded border border-slate-700 bg-slate-800 p-2" value={mode} onChange={(event) => setMode(event.target.value as 'random' | 'sequential')}>
              <option value="random">Random</option>
              <option value="sequential">Sequential</option>
            </select>
          </label>
          <label>Timer
            <select className="mt-1 w-full rounded border border-slate-700 bg-slate-800 p-2" value={timer} onChange={(event) => setTimer(event.target.value as typeof timer)}>
              <option value="off">Off</option>
              <option value="stopwatch">Stopwatch</option>
              <option value="countdown-10">Countdown 10m</option>
              <option value="countdown-20">Countdown 20m</option>
            </select>
          </label>
          <div className="flex items-end"><button className="btn" onClick={start}>Start test</button></div>
        </div>
      </div>
    );
  }

  const complete = session.index >= session.ids.length;
  if (complete) {
    const score = practiceScore(session);
    const incorrect = session.ids.filter((id) => !session.answers[id]?.isCorrect).map((id) => byId.get(id)).filter(Boolean) as Question[];

    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Practice Results</h1>
        <div className="card">
          <p className="text-lg font-semibold">Score: {score.correct}/{score.total}</p>
          <p className="text-sm text-slate-300">Accuracy: {score.accuracyPct}%</p>
        </div>

        {incorrect.map((question) => {
          const explanation = question.explanationRich;

          return (
            <div key={question.id} className="card space-y-1">
              <p className="font-semibold">{question.prompt}</p>
              <p>Correct answer: {question.choices[question.correctIndex]}</p>
              {explanation ? (
                <>
                  <a className="text-sky-300 underline" href={explanation.farRefs.part.url} target="_blank" rel="noopener noreferrer">{explanation.farRefs.part.cite} — {explanation.farRefs.part.title}</a>
                  {explanation.farRefs.subpart && <a className="block text-sky-300 underline" href={explanation.farRefs.subpart.url} target="_blank" rel="noopener noreferrer">{explanation.farRefs.subpart.cite} — {explanation.farRefs.subpart.title}</a>}
                  {explanation.farRefs.sections.map((section) => (
                    <a key={section.cite} className="block text-sky-300 underline" href={section.url} target="_blank" rel="noopener noreferrer">FAR {section.cite} — {section.title}</a>
                  ))}
                  <p className="text-sm font-semibold">What this tests:</p>
                  <p className="text-sm">{explanation.whatThisTests}</p>
                  <p className="text-sm font-semibold">How to decide (DAU thinking):</p>
                  <ol className="list-decimal pl-5 text-sm">
                    {explanation.decisionSteps.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                  <p className="text-sm"><span className="font-semibold">Why this is correct:</span> {explanation.whyCorrect}</p>
                  <ul className="list-disc pl-5 text-sm text-slate-300">
                    {explanation.whyWrong.map((item) => <li key={`${item.choiceLabel}-${item.reason}`}>{item.choiceLabel}: {item.reason}</li>)}
                  </ul>
                  <p className="text-sm"><span className="font-semibold">Field tip:</span> {explanation.fieldTip}</p>
                </>
              ) : (
                <p className="text-sm text-amber-200">Missing explanationRich for question id: {question.id}</p>
              )}
            </div>
          );
        })}

        <div className="flex gap-2">
          <button className="btn" onClick={() => setSession(null)}>New test</button>
          <button
            className="rounded border border-slate-600 px-3 py-2"
            onClick={() => {
              const missedIds = session.ids.filter((id) => !session.answers[id]?.isCorrect);
              setSession(createPracticeSession(missedIds, missedIds.length, 'sequential', 'off', 0));
            }}
          >
            Retry missed only
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Practice Test</h1>
      <div className="card flex items-center justify-between text-sm">
        <span>Question {session.index + 1}/{session.ids.length}</span>
        <span>Timer: {timerDisplay}</span>
      </div>
      <div className="card space-y-2">
        <p className="font-semibold">{currentQuestion.prompt}</p>
        {currentQuestion.choices.map((choice, index) => (
          <button key={`${currentQuestion.id}-${index}`} className="block w-full rounded border border-slate-700 p-2 text-left hover:border-brand" onClick={() => answer(index)}>
            {index + 1}. {choice}
          </button>
        ))}
        <button className="rounded border border-amber-400 px-3 py-2 text-amber-300" onClick={() => answer(null)}>I don't know</button>
      </div>
    </div>
  );
}
