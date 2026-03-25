'use client';

import { useEffect, useMemo, useState } from 'react';
import { getBatchMetrics, initializeLearnEngine, restartLearnEngine, submitLearnAnswer, type LearnEngineState } from '@/lib/learnEngine';
import { scenarioQuestions } from '@/lib/scenarioQuestions';
import { clearScenarioLearnSession, restoreOrInitializeScenarioLearn, saveScenarioLearnSession } from '@/lib/scenarioLearnPersistence';
import { LearnCompleteCard } from './LearnCompleteCard';

type Mode = 'LOADING' | 'QUESTION' | 'FEEDBACK' | 'COMPLETE';

const BATCH_SIZE = 10;
const MASTERY_TARGET = 2;

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const datasetVersion = scenarioQuestions.map((q) => q.id).join('|');

export default function ScenarioLearnClient() {
  const [engine, setEngine] = useState<LearnEngineState | null>(null);
  const [mode, setMode] = useState<Mode>('LOADING');
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [choiceOrderByQuestionId, setChoiceOrderByQuestionId] = useState<Record<string, string[]>>({});
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);

  const byId = useMemo(() => new Map(scenarioQuestions.map((q) => [q.id, q])), []);

  useEffect(() => {
    const shuffledIds = shuffle(scenarioQuestions.map((q) => q.id));
    const freshChoiceOrder = Object.fromEntries(
      scenarioQuestions.map((question) => [question.id, shuffle(question.choices.map((choice) => choice.id))])
    );

    const restored = restoreOrInitializeScenarioLearn({
      allIds: shuffledIds,
      batchSize: BATCH_SIZE,
      masteryTarget: MASTERY_TARGET,
      datasetVersion,
      choiceOrderByQuestionId: freshChoiceOrder
    });

    setEngine(restored.engine);
    setChoiceOrderByQuestionId(restored.choiceOrderByQuestionId);

    if (restored.resetReason === 'version_mismatch') {
      setResumeNotice('Scenario Learn progress was reset because the scenario set changed.');
    } else if (restored.resetReason === 'corrupt') {
      setResumeNotice('Scenario Learn save was corrupted and was reset safely.');
    } else {
      setResumeNotice('Continuing Scenario Learn where you left off.');
    }

    setMode(restored.engine.sessionComplete ? 'COMPLETE' : 'QUESTION');
  }, [byId]);

  useEffect(() => {
    if (!engine) return;
    saveScenarioLearnSession({ datasetVersion, engine, choiceOrderByQuestionId });
  }, [engine, choiceOrderByQuestionId]);

  const currentQuestion = engine?.currentQuestionId ? byId.get(engine.currentQuestionId) ?? null : null;

  const orderedChoices = useMemo(() => {
    if (!currentQuestion) return [];
    const order = (choiceOrderByQuestionId[currentQuestion.id] ?? currentQuestion.choices.map((choice) => choice.id)) as Array<'A' | 'B' | 'C' | 'D'>;
    const map = new Map(currentQuestion.choices.map((choice) => [choice.id, choice]));
    return order.map((id) => map.get(id)).filter((choice): choice is NonNullable<typeof choice> => !!choice);
  }, [currentQuestion, choiceOrderByQuestionId]);

  const metrics = engine ? getBatchMetrics(engine) : null;
  const overallMastered = engine
    ? engine.allIds.filter((id) => engine.statsById[id]?.mastered).length
    : 0;

  const submit = (choiceId: string) => {
    if (!engine || !currentQuestion || mode !== 'QUESTION') return;
    const correct = choiceId === currentQuestion.correctChoiceId;
    setSelectedChoiceId(choiceId);
    setWasCorrect(correct);
    setMode('FEEDBACK');
  };

  const next = () => {
    if (!engine || mode !== 'FEEDBACK') return;
    const nextEngine = submitLearnAnswer(engine, wasCorrect === true);
    setEngine(nextEngine);
    setSelectedChoiceId(null);
    setWasCorrect(null);
    setMode(nextEngine.sessionComplete ? 'COMPLETE' : 'QUESTION');
  };

  const restart = () => {
    if (!engine) return;
    clearScenarioLearnSession();
    const restarted = restartLearnEngine(engine);
    const newChoiceOrder = Object.fromEntries(
      scenarioQuestions.map((question) => [question.id, shuffle(question.choices.map((choice) => choice.id))])
    );
    setChoiceOrderByQuestionId(newChoiceOrder);
    setEngine(restarted);
    setSelectedChoiceId(null);
    setWasCorrect(null);
    setMode('QUESTION');
    setResumeNotice('Scenario Learn restarted from Batch 1.');
  };

  const startNewShuffledSession = () => {
    if (!engine) return;
    clearScenarioLearnSession();
    const shuffledIds = shuffle(scenarioQuestions.map((q) => q.id));
    const newChoiceOrder = Object.fromEntries(
      scenarioQuestions.map((question) => [question.id, shuffle(question.choices.map((choice) => choice.id))])
    );
    setChoiceOrderByQuestionId(newChoiceOrder);
    setEngine(initializeLearnEngine(shuffledIds, BATCH_SIZE, MASTERY_TARGET));
    setSelectedChoiceId(null);
    setWasCorrect(null);
    setMode('QUESTION');
    setResumeNotice('Started a new shuffled Scenario Learn session.');
  };

  if (!engine || !metrics || mode === 'LOADING') return <div>Loading Scenario Learn…</div>;

  if (mode === 'COMPLETE') {
    const missedCount = engine.allIds.filter((id) => (engine.statsById[id]?.incorrectCount ?? 0) > 0).length;
    return (
      <div className="space-y-3">
        <LearnCompleteCard
          title="You finished Scenario Learn"
          subtitle="All scenario batches are complete."
          totalQuestions={engine.allIds.length}
          totalBatches={Math.max(1, Math.ceil(engine.allIds.length / engine.batchSize))}
          masteredCount={overallMastered}
          correctCount={Object.values(engine.statsById).filter((s) => s.lastResult === 'correct').length}
          incorrectCount={Object.values(engine.statsById).filter((s) => s.lastResult === 'wrong').length}
          missedCount={missedCount}
          onRestart={restart}
          onStartShuffled={startNewShuffledSession}
          onReviewMissed={missedCount > 0 ? () => {
            const missedIds = engine.allIds.filter((id) => (engine.statsById[id]?.incorrectCount ?? 0) > 0);
            if (!missedIds.length) return;
            setEngine(initializeLearnEngine(missedIds, BATCH_SIZE, MASTERY_TARGET));
            setSelectedChoiceId(null);
            setWasCorrect(null);
            setMode('QUESTION');
            setResumeNotice('Reviewing missed scenario questions only.');
          } : undefined}
        />
      </div>
    );
  }

  if (!currentQuestion) return <div className="card">Loading scenario question…</div>;

  const answer = selectedChoiceId;
  const answered = mode === 'FEEDBACK' && !!answer;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Scenario Learn</h1>
      <p className="text-slate-300">Batch-based scenario learning for CON 3990V.</p>
      {resumeNotice && <div className="rounded border border-sky-500/50 bg-sky-950/30 p-2 text-sm text-sky-200">{resumeNotice}</div>}

      <div className="card space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Batch {metrics.batchNumber} of {metrics.totalBatches}</span>
          <span>Mastered in batch: {metrics.masteredCount}/{metrics.totalInBatch}</span>
        </div>
        <div className="h-2 rounded bg-slate-700">
          <div className="h-2 rounded bg-brand" style={{ width: `${metrics.progressPct}%` }} />
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>{engine.reviewingMissed ? 'Reviewing missed scenario questions' : 'Learning new scenario questions'}</span>
          <span>Remaining in batch: {metrics.remaining}</span>
        </div>
        <p className="text-slate-300">Total mastery progress: {overallMastered}/{engine.allIds.length}</p>
      </div>

      <div className="card space-y-3">
        <p className="text-sm uppercase tracking-wide text-brand">{currentQuestion.topic}</p>
        <p className="text-xs text-slate-400">{currentQuestion.sessionSource ?? 'Session source pending'}</p>
        <p className="font-semibold">Q{currentQuestion.questionNumber}. {currentQuestion.stem}</p>

        <div className="space-y-2">
          {orderedChoices.map((choice, idx) => {
            const label = String.fromCharCode(65 + idx);
            const isSelected = answer === choice.id;
            const isCorrectChoice = choice.id === currentQuestion.correctChoiceId;
            const stateClass = answered
              ? isCorrectChoice
                ? 'border-green-500 bg-green-900/30'
                : isSelected
                  ? 'border-red-500 bg-red-900/30'
                  : 'border-slate-700'
              : 'border-slate-700 hover:border-brand';

            return (
              <button
                key={`${currentQuestion.id}-${choice.id}`}
                className={`block w-full rounded border p-3 text-left ${stateClass}`}
                onClick={() => submit(choice.id)}
                disabled={answered}
              >
                <span className="mr-2 font-semibold">{label}.</span>
                {choice.text}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="rounded border border-slate-700 bg-slate-900/70 p-3 text-sm space-y-1">
            <p className={wasCorrect ? 'font-semibold text-green-300' : 'font-semibold text-red-300'}>
              {wasCorrect ? 'Correct' : 'Incorrect'}
            </p>
            <p className="text-slate-300"><span className="font-semibold">Topic:</span> {currentQuestion.topic}</p>
            <p className="text-slate-300"><span className="font-semibold">Session:</span> {currentQuestion.sessionSource ?? 'Session source pending'}</p>
            {!wasCorrect && (
              <p className="text-slate-300">
                <span className="font-semibold">Correct answer:</span>{' '}
                {currentQuestion.choices.find((c) => c.id === currentQuestion.correctChoiceId)?.text}
              </p>
            )}
            <p className="text-slate-300"><span className="font-semibold">Explanation:</span> {currentQuestion.explanation}</p>
            <button className="btn mt-2" onClick={next}>Next question</button>
          </div>
        )}
      </div>

      <button className="rounded border border-slate-600 px-3 py-2 text-sm" onClick={restart}>Restart Scenario Learn</button>
    </div>
  );
}
