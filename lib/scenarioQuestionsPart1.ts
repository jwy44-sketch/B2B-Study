export type ScenarioQuestion = {
  id: string;
  questionNumber: number;
  topic: string;
  stem: string;
  choices: { id: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctChoiceId: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  sourceSet: 'con3990v-scenario-bank';
  batch: 'part-1' | 'part-2';
  difficulty?: 'easy' | 'medium' | 'hard';
};

export const scenarioQuestionsPart1: ScenarioQuestion[] = [
  {
    id: 'scenario-001',
    questionNumber: 1,
    topic: 'Plan Solicitation',
    stem: 'A base communications squadron needs rugged handheld radios for field maintainers within 60 days. The requiring activity wants a brand-name model because that is what the shop currently uses. During market research, you identify three commercially available alternatives that meet the same performance needs. What is the best contracting action?',
    choices: [
      { id: 'A', text: 'Keep the brand-name requirement because standardization is always sufficient justification.' },
      { id: 'B', text: 'Rewrite the requirement around performance and essential characteristics, then compete the buy.' },
      { id: 'C', text: 'Issue the solicitation as brand-name only and explain the alternatives in the file after award.' },
      { id: 'D', text: 'Treat the requirement as sole source because the requesting office prefers the current model.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Requirements should be described in terms of performance or essential characteristics and should not be unnecessarily restrictive when commercial alternatives can meet the need.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-002',
    questionNumber: 2,
    topic: 'Plan Solicitation',
    stem: "A program office asks you to begin acquisition planning for an upcoming service requirement 'once funding is final.' What is the best response?",
    choices: [
      { id: 'A', text: 'Wait until the funding document is signed because planning cannot begin earlier.' },
      { id: 'B', text: 'Begin acquisition planning as soon as the agency need is identified.' },
      { id: 'C', text: 'Start only after market research is complete and the solicitation is drafted.' },
      { id: 'D', text: 'Delay planning until legal reviews the eventual solicitation.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Acquisition planning begins as soon as the agency need is identified so strategy, funding, market research, and schedule can be aligned early.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-003',
    questionNumber: 3,
    topic: 'Plan Solicitation',
    stem: 'You are supporting a recurring janitorial services requirement. The team says no market research is needed because the same work was bought last year. Which response is best?',
    choices: [
      { id: 'A', text: 'Agree, because recurring requirements never require new market research.' },
      { id: 'B', text: 'Conduct market research appropriate to the circumstances because market research is continuous.' },
      { id: 'C', text: 'Skip market research unless the requirement exceeds the simplified acquisition threshold.' },
      { id: 'D', text: "Use last year's contract file as the only market research source and do nothing further." }
    ],
    correctChoiceId: 'B',
    explanation: 'Market research is a continuous process and should be appropriate to the circumstances, even for recurring requirements.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-004',
    questionNumber: 4,
    topic: 'Plan Solicitation',
    stem: 'A requiring activity submits a draft SOW that specifies exact staffing titles, years of experience, software tools, and internal workflow steps, even though the desired outcome is measurable. What is the best improvement?',
    choices: [
      { id: 'A', text: 'Keep the draft as written because more detail always reduces risk.' },
      { id: 'B', text: 'Convert the requirement to performance-based language focused on outcomes and measurable standards.' },
      { id: 'C', text: 'Issue the requirement as a labor-hour contract to avoid revising the SOW.' },
      { id: 'D', text: 'Move the detailed workflow instructions into Section M so evaluators can score them.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Performance-based acquisitions focus on required outcomes, standards, and surveillance, not unnecessarily prescriptive methods.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-005',
    questionNumber: 5,
    topic: 'Small Business',
    stem: 'The small business specialist asks whether a requirement for replacement generators can be divided into multiple reasonable lots to increase small business participation. Which answer best aligns with policy?',
    choices: [
      { id: 'A', text: 'Do not divide any requirement because consolidation is always preferred.' },
      { id: 'B', text: 'Consider dividing the acquisition into reasonably small lots when practical to encourage small business participation.' },
      { id: 'C', text: 'Divide the requirement only if the incumbent is a small business.' },
      { id: 'D', text: 'Divide the requirement only after award through modifications.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Contracting officers should consider structuring acquisitions in reasonably small lots when practical to encourage small business participation.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-006',
    questionNumber: 6,
    topic: 'Plan Solicitation',
    stem: "You are drafting a solicitation for a new IT help desk requirement. The requiring activity wants a 10-day response period because 'the work is simple.' Market research shows multiple small businesses need more time to assemble teaming arrangements. What is the best approach?",
    choices: [
      { id: 'A', text: 'Keep the 10-day period because shorter timelines always help the mission.' },
      { id: 'B', text: 'Set a realistic response period that still meets the requirement and encourages competition.' },
      { id: 'C', text: 'Allow only the incumbent extra time to respond because it already knows the work.' },
      { id: 'D', text: 'Release the solicitation with 10 days and fix any fairness concerns during discussions.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Realistic response periods help preserve competition and support small business participation to the extent consistent with actual requirements.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-007',
    questionNumber: 7,
    topic: 'Fiscal / Award Readiness',
    stem: 'A contracting officer is preparing to execute a funded contract action. Which two checks are most critical immediately before award?',
    choices: [
      { id: 'A', text: 'Verify funds are available and ensure the contract action complies with applicable requirements.' },
      { id: 'B', text: 'Confirm the contractor already ordered materials and ask the COR to approve the price.' },
      { id: 'C', text: "Obtain the vendor's invoice and schedule the kickoff meeting." },
      { id: 'D', text: 'Make sure the requiring activity prefers the selected source and the legal office has a draft closeout memo.' }
    ],
    correctChoiceId: 'A',
    explanation: 'Before award, the contracting officer must ensure funds are available and that the action complies with applicable requirements.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-008',
    questionNumber: 8,
    topic: 'Government Property',
    stem: "A requiring activity asks the Government to provide test equipment to a contractor because buying contractor-owned equipment would raise the price. What should the contracting officer do first?",
    choices: [
      { id: 'A', text: 'Provide the equipment because lower price is the only required determination.' },
      { id: 'B', text: "Determine whether providing Government property is in the Government's best interest after considering benefit, administration cost, and risk." },
      { id: 'C', text: 'Provide the equipment only if the contractor promises not to submit future REAs.' },
      { id: 'D', text: 'Deny the request automatically because Government property can never be furnished.' }
    ],
    correctChoiceId: 'B',
    explanation: "Government property should be furnished only when it is in the Government's best interest after considering benefits, administrative cost, and risk.",
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-009',
    questionNumber: 9,
    topic: 'Commercial',
    stem: 'Your market research shows an agency need can be met by commercial products with minor customization. The requiring activity still wants a custom Government-unique design. What is the best contracting approach?',
    choices: [
      { id: 'A', text: 'Default to custom design because agencies always control the requirement however they want.' },
      { id: 'B', text: 'Prefer the commercial solution if it can meet the agency need to the maximum extent practicable.' },
      { id: 'C', text: 'Avoid commercial products because they are harder to inspect and accept.' },
      { id: 'D', text: 'Use sealed bidding because commerciality makes source selection unnecessary.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The FAR expresses a preference for commercial products and services when they can meet agency needs to the maximum extent practicable.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-010',
    questionNumber: 10,
    topic: 'Market Research',
    stem: "A trainee says the two types of market research are 'simple' and 'complex.' Based on the absorbed course material, which answer is best?",
    choices: [
      { id: 'A', text: 'Correct, because market research depends only on dollar value.' },
      { id: 'B', text: 'Incorrect; the study material identifies strategic and tactical market research.' },
      { id: 'C', text: 'Incorrect; the only valid market research categories are pre-award and post-award.' },
      { id: 'D', text: 'Correct, because the FAR uses those exact terms.' }
    ],
    correctChoiceId: 'B',
    explanation: "The absorbed study materials describe strategic and tactical market research rather than 'simple' and 'complex.'",
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-011',
    questionNumber: 11,
    topic: 'Plan Solicitation',
    stem: "You are teaching a new specialist where 'Plan Solicitation' fits in the acquisition life cycle. Which answer is best aligned with the prep-course framing?",
    choices: [
      { id: 'A', text: 'It is a post-award function because it shapes performance monitoring.' },
      { id: 'B', text: 'It is a pre-award function tied to requirements determination, market research, and acquisition planning.' },
      { id: 'C', text: 'It belongs only to industry, not the Government.' },
      { id: 'D', text: 'It occurs only after competitive range is established.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The pre-award phase in the course materials emphasizes requirements determination, market research, acquisition planning, and request-offers activities.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-012',
    questionNumber: 12,
    topic: 'Describing Agency Needs',
    stem: 'A contracting team is debating whether to issue a brand-name-or-equal requirement or a brand-name-only requirement for ruggedized laptops. The file does not support a restrictive source justification, and multiple equivalent products exist. What is the best answer?',
    choices: [
      { id: 'A', text: 'Use a less restrictive requirement structure that allows equal products if they meet the essential characteristics.' },
      { id: 'B', text: 'Use brand-name-only because evaluators prefer familiar manufacturers.' },
      { id: 'C', text: 'Use sole source because the requiring activity already wrote the brand name into the draft.' },
      { id: 'D', text: 'Delay the procurement until only one manufacturer remains viable.' }
    ],
    correctChoiceId: 'A',
    explanation: 'Restrictive brand-name descriptions require support; otherwise the requirement should permit equal products based on salient or essential characteristics.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-013',
    questionNumber: 13,
    topic: 'Required Sources',
    stem: 'A buyer is eager to issue an RFQ immediately for office supplies under SAP. Before choosing the procurement method, what should the team check first?',
    choices: [
      { id: 'A', text: 'Whether mandatory sources of supply apply.' },
      { id: 'B', text: 'Whether the incumbent can lower its price.' },
      { id: 'C', text: 'Whether the requirement can be converted into a service contract.' },
      { id: 'D', text: 'Whether the COR already has a preferred vendor.' }
    ],
    correctChoiceId: 'A',
    explanation: 'Mandatory sources must be considered before choosing other procurement approaches.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-014',
    questionNumber: 14,
    topic: 'Market Research',
    stem: 'A contracting officer says market research only matters if the eventual acquisition uses FAR Part 12 commercial procedures. What is the best response?',
    choices: [
      { id: 'A', text: 'Correct, because market research exists only to support commercial item determinations.' },
      { id: 'B', text: 'Incorrect, because market research supports planning and requirement decisions even when the final acquisition is not purely commercial.' },
      { id: 'C', text: 'Correct, because noncommercial actions never need market research.' },
      { id: 'D', text: 'Incorrect, but only if the value exceeds the SAT.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Market research supports requirement development and planning regardless of whether the eventual solicitation uses Part 12 procedures.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-015',
    questionNumber: 15,
    topic: 'Small Business',
    stem: 'A program office insists on an aggressive delivery schedule that market research suggests only a few large businesses can meet. Which recommendation best supports policy?',
    choices: [
      { id: 'A', text: 'Keep the schedule because mission urgency always overrides competition concerns.' },
      { id: 'B', text: 'Set realistic delivery schedules that still meet the requirement while encouraging small business participation where possible.' },
      { id: 'C', text: 'Shorten the schedule further to screen out weak offerors.' },
      { id: 'D', text: 'Keep the schedule and promise to add small business subcontracting language after award.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Delivery schedules should be realistic and support small business participation to the extent consistent with actual requirements.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-016',
    questionNumber: 16,
    topic: 'Performance Based',
    stem: "A services requirement says the contractor shall 'provide excellent support with high quality service at all times.' There are no measurable standards or acceptable quality levels. What is the best fix?",
    choices: [
      { id: 'A', text: 'Leave it as-is because broad language gives the contractor flexibility.' },
      { id: 'B', text: 'Add measurable performance standards, outcomes, and surveillance metrics.' },
      { id: 'C', text: 'Convert the requirement to a supply contract.' },
      { id: 'D', text: 'Move the vague language into the contract clauses section.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Requirements should be measurable and tied to clear acceptance/performance standards rather than vague descriptions.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-017',
    questionNumber: 17,
    topic: 'RFO Transition',
    stem: 'A learner asks whether the RFO means the entire certification exam question bank is changing. Based on the absorbed FAQ, what is the best answer?',
    choices: [
      { id: 'A', text: 'Yes, almost every question is being replaced because the competency model changed completely.' },
      { id: 'B', text: 'No; about 30 percent of the bank is expected to be affected, while the core competencies remain largely the same.' },
      { id: 'C', text: 'Yes, and learners should stop studying the current core concepts.' },
      { id: 'D', text: 'No changes at all are expected.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The FAQ explains that approximately 30 percent of the bank will be affected, but core contracting competencies remain substantially the same.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-018',
    questionNumber: 18,
    topic: 'RFO Transition',
    stem: 'A student is worried that recent threshold updates have changed many exam answers. Based on the absorbed FAQ, what is the best response?',
    choices: [
      { id: 'A', text: 'Yes, threshold changes rewrite most existing answers.' },
      { id: 'B', text: 'No; the current exam questions and answers are not expected to be materially affected by those threshold updates as currently structured.' },
      { id: 'C', text: 'Yes, and every threshold question should be skipped until the new bank is released.' },
      { id: 'D', text: 'Only if the student is taking CON 3900V, not CON 3990V.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The FAQ states that recent threshold updates do not impact the questions or answers as currently structured.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-019',
    questionNumber: 19,
    topic: 'Describing Needs',
    stem: 'A requiring office wants to write a requirement so narrowly that only one internal favorite solution qualifies, even though several commercial alternatives can do the work. Which answer best fits Government policy on describing agency needs?',
    choices: [
      { id: 'A', text: 'State requirements in a way that promotes full and open competition and minimizes unnecessary restrictive provisions.' },
      { id: 'B', text: 'Restrict the requirement whenever the requiring office has a strong preference.' },
      { id: 'C', text: 'Use any specification style as long as the contract type is fixed-price.' },
      { id: 'D', text: 'Let the incumbent help write the mandatory brand-name justification.' }
    ],
    correctChoiceId: 'A',
    explanation: 'The Government should minimize restrictive provisions and describe needs by function, performance, and essential characteristics whenever possible.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-020',
    questionNumber: 20,
    topic: 'Lifecycle',
    stem: "A trainee says that 'pre-award' only describes Government activity and has nothing to do with industry. Based on the course framing, what is the best answer?",
    choices: [
      { id: 'A', text: 'Correct, because industry does not become relevant until after award.' },
      { id: 'B', text: 'Incorrect; pre-award includes Government planning and request-offers activity, while industry is simultaneously planning sales and preparing offers.' },
      { id: 'C', text: 'Correct, because offerors are not part of the acquisition team until after contract administration begins.' },
      { id: 'D', text: 'Incorrect, but only for construction contracts.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The course materials explicitly frame pre-award as involving both Government and industry activities, including buying-side and selling-side actions.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-021',
    questionNumber: 21,
    topic: 'Request Offers',
    stem: 'A source selection team wants to fix a minor clerical error in an otherwise strong proposal and still intends to award without discussions. What is the proper exchange approach?',
    choices: [
      { id: 'A', text: 'Open full discussions and request proposal revisions from all offerors.' },
      { id: 'B', text: 'Use clarifications limited to the minor clerical issue.' },
      { id: 'C', text: 'Establish the competitive range before communicating with anyone.' },
      { id: 'D', text: 'Issue evaluation notices because all exchanges are discussions.' }
    ],
    correctChoiceId: 'B',
    explanation: 'When award without discussions is contemplated, exchanges are limited to clarifications for minor or clerical matters.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-022',
    questionNumber: 22,
    topic: 'Request Offers',
    stem: 'The Government has evaluated proposals under FAR Part 15 and now wants to engage only the most highly rated offerors in further exchanges that may lead to proposal revisions. What comes first?',
    choices: [
      { id: 'A', text: 'Request final proposal revisions from all offerors immediately.' },
      { id: 'B', text: 'Establish the competitive range before conducting discussions.' },
      { id: 'C', text: 'Issue the source selection decision document.' },
      { id: 'D', text: 'Provide post-award debriefings to excluded offerors.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Under FAR Part 15 source selection, the competitive range is established before discussions are conducted.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-023',
    questionNumber: 23,
    topic: 'Source Selection',
    stem: 'A contracting officer asks an offeror to materially revise its staffing approach and pricing assumptions after receipt of proposals. The CO wants to call this a clarification. What is the best answer?',
    choices: [
      { id: 'A', text: 'That is fine, because any exchange before award is a clarification.' },
      { id: 'B', text: 'If the exchange allows or requires material proposal revision, it is a discussion, not a clarification.' },
      { id: 'C', text: 'It is automatically a communication, because clarifications and communications are the same thing.' },
      { id: 'D', text: 'It becomes a debriefing if the offeror is later eliminated.' }
    ],
    correctChoiceId: 'B',
    explanation: 'If the exchange allows or requires a material proposal revision, it is a discussion, not a clarification.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-024',
    questionNumber: 24,
    topic: 'Source Selection',
    stem: 'In a competitive FAR Part 15 acquisition, what is the most common basis for determining a price is fair and reasonable when you receive multiple independent offers?',
    choices: [
      { id: 'A', text: 'Adequate price competition.' },
      { id: 'B', text: 'Mandatory certified cost or pricing data from every offeror.' },
      { id: 'C', text: 'The personal judgment of the COR.' },
      { id: 'D', text: 'A unilateral pricing memorandum prepared after award.' }
    ],
    correctChoiceId: 'A',
    explanation: 'In competitive source selection, adequate price competition is a primary basis for fair and reasonable price determination.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-025',
    questionNumber: 25,
    topic: 'Negotiation',
    stem: "A sole-source acquisition team receives the contractor's proposal and wants to begin negotiating immediately because the deadline is tight. Which document should be prepared first?",
    choices: [
      { id: 'A', text: 'The Source Selection Decision Document.' },
      { id: 'B', text: 'The pre-negotiation objective or pre-negotiation memorandum.' },
      { id: 'C', text: 'The post-award orientation agenda.' },
      { id: 'D', text: 'A debriefing letter for unsuccessful offerors.' }
    ],
    correctChoiceId: 'B',
    explanation: 'In sole-source negotiation, the Government prepares a pre-negotiation objective/memorandum before entering negotiations.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-026',
    questionNumber: 26,
    topic: 'Negotiation',
    stem: 'You receive only one proposal under a sole-source RFP. Which statement best describes the fair-and-reasonable pricing approach?',
    choices: [
      { id: 'A', text: 'Adequate price competition exists because a proposal was received.' },
      { id: 'B', text: 'The Government will generally need cost and/or price analysis, and possibly technical analysis, because competition is absent.' },
      { id: 'C', text: 'Price reasonableness is established automatically by the J&A.' },
      { id: 'D', text: 'No analysis is needed if the contractor has worked for the Government before.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Sole-source negotiation requires cost and/or price analysis, and sometimes technical analysis, because adequate competition is absent.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-027',
    questionNumber: 27,
    topic: 'Source Selection',
    stem: 'The Government has not yet established a competitive range, but it wants to communicate with an offeror about adverse past performance information to determine whether the proposal should remain under consideration. What kind of exchange is this most likely?',
    choices: [
      { id: 'A', text: 'A debriefing.' },
      { id: 'B', text: 'A communication under FAR 15.306(b).' },
      { id: 'C', text: 'A post-award clarification.' },
      { id: 'D', text: 'A termination notice.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The study materials and FAR Part 15 distinguish clarifications from communications by timing and purpose.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-028',
    questionNumber: 28,
    topic: 'Request Offers',
    stem: 'An offeror is excluded from the competitive range. What is the most important immediate procedural point?',
    choices: [
      { id: 'A', text: 'The offeror remains eligible for award until post-award debriefing.' },
      { id: 'B', text: 'The offeror must be notified of exclusion, and debriefing timelines become important.' },
      { id: 'C', text: 'The CO must reopen the competition for all offerors.' },
      { id: 'D', text: 'The excluded offeror automatically receives the award if the selected source fails responsibility review.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Offerors excluded from the competitive range must receive notice, and debriefing timelines become important.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-029',
    questionNumber: 29,
    topic: 'Negotiation vs Source Selection',
    stem: 'A trainee mixes up sole-source negotiation records with competitive source selection records. Which answer best fixes the confusion?',
    choices: [
      { id: 'A', text: 'Both use the exact same documentation because Part 15 governs them both.' },
      { id: 'B', text: 'Competitive source selection uses source-selection documentation, while sole-source negotiation uses negotiation memoranda and pricing documentation.' },
      { id: 'C', text: 'Only competitive source selection requires documentation.' },
      { id: 'D', text: 'Only sole-source negotiation requires fair-and-reasonable price support.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Competitive source selections use source-selection documentation, while sole-source negotiations use negotiation memoranda and pricing support documents.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-030',
    questionNumber: 30,
    topic: 'Negotiation',
    stem: 'You receive one proposal in response to a competitive solicitation, but the acquisition was expected to be competitive. What is the best pricing conclusion at that point?',
    choices: [
      { id: 'A', text: 'Adequate price competition definitely exists because the solicitation was competed.' },
      { id: 'B', text: 'Adequate price competition does not automatically exist just because one proposal was received; further analysis is still required.' },
      { id: 'C', text: 'The Government must cancel the solicitation every time only one proposal is received.' },
      { id: 'D', text: "The contractor's initial proposed price is automatically fair and reasonable." }
    ],
    correctChoiceId: 'B',
    explanation: 'Receiving one proposal does not automatically create adequate price competition; the contracting officer must still analyze price reasonableness.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-031',
    questionNumber: 31,
    topic: 'Source Selection',
    stem: 'During discussions, an evaluator wants to tell Offeror A exactly how to rewrite its proposal to match the winning approach. What is the best response?',
    choices: [
      { id: 'A', text: 'Do it, because meaningful discussions require coaching offerors into awardable proposals.' },
      { id: 'B', text: "Do not coach or level proposals; discussions should identify deficiencies and significant weaknesses without disclosing another offeror's solution." },
      { id: 'C', text: 'Do it only if Offeror A is the incumbent.' },
      { id: 'D', text: 'Do it only after final proposal revisions are submitted.' }
    ],
    correctChoiceId: 'B',
    explanation: "Meaningful discussions identify deficiencies and significant weaknesses but must not coach, level, or disclose another offeror's solution.",
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'hard'
  },
  {
    id: 'scenario-032',
    questionNumber: 32,
    topic: 'Negotiation',
    stem: 'A sole-source acquisition exceeds the certified cost or pricing data threshold and no exception applies. What is the most accurate statement?',
    choices: [
      { id: 'A', text: 'Certified cost or pricing data are never allowed in sole-source acquisitions.' },
      { id: 'B', text: 'Certified cost or pricing data may be required because the threshold is exceeded and no exception applies.' },
      { id: 'C', text: 'The CO should rely only on prior year prices regardless of changes in scope.' },
      { id: 'D', text: 'A pre-negotiation objective is no longer required.' }
    ],
    correctChoiceId: 'B',
    explanation: 'In sole-source settings above the threshold with no exception, certified cost or pricing data may be required.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'hard'
  },
  {
    id: 'scenario-033',
    questionNumber: 33,
    topic: 'Source Selection',
    stem: 'In a competitive best-value tradeoff source selection, which document records the decision rationale of why one proposal represents the best value to the Government?',
    choices: [
      { id: 'A', text: 'The Source Selection Decision Document.' },
      { id: 'B', text: 'The Price Negotiation Memorandum.' },
      { id: 'C', text: 'The SF 30.' },
      { id: 'D', text: 'The CPARS report.' }
    ],
    correctChoiceId: 'A',
    explanation: 'The best value decision in a competitive source selection is documented in the Source Selection Decision Document.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-034',
    questionNumber: 34,
    topic: 'Source Selection',
    stem: 'A cost-reimbursement competitive acquisition is being evaluated. Why is probable cost or cost realism especially important here?',
    choices: [
      { id: 'A', text: 'Because the Government bears the cost risk and needs to estimate likely actual performance cost.' },
      { id: 'B', text: 'Because the winning contractor is allowed to revise its price after award without limit.' },
      { id: 'C', text: 'Because cost realism is required only for fixed-price contracts.' },
      { id: 'D', text: 'Because technical evaluation is not allowed on cost-reimbursement procurements.' }
    ],
    correctChoiceId: 'A',
    explanation: 'In competitive cost-reimbursement settings, cost realism/probable cost matters because the Government bears the cost risk.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'hard'
  },
  {
    id: 'scenario-035',
    questionNumber: 35,
    topic: 'Negotiation',
    stem: "A team member says 'fact finding' is the same thing as clarifications or discussions in source selection. Which answer best reflects the absorbed material?",
    choices: [
      { id: 'A', text: 'Correct, because all exchanges under Part 15 use identical terms.' },
      { id: 'B', text: 'Incorrect; fact finding is associated with sole-source negotiation context, while source selection uses specific exchange categories like clarifications, communications, and discussions.' },
      { id: 'C', text: 'Correct, but only after competitive range is established.' },
      { id: 'D', text: 'Incorrect, because fact finding is used only after award.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The course materials distinguish fact finding in sole-source negotiation from the structured exchange types used in competitive source selection.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'hard'
  },
  {
    id: 'scenario-036',
    questionNumber: 36,
    topic: 'Source Selection',
    stem: "An evaluator wants to give extra credit for a feature not listed anywhere in the solicitation because it is 'a really good idea.' What is the best answer?",
    choices: [
      { id: 'A', text: 'Do it if the feature seems useful to the mission.' },
      { id: 'B', text: 'Do not evaluate against unstated factors; proposals must be evaluated in accordance with the stated factors and subfactors in the solicitation.' },
      { id: 'C', text: 'Do it only if every offeror could theoretically have proposed it.' },
      { id: 'D', text: 'Do it only in LPTA acquisitions.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Competitive source selections must evaluate proposals in accordance with the factors and subfactors stated in the solicitation.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'hard'
  },
  {
    id: 'scenario-037',
    questionNumber: 37,
    topic: 'Request Offers',
    stem: 'The solicitation states that the Government intends to award with or without discussions. Which practical effect does that statement have on exchanges if the Government still hopes to avoid discussions?',
    choices: [
      { id: 'A', text: 'It allows unlimited proposal revisions at any time.' },
      { id: 'B', text: 'It limits pre-award exchanges to clarifications unless the Government later chooses to open discussions.' },
      { id: 'C', text: 'It eliminates the need for proposal evaluation.' },
      { id: 'D', text: 'It requires the Government to establish a competitive range immediately upon receipt.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The Government may state an intent to award with or without discussions, which drives the allowable exchange structure.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-038',
    questionNumber: 38,
    topic: 'Source Selection',
    stem: 'Under a competitive FAR Part 15 source selection, the Government wants offerors to submit revised proposals after addressing evaluated weaknesses. What is the proper sequence?',
    choices: [
      { id: 'A', text: 'Issue final proposal revisions first, then establish competitive range if needed.' },
      { id: 'B', text: 'Establish competitive range, conduct discussions, and then request final proposal revisions.' },
      { id: 'C', text: 'Issue post-award debriefings and then permit revised proposals.' },
      { id: 'D', text: 'Negotiate individually without documenting the exchange structure.' }
    ],
    correctChoiceId: 'B',
    explanation: 'If the Government wants proposal revisions under Part 15, it establishes the competitive range and then conducts discussions before requesting final proposal revisions.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'hard'
  },
  {
    id: 'scenario-039',
    questionNumber: 39,
    topic: 'Negotiation',
    stem: 'A DoD acquisition team is preparing profit analysis for a negotiated acquisition. Which document/tool is most associated with the structured DoD profit approach referenced in the absorbed materials?',
    choices: [
      { id: 'A', text: 'SF 1409' },
      { id: 'B', text: 'DD Form 1547' },
      { id: 'C', text: 'SF 44' },
      { id: 'D', text: 'DD Form 254' }
    ],
    correctChoiceId: 'B',
    explanation: 'DoD structured profit analysis commonly uses DD Form 1547.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'medium'
  },
  {
    id: 'scenario-040',
    questionNumber: 40,
    topic: 'Source Selection',
    stem: 'Offeror A is excluded from the competitive range before award. Offeror B remains in the competitive range, participates in discussions, submits a revised proposal, but is not selected. Which answer best reflects the absorbed debriefing logic?',
    choices: [
      { id: 'A', text: 'Neither offeror has any debriefing rights until contract closeout.' },
      { id: 'B', text: 'Debriefing timing and type differ depending on whether the offeror was excluded before award or remained in the competition through award decision.' },
      { id: 'C', text: 'Only Offeror A may request a debriefing.' },
      { id: 'D', text: 'Only Offeror B may request any form of debriefing.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The exchange aid highlights different debriefing timelines and options based on status in the process.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'hard'
  },
  {
    id: 'scenario-041',
    questionNumber: 41,
    topic: 'Forms',
    stem: 'You are issuing a solicitation for a commercial product acquisition exceeding the SAT. Which standard form is most appropriate?',
    choices: [
      { id: 'A', text: 'SF 1449' },
      { id: 'B', text: 'SF 33' },
      { id: 'C', text: 'SF 44' },
      { id: 'D', text: 'SF 1409' }
    ],
    correctChoiceId: 'A',
    explanation: 'SF 1449 is the standard form used for commercial item solicitations/contracts/orders above the SAT.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-042',
    questionNumber: 42,
    topic: 'Forms',
    stem: 'You need to amend a solicitation after release. Which form is typically used?',
    choices: [
      { id: 'A', text: 'SF 1449 only' },
      { id: 'B', text: 'SF 30' },
      { id: 'C', text: 'DD 1547' },
      { id: 'D', text: 'SF 26' }
    ],
    correctChoiceId: 'B',
    explanation: 'SF 30 is used to amend solicitations and modify contracts.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-043',
    questionNumber: 43,
    topic: 'Forms',
    stem: 'You are recording bids received in a sealed bidding environment. Which form is traditionally associated with the Abstract of Offers?',
    choices: [
      { id: 'A', text: 'SF 1409' },
      { id: 'B', text: 'SF 30' },
      { id: 'C', text: 'DD 254' },
      { id: 'D', text: 'SF 44' }
    ],
    correctChoiceId: 'A',
    explanation: 'SF 1409 is the Abstract of Offers used for recording bids.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-044',
    questionNumber: 44,
    topic: 'Forms',
    stem: 'Negotiations changed the terms that the contractor originally submitted. Which form is commonly used to award the negotiated contract when signatures of both parties on one document are appropriate?',
    choices: [
      { id: 'A', text: 'SF 26' },
      { id: 'B', text: 'SF 44' },
      { id: 'C', text: 'DD 1861' },
      { id: 'D', text: 'SF 30' }
    ],
    correctChoiceId: 'A',
    explanation: 'SF 26 is used to award negotiated contracts when signatures of both parties on a single document are appropriate.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-045',
    questionNumber: 45,
    topic: 'Forms',
    stem: 'A trainee says SF 1449 is only for purchases below the SAT. Which answer best fixes that misunderstanding?',
    choices: [
      { id: 'A', text: 'Correct, SF 1449 is prohibited above the SAT.' },
      { id: 'B', text: 'Incorrect; SF 1449 is required for certain commercial buys above the SAT and encouraged for some below it.' },
      { id: 'C', text: 'Incorrect, because SF 1449 is only for construction.' },
      { id: 'D', text: 'Correct, unless the acquisition is sealed bidding.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The study materials note SF 1449 is required for certain commercial buys above the SAT and encouraged below it.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-046',
    questionNumber: 46,
    topic: 'Forms',
    stem: 'You need to place an order under an indefinite-delivery contract and SF 1449 is not being used under SAP. Which form best fits the absorbed study material?',
    choices: [
      { id: 'A', text: 'DD Form 1155' },
      { id: 'B', text: 'SF 1409' },
      { id: 'C', text: 'DD Form 254' },
      { id: 'D', text: 'SF 26' }
    ],
    correctChoiceId: 'A',
    explanation: 'DD 1155 is used for placing orders under indefinite-delivery contracts or when SF 1449 is not used under SAP.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-047',
    questionNumber: 47,
    topic: 'UCF',
    stem: 'An evaluator asks where the solicitation should state the evaluation factors for award. In the UCF, where do they belong?',
    choices: [
      { id: 'A', text: 'Section M' },
      { id: 'B', text: 'Section L' },
      { id: 'C', text: 'Section H' },
      { id: 'D', text: 'Section I' }
    ],
    correctChoiceId: 'A',
    explanation: 'Section M contains evaluation factors for award.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-048',
    questionNumber: 48,
    topic: 'UCF',
    stem: 'Where should instructions, conditions, and notices to offerors be located in the UCF?',
    choices: [
      { id: 'A', text: 'Section M' },
      { id: 'B', text: 'Section H' },
      { id: 'C', text: 'Section L' },
      { id: 'D', text: 'Section B' }
    ],
    correctChoiceId: 'C',
    explanation: 'Section L contains instructions, conditions, and notices to offerors.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-049',
    questionNumber: 49,
    topic: 'UCF',
    stem: 'You need to place unusual negotiated requirements that do not fit elsewhere in the UCF. Which section is most appropriate?',
    choices: [
      { id: 'A', text: 'Section H' },
      { id: 'B', text: 'Section J' },
      { id: 'C', text: 'Section M' },
      { id: 'D', text: 'Section A' }
    ],
    correctChoiceId: 'A',
    explanation: 'Section H is used for special contract requirements.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  },
  {
    id: 'scenario-050',
    questionNumber: 50,
    topic: 'UCF',
    stem: 'A trainee is confused about where contract clauses go in the UCF and whether they should be printed in full text. Which answer is best?',
    choices: [
      { id: 'A', text: 'Section I contains contract clauses, which should be incorporated by reference to the maximum extent practicable.' },
      { id: 'B', text: 'Section L contains contract clauses, and they must always appear in full text.' },
      { id: 'C', text: 'Section M contains contract clauses, but only for negotiated acquisitions.' },
      { id: 'D', text: 'Section J contains contract clauses because they are attachments.' }
    ],
    correctChoiceId: 'A',
    explanation: 'Section I contains contract clauses, which are incorporated by reference to the maximum extent practicable.',
    sourceSet: 'con3990v-scenario-bank',
    batch: 'part-1',
    difficulty: 'easy'
  }
];
