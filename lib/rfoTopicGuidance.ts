export type RfoStatus = 'unchanged' | 'transition-note' | 'revised' | 'expanded';

export type RfoCitation = {
  label: string;
  url: string;
};

export type TopicGuidance = {
  key: string;
  title: string;
  appliesToParts: number[];
  rfoStatus: RfoStatus;
  action: 'keep' | 'keep_with_transition_note' | 'revise' | 'expand';
  coreExplanation: string;
  whyItMatters: string;
  rfoTransitionNote?: string;
  commonTrap?: string;
  scenarioTip?: string;
  citations: RfoCitation[];
};

export const TOPIC_GUIDANCE: TopicGuidance[] = [
  {
    key: 'far-rfo-framework',
    title: 'FAR / RFO Framework',
    appliesToParts: [1],
    rfoStatus: 'transition-note',
    action: 'keep_with_transition_note',
    coreExplanation: 'Use FAR structure and citation discipline, then apply any agency-issued RFO class deviation text that implements model deviations.',
    whyItMatters: 'CON 3990V-style reasoning still starts from controlling authority and file support; RFO primarily changes wording and structure, not core judgment logic.',
    rfoTransitionNote: 'Core concept unchanged; current RFO guidance emphasizes plain-language model deviation text and agency implementation status by part.',
    commonTrap: 'Assuming model deviation text applies government-wide without checking agency implementation.',
    scenarioTip: 'Start by identifying acquisition phase, controlling FAR/RFO part, and the decision documentation required.',
    citations: [
      { label: 'FAR Overhaul FAQs', url: 'https://www.acquisition.gov/far-overhaul/faqs' },
      { label: 'RFO Part Deviation Guide', url: 'https://www.acquisition.gov/far-overhaul/far-part-deviation-guide' },
      { label: 'FAR Overhaul Part 1', url: 'https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-1' }
    ]
  },
  {
    key: 'acquisition-planning',
    title: 'Acquisition Planning / Lifecycle Framing',
    appliesToParts: [7],
    rfoStatus: 'expanded',
    action: 'expand',
    coreExplanation: 'Planning applies across the lifecycle; pre-award choices drive award quality and post-award administration outcomes.',
    whyItMatters: 'Most missed scenario questions come from skipping planning artifacts or mixing pre-award and post-award decision standards.',
    rfoTransitionNote: 'RFO wording is streamlined, but planning rigor, approvals, and documentation discipline remain expected.',
    commonTrap: 'Treating urgency as a reason to skip acquisition planning steps.',
    scenarioTip: 'Document what is known now, what remains uncertain, and how the strategy will control risk at award and administration.',
    citations: [
      { label: 'FAR Overhaul Part 7', url: 'https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-7' }
    ]
  },
  {
    key: 'market-research',
    title: 'Market Research',
    appliesToParts: [10],
    rfoStatus: 'revised',
    action: 'revise',
    coreExplanation: 'Market research is continuous and must be appropriate to the circumstances.',
    whyItMatters: 'It drives requirement shaping, competition strategy, and contract-type choices before solicitation or order award.',
    rfoTransitionNote: 'Current RFO Part 10 explicitly calls out market research before new requirements, solicitations over SAT, and orders over SAT.',
    commonTrap: 'Writing a sole-source narrative before gathering market evidence.',
    scenarioTip: 'Capture the vendor landscape, constraints, and rationale in a right-sized record tied to acquisition complexity.',
    citations: [
      { label: 'FAR Overhaul Part 10', url: 'https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-10' }
    ]
  },
  {
    key: 'request-offers-exchanges',
    title: 'Request Offers / Exchanges',
    appliesToParts: [15],
    rfoStatus: 'transition-note',
    action: 'keep_with_transition_note',
    coreExplanation: 'Keep distinctions between clarifications, communications, and discussions; use competitive range and exchange mechanics as stated in the solicitation.',
    whyItMatters: 'Exam scenarios test whether exchanges preserve fairness and documentation.',
    rfoTransitionNote: 'Core source selection mechanics remain, while RFO plain-language framing reduces unnecessary wording.',
    commonTrap: 'Treating all post-proposal exchanges as discussions.',
    scenarioTip: 'Ask: did this exchange allow proposal revision? If yes, treat it as discussions with corresponding controls.',
    citations: [
      { label: 'FAR Overhaul Part 15', url: 'https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15' }
    ]
  },
  {
    key: 'small-business-part-19',
    title: 'Small Business / Part 19',
    appliesToParts: [19],
    rfoStatus: 'transition-note',
    action: 'keep_with_transition_note',
    coreExplanation: 'Small business set-aside and subcontracting-plan fundamentals remain central competency areas.',
    whyItMatters: 'Learners still need Part 19 logic for set-asides, subcontracting plans, and documentation decisions.',
    rfoTransitionNote: 'Part 19 model deviation text was updated in 2026 to align subcontracting reporting migration from eSRS to SAM.gov.',
    commonTrap: 'Assuming the legacy eSRS reporting flow remains the active system of record.',
    scenarioTip: 'When a question mentions subcontract reporting systems, flag the eSRS-to-SAM.gov transition and verify agency implementation.',
    citations: [
      { label: 'FAR Updates to Align with eSRS Decommissioning', url: 'https://www.acquisition.gov/content/far-updates-align-esrs-decommissioning' },
      { label: 'FAR Overhaul Part 19', url: 'https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-19' }
    ]
  },
  {
    key: 'thresholds-transition',
    title: 'Thresholds Transition',
    appliesToParts: [1, 5, 10, 22, 25, 52],
    rfoStatus: 'transition-note',
    action: 'keep_with_transition_note',
    coreExplanation: 'Threshold literacy still matters, but exam reasoning should focus first on process logic and acquisition category decisions.',
    whyItMatters: 'Current training indicates threshold shifts exist, but many scenario outcomes remain driven by core rules and process.',
    rfoTransitionNote: 'Threshold tables were updated effective October 1, 2025; learners should check current values without over-rotating scenario conclusions.',
    commonTrap: 'Rewriting every answer based on a threshold change when the controlling logic did not change.',
    scenarioTip: 'Use thresholds as a gate check after identifying the governing process.',
    citations: [
      { label: 'Threshold Changes (Oct 1, 2025)', url: 'https://www.acquisition.gov/threshold-changes' },
      { label: 'FAR 52 page showing FAC 2026-01 effective date', url: 'https://www.acquisition.gov/far/52.203-1' }
    ]
  }
];

export const guidanceForPart = (part: number): TopicGuidance | null => {
  return TOPIC_GUIDANCE.find((item) => item.appliesToParts.includes(part)) ?? null;
};
