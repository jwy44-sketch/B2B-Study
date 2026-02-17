import { inferFarDetail, type FarRef } from './farReferences';

export type ExplanationBlock = {
  farRefs: {
    part: { cite: string; title: string; url: string };
    subpart?: { cite: string; title: string; url: string };
    sections: Array<{ cite: string; title: string; url: string }>;
  };
  decisionSteps: string[];
  whyCorrect: string;
  whyOthersWrong: Array<{ choiceIndex: number; reason: string }>;
  practicalTip: string;
};

type BuildExplanationInput = {
  questionId?: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number | null;
  farRef: FarRef;
};

const block = (
  part: { cite: string; title: string; url: string },
  sections: Array<{ cite: string; title: string; url: string }>,
  values: Omit<ExplanationBlock, 'farRefs'>,
  subpart?: { cite: string; title: string; url: string }
): ExplanationBlock => ({
  farRefs: { part, subpart, sections },
  ...values
});

const DAU_EXPLANATIONS: Record<string, ExplanationBlock> = {
  'con3910-151': block(
    { cite: 'FAR Part 13', title: 'Simplified Acquisition Procedures', url: 'https://www.acquisition.gov/far/part-13' },
    [
      { cite: '13.104', title: 'Promoting competition', url: 'https://www.acquisition.gov/far/13.104' },
      { cite: '13.106-1', title: 'Soliciting competition', url: 'https://www.acquisition.gov/far/13.106-1' }
    ],
    {
      decisionSteps: [
        'Check dollar value first: $240,000 is within the simplified acquisition threshold range for SAP handling in this training context.',
        'Use market research results showing multiple capable commercial furniture vendors.',
        'Choose the method that still seeks quotes from more than one source.'
      ],
      whyCorrect: 'Option B fits the facts: the requirement is commercial furniture, the value is $240,000, and multiple sources are available. FAR 13 emphasizes streamlined procedures while still obtaining competition, so soliciting multiple vendors under SAP is the strongest path.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'A sole-source path requires justification beyond “time is limited”; the scenario already says multiple capable vendors exist.' },
        { choiceIndex: 2, reason: 'Cost-reimbursement is mismatched to this straightforward furniture buy; it adds complexity with no benefit shown in the scenario.' },
        { choiceIndex: 3, reason: 'Being under $250,000 does not remove the expectation to solicit competition where practicable.' }
      ],
      practicalTip: 'Put your market research summary and vendor outreach list in the file before requesting quotes.'
    }
  ),
  'con3910-152': block(
    { cite: 'FAR Part 6', title: 'Competition Requirements', url: 'https://www.acquisition.gov/far/part-6' },
    [
      { cite: '6.302-2', title: 'Unusual and compelling urgency', url: 'https://www.acquisition.gov/far/6.302-2' },
      { cite: '6.303', title: 'Justifications', url: 'https://www.acquisition.gov/far/6.303' }
    ],
    {
      decisionSteps: [
        'Identify whether urgency is real but also whether more than one source can perform.',
        'If several capable sources exist, shape a fast competition rather than defaulting to one vendor.',
        'Document urgency and any shortened timelines in the contract file.'
      ],
      whyCorrect: 'Option B is best because it balances mission urgency with competition. The scenario explicitly says several capable sources are known, so a shortened but fair competition is the right contracting response.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Urgency does not erase competition rules by itself; you still justify and document the path you take.' },
        { choiceIndex: 2, reason: 'Automatically pivoting to an 8(a) sole source without threshold and program checks is unsupported by these facts.' },
        { choiceIndex: 3, reason: 'Incumbent preference alone is not a legal basis for bypassing available competition.' }
      ],
      practicalTip: 'When compressing response times, capture the mission deadline and market findings in the same memo.'
    }
  ),
  'con3910-153': block(
    { cite: 'FAR Part 43', title: 'Contract Modifications', url: 'https://www.acquisition.gov/far/part-43' },
    [{ cite: '43.103', title: 'Types of contract modifications', url: 'https://www.acquisition.gov/far/43.103' }],
    {
      decisionSteps: [
        'Ask whether the requested change alters contractual scope, price, or delivery expectations.',
        'If both scope and price increase, use an instrument signed by both parties.',
        'Document consideration, funding, and schedule impact before execution.'
      ],
      whyCorrect: 'Option B is correct because the contractor asked for an added deliverable that changes scope and price after award. That is a bilateral modification situation requiring agreement from both parties and documented terms.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Contracts can be changed post-award when properly justified and documented; blanket refusal is incorrect.' },
        { choiceIndex: 2, reason: 'Verbal direction invites unauthorized work and disputes over payment and scope.' },
        { choiceIndex: 3, reason: 'Issuing unilateral direction for added priced scope without funds creates a legal and fiscal problem.' }
      ],
      practicalTip: 'Write the mod narrative so a reviewer can see exactly what changed, why, and how much it costs.'
    }
  ),
  'con3910-154': block(
    { cite: 'FAR Part 6', title: 'Competition Requirements', url: 'https://www.acquisition.gov/far/part-6' },
    [
      { cite: '6.302-1', title: 'Only one responsible source', url: 'https://www.acquisition.gov/far/6.302-1' },
      { cite: '6.303', title: 'Justifications', url: 'https://www.acquisition.gov/far/6.303' }
    ],
    {
      decisionSteps: [
        'Validate proprietary/compatibility constraints through documented market research.',
        'Determine whether those constraints actually leave one responsible source.',
        'Prepare the required justification package rather than running a performative competition.'
      ],
      whyCorrect: 'Option C is right because the facts state compatibility is limited to a specific proprietary system and only one responsible source appears available. In that case, the contract file needs a sole-source justification backed by research evidence.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'IFB is not a shortcut for sole-source conditions; it would not solve the one-source reality.' },
        { choiceIndex: 1, reason: 'Running a full competition just to prove there is one source wastes time and can distort the requirement.' },
        { choiceIndex: 3, reason: 'Adding unrelated work to an existing contract is not a substitute for proper source-justification analysis.' }
      ],
      practicalTip: 'Include brand compatibility evidence (technical memo or OEM data) with your market research attachment.'
    }
  ),
  'con3910-155': block(
    { cite: 'FAR Part 17', title: 'Special Contracting Methods', url: 'https://www.acquisition.gov/far/part-17' },
    [{ cite: '17.207', title: 'Exercise of options', url: 'https://www.acquisition.gov/far/17.207' }],
    {
      decisionSteps: [
        'Confirm the option clause is in the contract and funding is available.',
        'Assess whether exercising remains the best method versus alternatives.',
        'Verify the option price remains fair and reasonable before signature.'
      ],
      whyCorrect: 'Option C captures the required determination before exercising an option year. Presence of a clause alone is not enough; the CO must still document best interest and price reasonableness.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Options are not automatic; CO judgment and documentation are required each time.' },
        { choiceIndex: 1, reason: 'Funding is necessary but not sufficient; best-interest and fair-price checks are still required.' },
        { choiceIndex: 3, reason: 'Mandatory annual recompete ignores the contract’s lawful option mechanism.' }
      ],
      practicalTip: 'Prepare an option exercise memo that addresses price, need continuity, and funding in one place.'
    }
  ),
  'con3910-156': block(
    { cite: 'FAR Part 16', title: 'Types of Contracts', url: 'https://www.acquisition.gov/far/part-16' },
    [{ cite: '16.601', title: 'Time-and-materials contracts', url: 'https://www.acquisition.gov/far/16.601' }],
    {
      decisionSteps: [
        'Judge whether labor hours and exact tasks can be estimated reliably at award.',
        'If scope is evolving and hours are uncertain, consider T&M with controls.',
        'Document why fixed-price certainty is not currently achievable.'
      ],
      whyCorrect: 'Option B is the best fit for uncertain labor-hour demand and evolving scope. T&M can be used with proper justification and oversight when accurate upfront pricing is not realistic.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'FFP assumes stable, definable work; that conflicts with the stated uncertainty.' },
        { choiceIndex: 2, reason: 'Sealed bidding is a source-selection method, not the contract type answer to labor uncertainty.' },
        { choiceIndex: 3, reason: 'A basic ordering agreement is not a complete contract vehicle for undefined work with no ceiling.' }
      ],
      practicalTip: 'Set surveillance checkpoints early when using T&M so labor burn rates stay visible.'
    }
  ),
  'con3910-157': block(
    { cite: 'FAR Part 1', title: 'Federal Acquisition Regulations System', url: 'https://www.acquisition.gov/far/part-1' },
    [{ cite: '1.602-2', title: 'Responsibilities', url: 'https://www.acquisition.gov/far/1.602-2' }],
    {
      decisionSteps: [
        'Separate technical oversight duties from contractual authority.',
        'When performance issues arise, route potential scope or direction changes to the CO.',
        'Use documented communication rather than field direction that changes contract work.'
      ],
      whyCorrect: 'Option B is correct because the COR identified a performance issue but does not hold authority to order new work. The right action is to notify the CO and document facts so any contract change proceeds under proper modification authority (Part 43).',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Directing extra work without CO authority can create unauthorized commitments.' },
        { choiceIndex: 2, reason: 'CORs monitor and report; they do not execute contractual modifications.' },
        { choiceIndex: 3, reason: 'Payment withholding actions require contract and CO process, not unilateral COR decisions.' }
      ],
      practicalTip: 'Use a dated COR memo to the CO that identifies issue, contract paragraph, and requested CO decision.'
    }
  ),
  'con3910-158': block(
    { cite: 'FAR Part 15', title: 'Contracting by Negotiation', url: 'https://www.acquisition.gov/far/part-15' },
    [{ cite: '15.000', title: 'Scope of part', url: 'https://www.acquisition.gov/far/15.000' }],
    {
      decisionSteps: [
        'Identify whether evaluation includes non-price factors like technical approach and past performance.',
        'If yes and above SAT, follow negotiated procurement structure.',
        'Align solicitation/evaluation process with Part 15 source-selection mechanics.'
      ],
      whyCorrect: 'Option C is correct because the plan uses technical and past-performance evaluation, not low-price-only award. That is the hallmark of negotiated procurement under FAR Part 15.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Part 12 covers commercial-item policies but does not replace Part 15 source-selection procedures when tradeoffs are used.' },
        { choiceIndex: 1, reason: 'Part 13 is for simplified acquisitions and does not fit this described process over SAT.' },
        { choiceIndex: 3, reason: 'Part 18 addresses emergency flexibilities, not baseline negotiated source selection.' }
      ],
      practicalTip: 'Draft evaluation factors first, then ensure every source-selection step traces back to those factors.'
    }
  ),
  'con3910-159': block(
    { cite: 'FAR Part 33', title: 'Protests, Disputes, and Appeals', url: 'https://www.acquisition.gov/far/part-33' },
    [{ cite: '33.104', title: 'Protests to GAO', url: 'https://www.acquisition.gov/far/33.104' }],
    {
      decisionSteps: [
        'Recognize GAO protest filing as a time-sensitive procedural event.',
        'Coordinate legal and contracting actions immediately under protest procedures.',
        'Apply stay/override decisions using documented agency process.'
      ],
      whyCorrect: 'Option C is correct because a GAO protest alleging unequal treatment triggers defined procedural actions. The CO must follow protest timelines and coordination steps rather than improvising an ad hoc response.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Waiting passively risks missed deadlines and procedural error.' },
        { choiceIndex: 1, reason: 'Immediate termination is not the automatic response to every GAO filing.' },
        { choiceIndex: 3, reason: 'Paying proposal costs to end the issue is not a standard unilateral protest resolution path.' }
      ],
      practicalTip: 'Open a protest action tracker the same day the filing notice arrives.'
    }
  ),
  'con3910-160': block(
    { cite: 'FAR Part 12', title: 'Acquisition of Commercial Products and Commercial Services', url: 'https://www.acquisition.gov/far/part-12' },
    [{ cite: '12.102', title: 'Applicability', url: 'https://www.acquisition.gov/far/12.102' }],
    {
      decisionSteps: [
        'Identify mixed content: commercial software plus installation/training services.',
        'Determine the predominant purpose of the total requirement.',
        'Choose acquisition approach based on that dominant purpose rather than forcing a split by default.'
      ],
      whyCorrect: 'Option B is correct because mixed supply/service packages should be analyzed by predominant purpose. Here, the right path is to evaluate what drives the requirement and then apply the most suitable framework.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Mandatory split contracts are not required simply because supplies and services are both present.' },
        { choiceIndex: 2, reason: 'Automatically applying Part 12 without considering service scope can misclassify the buy.' },
        { choiceIndex: 3, reason: 'Process simplicity alone is not the legal basis for choosing simplified acquisition.' }
      ],
      practicalTip: 'Capture your predominant-purpose decision in the acquisition plan to support later reviews.'
    }
  ),
  'con3910-161': block(
    { cite: 'FAR Part 10', title: 'Market Research', url: 'https://www.acquisition.gov/far/part-10' },
    [
      { cite: '10.001', title: 'Policy', url: 'https://www.acquisition.gov/far/10.001' },
      { cite: '10.002', title: 'Procedures', url: 'https://www.acquisition.gov/far/10.002' }
    ],
    {
      decisionSteps: [
        'Start by understanding available solutions and sources in the marketplace.',
        'Use findings to shape strategy, contract type, and competition approach.',
        'Document conclusions before locking acquisition decisions.'
      ],
      whyCorrect: 'Option B is correct because the first move before acquisition strategy decisions is to conduct and document market research. That evidence supports source, method, and contract-structure decisions.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Drafting a J&A first assumes a sole-source outcome before validating the market.' },
        { choiceIndex: 2, reason: 'Choosing contract type by preference ignores the need for evidence-based planning.' },
        { choiceIndex: 3, reason: 'Selecting the incumbent before market review undermines fair competition analysis.' }
      ],
      practicalTip: 'Summarize research in a memo with vendor landscape, pricing signals, and recommended strategy.'
    }
  ),
  'con3910-162': block(
    { cite: 'FAR Part 13', title: 'Simplified Acquisition Procedures', url: 'https://www.acquisition.gov/far/part-13' },
    [{ cite: '13.104', title: 'Promoting competition', url: 'https://www.acquisition.gov/far/13.104' }],
    {
      decisionSteps: [
        'Confirm action is under SAT and eligible for SAP techniques.',
        'Preserve streamlined handling while still seeking competition where practical.',
        'Document how sources were solicited.'
      ],
      whyCorrect: 'Option B is correct because FAR Part 13 still expects competition to the maximum extent practicable. SAP streamlines process; it does not authorize incumbent-only behavior by default.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'SAT does not equal competition waiver.' },
        { choiceIndex: 2, reason: 'Incumbent-only solicitation contradicts the competition expectation in the prompt.' },
        { choiceIndex: 3, reason: 'Sealed bidding is not the baseline requirement for SAP actions.' }
      ],
      practicalTip: 'Track who was solicited and why in one concise acquisition note.'
    }
  ),
  'con3910-163': block(
    { cite: 'FAR Part 15', title: 'Contracting by Negotiation', url: 'https://www.acquisition.gov/far/part-15' },
    [{ cite: '15.101-1', title: 'Tradeoff process', url: 'https://www.acquisition.gov/far/15.101-1' }],
    {
      decisionSteps: [
        'Check whether solicitation allows best-value tradeoff.',
        'Compare non-price value against price premium explicitly.',
        'Document why paying more produces measurable benefit.'
      ],
      whyCorrect: 'Option B is right because tradeoff permits selecting a higher-priced offer when technical or past-performance gains are worth the added cost. The decision must be reasoned and documented, not preference-based.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'CO personal preference is never a valid evaluation rationale.' },
        { choiceIndex: 2, reason: 'Small-business status alone does not justify bypassing stated tradeoff logic.' },
        { choiceIndex: 3, reason: 'If tradeoffs were not announced, they cannot be introduced post hoc.' }
      ],
      practicalTip: 'In your SSDD, tie each premium dollar to a stated evaluated benefit.'
    }
  ),
  'con3910-164': block(
    { cite: 'FAR Part 16', title: 'Types of Contracts', url: 'https://www.acquisition.gov/far/part-16' },
    [{ cite: '16.103', title: 'Negotiating contract type', url: 'https://www.acquisition.gov/far/16.103' }],
    {
      decisionSteps: [
        'Assess technical stability and cost risk first.',
        'When risk is low and requirements are stable, favor fixed-price discipline.',
        'Reject contract-type decisions based solely on one party’s convenience.'
      ],
      whyCorrect: 'Option B is correct because stable requirements and low performance risk support a fixed-price posture. Cost-reimbursement should not be selected merely to shift risk to the Government when definition is already strong.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Cost reimbursement is not automatically safer; it demands stronger oversight and can weaken cost certainty.' },
        { choiceIndex: 2, reason: 'T&M is not a shortcut when requirement definition is already adequate for fixed pricing.' },
        { choiceIndex: 3, reason: 'Awarding without contract-type determination violates basic planning discipline.' }
      ],
      practicalTip: 'Record requirement maturity indicators to justify your contract-type choice.'
    }
  ),
  'con3910-165': block(
    { cite: 'FAR Part 6', title: 'Competition Requirements', url: 'https://www.acquisition.gov/far/part-6' },
    [{ cite: '6.101', title: 'Policy', url: 'https://www.acquisition.gov/far/6.101' }],
    {
      decisionSteps: [
        'Separate user preference from mission-based technical necessity.',
        'If a brand restriction is needed, support it with documented rationale.',
        'Otherwise allow equal products to preserve competition.'
      ],
      whyCorrect: 'Option B is correct because “user likes it” is not enough to close competition. A brand-name limitation must be tied to objective need, or the solicitation should permit equals.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Undocumented brand restriction can improperly exclude capable vendors.' },
        { choiceIndex: 2, reason: 'Skipping market research removes the evidence needed to justify any restriction.' },
        { choiceIndex: 3, reason: 'Preference alone cannot support a sole-source justification.' }
      ],
      practicalTip: 'If the team asks for a brand, require a written technical rationale before drafting the solicitation.'
    }
  ),
  'con3910-166': block(
    { cite: 'FAR Part 12', title: 'Acquisition of Commercial Products and Commercial Services', url: 'https://www.acquisition.gov/far/part-12' },
    [{ cite: '12.102', title: 'Applicability', url: 'https://www.acquisition.gov/far/12.102' }],
    {
      decisionSteps: [
        'Confirm through market research that services are offered commercially.',
        'Use commercial-item procedures and terms appropriate to those services.',
        'Apply noncommercial methods only if facts require them.'
      ],
      whyCorrect: 'Option A is correct because the scenario confirms competitively available commercial services. FAR Part 12 is designed for this situation and supports terms aligned with commercial practice.',
      whyOthersWrong: [
        { choiceIndex: 1, reason: 'Sealed bidding is not automatically the best vehicle for service-based commercial acquisitions.' },
        { choiceIndex: 2, reason: 'Cost-reimbursement is not the default for commercial services.' },
        { choiceIndex: 3, reason: 'Part 13 applicability depends on thresholds; it cannot be forced regardless of dollar value.' }
      ],
      practicalTip: 'Map each nonstandard clause request against Part 12 to avoid over-customizing commercial buys.'
    }
  ),
  'con3910-167': block(
    { cite: 'FAR Part 15', title: 'Contracting by Negotiation', url: 'https://www.acquisition.gov/far/part-15' },
    [{ cite: '15.206', title: 'Amending the solicitation', url: 'https://www.acquisition.gov/far/15.206' }],
    {
      decisionSteps: [
        'Recognize evaluation factors are binding once proposals are received.',
        'If factors must change, amend the solicitation formally.',
        'Give offerors a fair chance to revise responses to the amendment.'
      ],
      whyCorrect: 'Option B is correct because changing factors after receipt without amendment breaks fairness and transparency. The proper fix is a solicitation amendment with response opportunity.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Quiet changes undermine equal treatment and are protest-prone.' },
        { choiceIndex: 2, reason: 'Ignoring the issue leaves an invalid evaluation framework in place.' },
        { choiceIndex: 3, reason: 'Providing selective notice to one offeror is unequal treatment.' }
      ],
      practicalTip: 'When amendment is needed, update the source selection plan and schedule in parallel.'
    }
  ),
  'con3910-168': block(
    { cite: 'FAR Part 43', title: 'Contract Modifications', url: 'https://www.acquisition.gov/far/part-43' },
    [{ cite: '43.103', title: 'Types of contract modifications', url: 'https://www.acquisition.gov/far/43.103' }],
    {
      decisionSteps: [
        'Run a scope analysis before deciding to modify an existing contract.',
        'If requested work is outside original scope, plan a separate acquisition action.',
        'Avoid field direction that bypasses competition and funding controls.'
      ],
      whyCorrect: 'Option B is correct because the program office request is explicitly outside scope. Out-of-scope work should not be appended for convenience; it should follow a proper new action pathway.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Adding out-of-scope work by modification risks protest and contractual invalidity.' },
        { choiceIndex: 2, reason: 'COR direction cannot substitute for CO contractual authority.' },
        { choiceIndex: 3, reason: 'Adding scope without funding is both contractual and fiscal noncompliance.' }
      ],
      practicalTip: 'Keep a one-page scope comparison (original PWS vs requested work) in the file.'
    }
  ),
  'con3910-169': block(
    { cite: 'FAR Part 6', title: 'Competition Requirements', url: 'https://www.acquisition.gov/far/part-6' },
    [{ cite: '6.302-2', title: 'Unusual and compelling urgency', url: 'https://www.acquisition.gov/far/6.302-2' }],
    {
      decisionSteps: [
        'Confirm urgency does not equal sole source when multiple vendors can perform.',
        'Use a compressed solicitation timeline to preserve speed and fairness.',
        'Document the urgency basis and timeline decisions.'
      ],
      whyCorrect: 'Option B is correct because it keeps competition while moving quickly. The scenario says urgency exists but does not state one-source capability, so a documented accelerated competition is appropriate.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Oral-only solicitations with no record create documentation and protest risk.' },
        { choiceIndex: 2, reason: 'First-email award is not a defensible source-selection method.' },
        { choiceIndex: 3, reason: 'A blanket “never synopsis” posture is not justified by the stated facts.' }
      ],
      practicalTip: 'Note exact response window and urgency rationale in the solicitation file memo.'
    }
  ),
  'con3910-170': block(
    { cite: 'FAR Part 33', title: 'Protests, Disputes, and Appeals', url: 'https://www.acquisition.gov/far/part-33' },
    [{ cite: '33.104', title: 'Protests to GAO', url: 'https://www.acquisition.gov/far/33.104' }],
    {
      decisionSteps: [
        'Treat protest filing as a controlled process event, not a discretionary pause.',
        'Coordinate legal review on stay and override issues immediately.',
        'Execute required actions on documented timelines.'
      ],
      whyCorrect: 'Option B is correct because protest filings can trigger stay/override decisions that require legal and CO coordination. The team cannot simply proceed as if no protest exists.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Ignoring stay rules can invalidate performance actions taken during protest windows.' },
        { choiceIndex: 2, reason: 'Same-day terminate/re-award is not a standard compliant protest response.' },
        { choiceIndex: 3, reason: 'Refusing GAO communication worsens process risk and agency position.' }
      ],
      practicalTip: 'Create a protest chronology with filing date, stay trigger date, and decision milestones.'
    }
  ),
  'con3910-171': block(
    { cite: 'FAR Part 10', title: 'Market Research', url: 'https://www.acquisition.gov/far/part-10' },
    [{ cite: '10.002', title: 'Procedures', url: 'https://www.acquisition.gov/far/10.002' }],
    {
      decisionSteps: [
        'Capture what sources, products, and terms were researched.',
        'Summarize how findings affect competition and contract strategy.',
        'File a written record to support later review.'
      ],
      whyCorrect: 'Option B is correct because a market research report or memo is the practical artifact that supports acquisition decisions. It connects research inputs to strategy outputs in the contract file.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Oral notes only are not durable support for acquisition decisions.' },
        { choiceIndex: 2, reason: 'A modification log tracks contract changes, not market research results.' },
        { choiceIndex: 3, reason: 'A protest letter is unrelated to documenting market capability analysis.' }
      ],
      practicalTip: 'Use a consistent memo template: requirement, sources contacted, findings, and recommended strategy.'
    }
  ),
  'con3910-172': block(
    { cite: 'FAR Part 13', title: 'Simplified Acquisition Procedures', url: 'https://www.acquisition.gov/far/part-13' },
    [{ cite: '13.106-1', title: 'Soliciting competition', url: 'https://www.acquisition.gov/far/13.106-1' }],
    {
      decisionSteps: [
        'Review vendor complaint against your solicitation record.',
        'Confirm whether sources were identified and treated fairly to the practical extent.',
        'Document rationale for source selection/outreach decisions.'
      ],
      whyCorrect: 'Option B is correct because the right response is documentation and fair-opportunity discipline within SAP flexibility. You should be able to explain who was solicited and why.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Incumbent-only buying statements signal unfair competition practice.' },
        { choiceIndex: 2, reason: '“No need to document” is the opposite of sound file practice under scrutiny.' },
        { choiceIndex: 3, reason: 'New vendors can be solicited; refusing that categorically is unsupported.' }
      ],
      practicalTip: 'Maintain a reusable source list log so vendor inclusion decisions are transparent.'
    }
  ),
  'con3910-173': block(
    { cite: 'FAR Part 15', title: 'Contracting by Negotiation', url: 'https://www.acquisition.gov/far/part-15' },
    [{ cite: '15.306', title: 'Exchanges with offerors after receipt of proposals', url: 'https://www.acquisition.gov/far/15.306' }],
    {
      decisionSteps: [
        'Conduct discussions to address deficiencies and allow meaningful proposal improvement.',
        'Protect proprietary information at all times.',
        'Apply the same fairness standard across all offerors in the competitive range.'
      ],
      whyCorrect: 'Option B is correct because discussions are meant to be meaningful and equitable. The CO must manage exchanges without exposing competitor proprietary details.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Sharing one offeror’s proprietary data with another is prohibited and undermines integrity.' },
        { choiceIndex: 2, reason: 'Negotiating only with low price ignores stated evaluation framework and fairness obligations.' },
        { choiceIndex: 3, reason: 'Undocumented discussions create major defensibility issues in protest or review.' }
      ],
      practicalTip: 'Use discussion question logs by offeror to prove parallel and fair treatment.'
    }
  ),
  'con3910-174': block(
    { cite: 'FAR Part 16', title: 'Types of Contracts', url: 'https://www.acquisition.gov/far/part-16' },
    [{ cite: '16.103', title: 'Negotiating contract type', url: 'https://www.acquisition.gov/far/16.103' }],
    {
      decisionSteps: [
        'Test whether requirements are defined enough for dependable fixed-price estimation.',
        'If not, either improve requirement definition or choose a type aligned to uncertainty.',
        'Tie contract type to risk allocation, not wishful pricing.'
      ],
      whyCorrect: 'Option B is correct because forcing FFP with poorly defined requirements usually produces performance and pricing disputes. The CO should improve requirement clarity or adopt a type matching uncertainty.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: '“Hope for the best” is not a contract-type rationale.' },
        { choiceIndex: 2, reason: 'Cost type with no oversight ignores the stronger surveillance burden those contracts require.' },
        { choiceIndex: 3, reason: 'Awarding before deciding contract type skips a foundational acquisition decision.' }
      ],
      practicalTip: 'If you must pivot contract type, document the requirement gaps driving that decision.'
    }
  ),
  'con3910-175': block(
    { cite: 'FAR Part 12', title: 'Acquisition of Commercial Products and Commercial Services', url: 'https://www.acquisition.gov/far/part-12' },
    [{ cite: '12.301', title: 'Solicitation provisions and contract clauses for acquisition of commercial products and commercial services', url: 'https://www.acquisition.gov/far/12.301' }],
    {
      decisionSteps: [
        'Start from customary commercial practice for terms and conditions.',
        'Add Government-unique terms only when necessary and justified.',
        'Keep solicitation language aligned with commercial-item policy.'
      ],
      whyCorrect: 'Option A is correct because commercial-service buys should rely on customary commercial terms where appropriate. Over-customization can reduce competition and misalign with commercial acquisition intent.',
      whyOthersWrong: [
        { choiceIndex: 1, reason: 'CAS requirements are not universally imposed for every commercial service action.' },
        { choiceIndex: 2, reason: 'Sealed bidding format is not the defining feature of Part 12 commercial buys.' },
        { choiceIndex: 3, reason: 'T&M is not a universal answer for commercial services; contract type still depends on risk and definition.' }
      ],
      practicalTip: 'Before adding a unique clause, ask whether a commercial supplier would reasonably accept it.'
    }
  ),
  'con3910-176': block(
    { cite: 'FAR Part 43', title: 'Contract Modifications', url: 'https://www.acquisition.gov/far/part-43' },
    [{ cite: '43.103', title: 'Types of contract modifications', url: 'https://www.acquisition.gov/far/43.103' }],
    {
      decisionSteps: [
        'Define exactly what scope element is changing.',
        'Capture negotiated price, schedule effects, and consideration in writing.',
        'Obtain bilateral signatures for the agreed modification terms.'
      ],
      whyCorrect: 'Option B is correct because a bilateral mod must clearly document scope, price, schedule impacts, and consideration. That record prevents disputes over what each party agreed to provide.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Signatures without clear terms leave the modification ambiguous and risky.' },
        { choiceIndex: 2, reason: 'COR signature is not a substitute for contractor and CO bilateral execution.' },
        { choiceIndex: 3, reason: 'Verbal agreement alone is insufficient for binding contractual change.' }
      ],
      practicalTip: 'Use a change matrix table in the mod to compare old requirement versus new requirement line by line.'
    }
  ),
  'con3910-177': block(
    { cite: 'FAR Part 10', title: 'Market Research', url: 'https://www.acquisition.gov/far/part-10' },
    [{ cite: '10.002', title: 'Procedures', url: 'https://www.acquisition.gov/far/10.002' }],
    {
      decisionSteps: [
        'Do not begin with conclusion; begin with market evidence collection.',
        'Determine whether only one responsible source truly exists from documented data.',
        'Use sole-source authority only after evidence supports that outcome.'
      ],
      whyCorrect: 'Option B is correct because the team has no market research yet. Without that foundation, claiming “only one vendor can do it” is premature and weakly defensible.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Writing a J&A before evidence gathering reverses the required analytical order.' },
        { choiceIndex: 2, reason: 'Skipping analysis and awarding directly creates avoidable protest risk.' },
        { choiceIndex: 3, reason: 'Vendors cannot author the Government’s sole-source justification.' }
      ],
      practicalTip: 'When sole source is proposed, require documented technical findings and independent market checks first.'
    }
  ),
  'con3910-178': block(
    { cite: 'FAR Part 15', title: 'Contracting by Negotiation', url: 'https://www.acquisition.gov/far/part-15' },
    [{ cite: '15.308', title: 'Source selection decision', url: 'https://www.acquisition.gov/far/15.308' }],
    {
      decisionSteps: [
        'Confirm the selected offer is higher priced and identify claimed value benefit.',
        'Tie that benefit to evaluation criteria used in the solicitation.',
        'Document tradeoff rationale in the source-selection decision record.'
      ],
      whyCorrect: 'Option B is correct because a higher-priced selection must be justified by documented value under stated criteria. The file must show why that premium is worth paying.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'CO discretion is broad but never documentation-free.' },
        { choiceIndex: 2, reason: 'Emailing the winner does not satisfy source-selection documentation requirements.' },
        { choiceIndex: 3, reason: 'Deleting evaluation records destroys auditability and is improper.' }
      ],
      practicalTip: 'Write your tradeoff narrative so a third-party reviewer can trace each conclusion to evaluation evidence.'
    }
  ),
  'con3910-179': block(
    { cite: 'FAR Part 17', title: 'Special Contracting Methods', url: 'https://www.acquisition.gov/far/part-17' },
    [{ cite: '17.207', title: 'Exercise of options', url: 'https://www.acquisition.gov/far/17.207' }],
    {
      decisionSteps: [
        'Reassess best interest before option exercise, not after.',
        'If best interest is not met, do not exercise the option clause.',
        'Plan follow-on acquisition action to maintain mission continuity.'
      ],
      whyCorrect: 'Option B is correct because option exercise is discretionary and must support Government best interest. If that determination fails, the CO should pursue the next appropriate acquisition approach.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Exercising just to avoid recompete ignores the required best-interest determination.' },
        { choiceIndex: 2, reason: 'Trying to renegotiate after exercising does not cure a flawed pre-exercise decision.' },
        { choiceIndex: 3, reason: 'Extending without contractual authority is not valid.' }
      ],
      practicalTip: 'Begin option analysis early enough to pivot to a new acquisition if exercise is not justified.'
    }
  ),
  'con3910-180': block(
    { cite: 'FAR Part 33', title: 'Protests, Disputes, and Appeals', url: 'https://www.acquisition.gov/far/part-33' },
    [{ cite: '33.204', title: 'Policy', url: 'https://www.acquisition.gov/far/33.204' }],
    {
      decisionSteps: [
        'Classify the written demand for money tied to alleged Government delay as potential claim/dispute activity.',
        'Follow claim handling process and coordinate technical, legal, and contract documentation.',
        'Issue decisions on the record rather than informal resolution shortcuts.'
      ],
      whyCorrect: 'Option B is correct because a written monetary demand for delay is claim-oriented and must be treated through FAR Part 33 dispute procedures. Structured handling protects both mission continuity and legal posture.',
      whyOthersWrong: [
        { choiceIndex: 0, reason: 'Ignoring the demand until closeout can escalate entitlement and interest exposure.' },
        { choiceIndex: 2, reason: 'Immediate payment without analysis bypasses entitlement review and documentation.' },
        { choiceIndex: 3, reason: 'Default termination is not the default response to a delay money claim.' }
      ],
      practicalTip: 'As soon as a claim-like letter arrives, open a claim file with chronology, directives, and delay evidence.'
    }
  )
};

const bannedPhrases = [
  'controlling FAR',
  'this fact pattern',
  'expedient',
  'governing FAR Part first',
  'Common trap:'
];

const tokenize = (value: string): Set<string> => {
  return new Set(value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean));
};

const similarity = (a: string, b: string): number => {
  const ta = tokenize(a);
  const tb = tokenize(b);
  if (!ta.size || !tb.size) return 0;
  let intersection = 0;
  for (const token of ta) {
    if (tb.has(token)) intersection += 1;
  }
  const union = new Set([...ta, ...tb]).size;
  return union ? intersection / union : 0;
};

if (process.env.NODE_ENV !== 'production') {
  const ids = Object.keys(DAU_EXPLANATIONS);
  ids.forEach((id) => {
    const text = [
      DAU_EXPLANATIONS[id].decisionSteps.join(' '),
      DAU_EXPLANATIONS[id].whyCorrect,
      DAU_EXPLANATIONS[id].whyOthersWrong.map((item) => item.reason).join(' '),
      DAU_EXPLANATIONS[id].practicalTip
    ].join(' ');

    bannedPhrases.forEach((phrase) => {
      if (text.includes(phrase)) {
        console.warn(`[explanations] Banned phrase found in ${id}: ${phrase}`);
      }
    });
  });

  for (let i = 0; i < ids.length; i += 1) {
    for (let j = i + 1; j < ids.length; j += 1) {
      const a = DAU_EXPLANATIONS[ids[i]];
      const b = DAU_EXPLANATIONS[ids[j]];
      const aText = `${a.decisionSteps.join(' ')} ${a.whyCorrect} ${a.whyOthersWrong.map((item) => item.reason).join(' ')} ${a.practicalTip}`;
      const bText = `${b.decisionSteps.join(' ')} ${b.whyCorrect} ${b.whyOthersWrong.map((item) => item.reason).join(' ')} ${b.practicalTip}`;
      if (similarity(aText, bText) > 0.6) {
        console.warn(`[explanations] High similarity warning: ${ids[i]} and ${ids[j]}`);
      }
    }
  }
}

export const buildExplanation = ({ questionId, questionText, options, correctIndex, selectedIndex, farRef }: BuildExplanationInput) => {
  const mapped = questionId ? DAU_EXPLANATIONS[questionId] : undefined;
  if (mapped) {
    return {
      farLine: `${mapped.farRefs.part.cite} — ${mapped.farRefs.part.title}`,
      linkLabel: `Open ${mapped.farRefs.part.cite} on Acquisition.gov`,
      references: {
        part: {
          part: mapped.farRefs.part.cite.replace('FAR Part ', ''),
          title: mapped.farRefs.part.title,
          url: mapped.farRefs.part.url
        },
        subpart: mapped.farRefs.subpart
          ? {
            code: mapped.farRefs.subpart.cite.replace('FAR Subpart ', ''),
            title: mapped.farRefs.subpart.title,
            url: mapped.farRefs.subpart.url
          }
          : undefined,
        sections: mapped.farRefs.sections.map((section) => ({ ...section }))
      },
      decisionSteps: mapped.decisionSteps,
      whyCorrect: mapped.whyCorrect,
      whyOthersWrong: mapped.whyOthersWrong,
      wrongBullets: mapped.whyOthersWrong.map((item) => `${String.fromCharCode(65 + item.choiceIndex)}: ${item.reason}`),
      keyTakeaway: mapped.practicalTip,
      practicalTip: mapped.practicalTip
    };
  }

  const detail = inferFarDetail(questionId ?? '', questionText);
  const correct = options[correctIndex] ?? 'the correct option';
  const selected = selectedIndex === null ? "I don't know" : options[selectedIndex] ?? 'the selected option';

  return {
    farLine: `FAR Part ${farRef.part} — ${farRef.title}`,
    linkLabel: `Open FAR Part ${farRef.part} on Acquisition.gov`,
    references: {
      part: { part: String(detail.part.part), title: detail.part.title, url: detail.part.url },
      subpart: detail.subpart ? { code: detail.subpart.code, title: detail.subpart.title, url: detail.subpart.url } : undefined,
      sections: detail.sections
    },
    decisionSteps: ['Explanation unavailable for this question.'],
    whyCorrect: `Selected answer review: ${correct}.`,
    whyOthersWrong: [{ choiceIndex: selectedIndex ?? 0, reason: `Selected option “${selected}” was not the keyed answer.` }],
    wrongBullets: [`Selected option “${selected}” was not the keyed answer.`],
    keyTakeaway: 'Use FAR references above and instructor notes for deeper study.',
    practicalTip: 'Capture your own rationale in study notes to reinforce retention.'
  };
};
