import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

type Question = {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  source: string;
  explanation?: string;
  explanationRich?: ExplanationRich;
};

type ExplanationRich = {
  farRefs: {
    part: { cite: string; title: string; url: string };
    subpart?: { cite: string; title: string; url: string };
    sections: Array<{ cite: string; title: string; url: string }>;
  };
  whatThisTests: string;
  decisionSteps: string[];
  whyCorrect: string;
  whyWrong: Array<{ choiceLabel: string; reason: string }>;
  fieldTip: string;
  memoryHook?: string;
};

type FarMapping = {
  part: number;
  partTitle: string;
  section?: { cite: string; title: string };
  subpart?: { cite: string; title: string };
};

const PART_TITLES: Record<number, string> = {
  1: 'Federal Acquisition Regulations System',
  4: 'Administrative and Information Matters',
  6: 'Competition Requirements',
  10: 'Market Research',
  12: 'Acquisition of Commercial Products and Commercial Services',
  13: 'Simplified Acquisition Procedures',
  14: 'Sealed Bidding',
  15: 'Contracting by Negotiation',
  16: 'Types of Contracts',
  17: 'Special Contracting Methods',
  33: 'Protests, Disputes, and Appeals',
  43: 'Contract Modifications',
  44: 'Subcontracting Policies and Procedures',
  45: 'Government Property',
  46: 'Quality Assurance',
  49: 'Termination of Contracts'
};

const choiceLabel = (index: number) => String.fromCharCode(65 + index);

function inferFar(questionText: string): FarMapping {
  const q = questionText.toLowerCase();
  if (q.includes('market research')) return { part: 10, partTitle: PART_TITLES[10], section: { cite: '10.002', title: 'Procedures' } };
  if (q.includes('simplified acquisition') || q.includes('sap') || q.includes('micro-purchase') || q.includes('quotes')) {
    return { part: 13, partTitle: PART_TITLES[13], section: { cite: '13.106-1', title: 'Soliciting competition' } };
  }
  if (q.includes('ifb') || q.includes('sealed bidding')) return { part: 14, partTitle: PART_TITLES[14] };
  if (q.includes('tradeoff') || q.includes('competitive range') || q.includes('discussion') || q.includes('negotiation') || q.includes('rfp') || q.includes('source selection')) {
    return { part: 15, partTitle: PART_TITLES[15], section: { cite: '15.306', title: 'Exchanges with offerors' } };
  }
  if (q.includes('option year') || q.includes('exercise an option')) {
    return { part: 17, partTitle: PART_TITLES[17], subpart: { cite: '17.2', title: 'Options' }, section: { cite: '17.207', title: 'Exercise of options' } };
  }
  if (q.includes('modification') || q.includes('sf 30') || q.includes('change order') || q.includes('bilateral') || q.includes('unilateral')) {
    return { part: 43, partTitle: PART_TITLES[43], section: { cite: '43.103', title: 'Types of contract modifications' } };
  }
  if (q.includes('protest') || q.includes('gao') || q.includes('claim') || q.includes('dispute') || q.includes('appeal')) {
    return { part: 33, partTitle: PART_TITLES[33], section: { cite: '33.104', title: 'Protests to GAO' } };
  }
  if (q.includes('time-and-materials') || q.includes('t&m') || q.includes('contract type') || q.includes('fixed-price') || q.includes('cost-reimbursement') || q.includes('cpff')) {
    return { part: 16, partTitle: PART_TITLES[16], section: { cite: '16.103', title: 'Negotiating contract type' } };
  }
  if (q.includes('commercial')) return { part: 12, partTitle: PART_TITLES[12], section: { cite: '12.102', title: 'Applicability' } };
  if (q.includes('sole source') || q.includes('competition') || q.includes('urgency') || q.includes('brand')) {
    return { part: 6, partTitle: PART_TITLES[6], section: { cite: '6.302-1', title: 'Only one responsible source' } };
  }
  if (q.includes('subcontract')) return { part: 44, partTitle: PART_TITLES[44] };
  if (q.includes('government property')) return { part: 45, partTitle: PART_TITLES[45] };
  if (q.includes('quality') || q.includes('inspection') || q.includes('acceptance')) return { part: 46, partTitle: PART_TITLES[46] };
  if (q.includes('termination')) return { part: 49, partTitle: PART_TITLES[49] };
  if (q.includes('piid') || q.includes('contract files')) return { part: 4, partTitle: PART_TITLES[4] };
  if (q.includes('contracting officer') || q.includes('delegation')) return { part: 1, partTitle: PART_TITLES[1], section: { cite: '1.602-2', title: 'Responsibilities' } };
  return { part: 15, partTitle: PART_TITLES[15] };
}

function pickWrongIndices(correctIndex: number): number[] {
  const indices = [0, 1, 2, 3].filter((i) => i !== correctIndex);
  return indices.slice(0, 2);
}

function compact(text: string, max = 95): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

function buildRich(question: Question): ExplanationRich {
  const far = inferFar(question.question);
  const part = {
    cite: `FAR Part ${far.part}`,
    title: far.partTitle,
    url: `https://www.acquisition.gov/far/part-${far.part}`
  };
  const sections = far.section
    ? [{ cite: far.section.cite, title: far.section.title, url: `https://www.acquisition.gov/far/${far.section.cite}` }]
    : [];

  const subpart = far.subpart
    ? {
      cite: `FAR Subpart ${far.subpart.cite}`,
      title: far.subpart.title,
      url: `https://www.acquisition.gov/far/subpart-${far.subpart.cite}`
    }
    : undefined;

  const correctChoice = question.choices[question.correctIndex];
  const wrongIndices = pickWrongIndices(question.correctIndex);
  const qSnippet = compact(question.question, 120);

  const whatThisTests = `This item checks whether you can translate the phrase “${compact(question.question.split('?')[0], 70)}” into the correct FAR decision path before acting.`;
  const decisionSteps = [
    `Step 1: Pull the trigger words from the stem (${qSnippet.toLowerCase()}) and match them to the governing part in the FAR.`.replace('  ', ' '),
    `Step 2: Compare each option against the rule's condition, especially limits on authority, competition, documentation, and timing.`,
    `Step 3: Pick the answer that directly satisfies both the scenario facts and the required procedural safeguard, then capture the rationale in the contract file.`
  ];

  const whyCorrect = `The winning choice is ${choiceLabel(question.correctIndex)} (${correctChoice}) because it responds to the exact condition in the prompt, not just a general preference. In this question, the stem tells you what must happen first, and this option follows that sequence while preserving the FAR controls for ${part.cite}. If you apply the answer in order—identify the trigger, verify authority, then document the decision—you stay aligned with both policy intent and audit expectations.`;

  const whyWrong = wrongIndices.map((idx) => {
    const wrong = question.choices[idx];
    const prefix = idx < question.correctIndex
      ? 'This distractor jumps to action too early'
      : 'This distractor sounds efficient but misses a required condition';
    return {
      choiceLabel: choiceLabel(idx),
      reason: `${prefix}: “${compact(wrong, 85)}.” It does not fit the stem language, so using it would leave a gap in required documentation or legal basis.`
    };
  });

  const fieldTip = `Before award or modification, add a short memo that quotes the stem trigger words, cites ${part.cite}${sections[0] ? ` and FAR ${sections[0].cite}` : ''}, and explains in plain language why ${choiceLabel(question.correctIndex)} was selected over the closest distractor.`;
  const memoryHook = `If the stem gives a condition, choose the option that satisfies that condition first and documents it.`;

  return {
    farRefs: {
      part,
      subpart,
      sections
    },
    whatThisTests,
    decisionSteps,
    whyCorrect,
    whyWrong,
    fieldTip,
    memoryHook
  };
}

function toText(explanationRich: ExplanationRich): string {
  const refs = [
    `${explanationRich.farRefs.part.cite} — ${explanationRich.farRefs.part.title} (${explanationRich.farRefs.part.url})`,
    ...(explanationRich.farRefs.subpart ? [`${explanationRich.farRefs.subpart.cite} — ${explanationRich.farRefs.subpart.title} (${explanationRich.farRefs.subpart.url})`] : []),
    ...explanationRich.farRefs.sections.map((s) => `FAR ${s.cite} — ${s.title} (${s.url})`)
  ];

  const wrong = explanationRich.whyWrong.map((w) => `${w.choiceLabel}: ${w.reason}`).join('\n');
  return [
    `FAR References:\n${refs.map((r) => `- ${r}`).join('\n')}`,
    `What this tests: ${explanationRich.whatThisTests}`,
    `How to decide:\n${explanationRich.decisionSteps.map((s, i) => `${i + 1}) ${s}`).join('\n')}`,
    `Why the correct answer works: ${explanationRich.whyCorrect}`,
    `Why other options fail:\n${wrong}`,
    `Field tip: ${explanationRich.fieldTip}`,
    explanationRich.memoryHook ? `Memory hook: ${explanationRich.memoryHook}` : ''
  ].filter(Boolean).join('\n\n');
}

function main() {
  const path = join(process.cwd(), 'data', 'con3910_quizlet.json');
  const questions = JSON.parse(readFileSync(path, 'utf8')) as Question[];

  const updated = questions.map((q) => {
    const explanationRich = buildRich(q);
    return {
      ...q,
      explanationRich,
      explanation: toText(explanationRich)
    };
  });

  writeFileSync(path, `${JSON.stringify(updated, null, 2)}\n`);
  console.log(`Embedded explanations for ${updated.length} questions.`);
}

main();
