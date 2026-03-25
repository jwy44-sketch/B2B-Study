export type RfoStatus = 'unchanged' | 'transition-note' | 'revised' | 'expanded';

export type RfoCitation = {
  label: string;
  url: string;
};

export type TopicGuidance = {
  key: string;
  title: string;
  sessionSource: 'Session 1' | 'Session 2' | 'Session 3';
  topicArea: string;
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
    sessionSource: 'Session 1',
    topicArea: 'Contract Principles',
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
    sessionSource: 'Session 2',
    topicArea: 'Plan Solicitation',
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
    sessionSource: 'Session 2',
    topicArea: 'Plan Solicitation',
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
    sessionSource: 'Session 3',
    topicArea: 'Select Source',
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
    sessionSource: 'Session 2',
    topicArea: 'Request Offers',
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
    sessionSource: 'Session 1',
    topicArea: 'Contract Principles',
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
  },
  {
    key: 'cost-price-analysis',
    title: 'Cost or Price Analysis',
    sessionSource: 'Session 3',
    topicArea: 'Cost or Price Analysis',
    appliesToParts: [15],
    rfoStatus: 'expanded',
    action: 'expand',
    coreExplanation: 'Differentiate price analysis, cost analysis, and cost realism based on acquisition context and data availability.',
    whyItMatters: 'Award-phase decisions are frequently missed when teams confuse analysis method with contract type or source-selection approach.',
    rfoTransitionNote: 'Current transition framing under Part 15 keeps the same core analysis competency while streamlining wording.',
    commonTrap: 'Applying cost realism as a blanket step for every fixed-price competitive action.',
    scenarioTip: 'State which analysis method is required first, then defend it with the facts in the scenario.',
    citations: [
      { label: 'FAR Overhaul Part 15', url: 'https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15' },
      { label: 'FAR Part 15', url: 'https://www.acquisition.gov/far/part-15' }
    ]
  },
  {
    key: 'negotiation-position-documentation',
    title: 'Negotiation Position / PNM vs SSDD',
    sessionSource: 'Session 3',
    topicArea: 'Plan Negotiation',
    appliesToParts: [15],
    rfoStatus: 'expanded',
    action: 'expand',
    coreExplanation: 'Use negotiation-position development and PNM logic for negotiated pricing actions, and SSDD logic for competitive source selection decisions.',
    whyItMatters: 'Learners often mix competitive source-selection documentation with one-offeror/noncompetitive negotiation records.',
    rfoTransitionNote: 'Transition wording may shift, but the distinction between competitive decision documentation and negotiation memorandum discipline remains essential.',
    commonTrap: 'Using SSDD terminology to justify a sole-source pricing negotiation record.',
    scenarioTip: 'Ask first: “Competitive source selection or negotiation with one offeror?” before selecting documentation path.',
    citations: [
      { label: 'FAR Part 15', url: 'https://www.acquisition.gov/far/part-15' }
    ]
  },
  {
    key: 'source-selection-methods',
    title: 'Source Selection Methods (LPTA / Tradeoff / Highest Technically Rated Fair & Reasonable Price / Phased)',
    sessionSource: 'Session 3',
    topicArea: 'Select Source',
    appliesToParts: [15],
    rfoStatus: 'transition-note',
    action: 'keep_with_transition_note',
    coreExplanation: 'Method selection must align with acquisition objectives, evaluation factors, and defensible best-value reasoning.',
    whyItMatters: 'Session 3 outcome performance depends on selecting and documenting the correct method and resulting authority roles.',
    rfoTransitionNote: 'Current transition materials preserve source-selection fundamentals while using updated plain-language framing.',
    commonTrap: 'Treating tradeoff as universally better than LPTA regardless of requirement risk and discriminator value.',
    scenarioTip: 'Tie selected method to requirement risk and measurable value discriminators.',
    citations: [
      { label: 'FAR Part 15', url: 'https://www.acquisition.gov/far/part-15' },
      { label: 'FAR Overhaul Part 15', url: 'https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15' }
    ]
  },
  {
    key: 'protests-claims-adr',
    title: 'Protests / Claims / ADR',
    sessionSource: 'Session 3',
    topicArea: 'Manage Disagreements',
    appliesToParts: [33],
    rfoStatus: 'transition-note',
    action: 'keep_with_transition_note',
    coreExplanation: 'Separate protest process rules from claims/disputes process rules and apply timeline/document controls accordingly.',
    whyItMatters: 'Award-phase errors often come from mixing protest timelines with CDA claim handling.',
    rfoTransitionNote: 'Transition updates do not remove the need for strict procedural distinctions and timely documentation.',
    commonTrap: 'Treating every post-award monetary demand as a protest action.',
    scenarioTip: 'Identify forum and trigger first (GAO/agency protest vs claim/dispute) before choosing response path.',
    citations: [
      { label: 'FAR Part 33', url: 'https://www.acquisition.gov/far/part-33' }
    ]
  }
];

export const guidanceForPart = (part: number): TopicGuidance | null => {
  return TOPIC_GUIDANCE.find((item) => item.appliesToParts.includes(part)) ?? null;
};
