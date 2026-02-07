'use client';

export function ScenarioBlock({ scenarioContext }: { scenarioContext?: string | null }) {
  if (!scenarioContext) return null;

  return (
    <section className="rounded-lg border border-sky-700/60 bg-sky-950/30 p-3">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-sky-300">Scenario</h3>
      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200">{scenarioContext}</p>
    </section>
  );
}
