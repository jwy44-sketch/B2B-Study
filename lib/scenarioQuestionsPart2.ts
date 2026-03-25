import type { ScenarioQuestion } from './scenarioQuestionsPart1';

export const scenarioQuestionsPart2: ScenarioQuestion[] = [
  {
    id: 'scenario-051',
    questionNumber: 51,
    topic: 'Contract Types',
    stem: 'A requiring activity wants to use a cost-reimbursement contract for a straightforward commercial supply purchase with stable pricing and clear specifications. What is the best contracting response?',
    choices: [
      { id: 'A', text: 'Use cost-reimbursement because it gives the Government maximum price certainty.' },
      { id: 'B', text: 'Use a fixed-price contract because the requirement is stable and commercial.' },
      { id: 'C', text: 'Use a labor-hour contract because supplies are easier to price by labor category.' },
      { id: 'D', text: 'Use cost-plus-percentage-of-cost because it is ideal for commercial items.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Stable commercial requirements generally support fixed-price contracting, not cost-reimbursement.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-052',
    questionNumber: 52,
    topic: 'Contract Types',
    stem: 'A team is choosing between firm-fixed-price and time-and-materials for a repair requirement. The scope can be defined clearly, and historical pricing is available. What is the best answer?',
    choices: [
      { id: 'A', text: 'Use time-and-materials because it reduces the need for planning.' },
      { id: 'B', text: 'Use firm-fixed-price because the work can be clearly defined and priced.' },
      { id: 'C', text: 'Use labor-hour because it avoids surveillance.' },
      { id: 'D', text: 'Use cost-reimbursement because all repairs are uncertain.' }
    ],
    correctChoiceId: 'B',
    explanation: 'When work can be clearly defined and reasonably priced, firm-fixed-price is generally the preferred contract type.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-053',
    questionNumber: 53,
    topic: 'Contract Types',
    stem: 'A program manager says time-and-materials is the safest choice because the Government pays only for actual effort. What is the best response?',
    choices: [
      { id: 'A', text: 'Agree, because time-and-materials places the greatest cost risk on the contractor.' },
      { id: 'B', text: 'Disagree, because time-and-materials is higher risk for the Government and requires strong surveillance.' },
      { id: 'C', text: 'Agree, because time-and-materials is mandatory for services.' },
      { id: 'D', text: 'Disagree, because time-and-materials can only be used for construction.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Time-and-materials places more cost risk on the Government and requires careful monitoring.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-054',
    questionNumber: 54,
    topic: 'Contract Types',
    stem: 'A trainee asks which contract type places the greatest cost risk on the contractor. What is the best answer?',
    choices: [
      { id: 'A', text: 'Cost-reimbursement' },
      { id: 'B', text: 'Time-and-materials' },
      { id: 'C', text: 'Firm-fixed-price' },
      { id: 'D', text: 'Labor-hour' }
    ],
    correctChoiceId: 'C',
    explanation: 'Firm-fixed-price places the greatest cost risk on the contractor.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-055',
    questionNumber: 55,
    topic: 'Contract Types',
    stem: 'Your team is considering a cost-plus-percentage-of-cost arrangement because it seems flexible and easy. What is the best answer?',
    choices: [
      { id: 'A', text: 'Use it only for research and development.' },
      { id: 'B', text: 'Use it only if approved by legal.' },
      { id: 'C', text: 'Do not use it because it is prohibited.' },
      { id: 'D', text: 'Use it when the contractor is highly trusted.' }
    ],
    correctChoiceId: 'C',
    explanation: 'Cost-plus-percentage-of-cost contracts are prohibited.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-056',
    questionNumber: 56,
    topic: 'Contract Pricing',
    stem: 'A new specialist is learning the basic price build-up. Which formula is most accurate based on the absorbed material?',
    choices: [
      { id: 'A', text: 'Contract Price = Cost + Profit/Fee' },
      { id: 'B', text: 'Contract Price = Labor + Schedule' },
      { id: 'C', text: 'Contract Price = Funding + Obligation' },
      { id: 'D', text: 'Contract Price = Revenue + Incentive' }
    ],
    correctChoiceId: 'A',
    explanation: 'The absorbed price component material states that contract price is built from cost plus profit/fee.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-057',
    questionNumber: 57,
    topic: 'Contract Pricing',
    stem: 'A team member says subcontracts are never part of contract cost. What is the best answer?',
    choices: [
      { id: 'A', text: 'Correct, because subcontracts are profit only.' },
      { id: 'B', text: 'Incorrect, because subcontracts can be part of direct cost.' },
      { id: 'C', text: 'Correct, because subcontracts are always indirect cost.' },
      { id: 'D', text: 'Incorrect, because subcontracts are always G&A.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Subcontracts can be part of direct cost in the contract price structure.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-058',
    questionNumber: 58,
    topic: 'Contract Pricing',
    stem: 'A trainee is trying to separate direct and indirect cost. Which answer is best?',
    choices: [
      { id: 'A', text: 'Direct cost includes items traceable to the contract, while indirect cost includes broader allocable pools like overhead and G&A.' },
      { id: 'B', text: 'Indirect cost means only profit.' },
      { id: 'C', text: 'Direct cost and indirect cost mean the same thing in negotiated pricing.' },
      { id: 'D', text: 'Only labor can be a direct cost.' }
    ],
    correctChoiceId: 'A',
    explanation: 'Direct costs are traceable to the specific contract, while indirect costs are allocated through broader cost pools.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-059',
    questionNumber: 59,
    topic: 'Negotiation',
    stem: "A sole-source team is evaluating a contractor proposal for a high-dollar service acquisition. The contractor's proposed staffing mix looks weak for the required workload. What should the Government do?",
    choices: [
      { id: 'A', text: 'Ignore the issue because technical analysis is not part of pricing.' },
      { id: 'B', text: 'Use technical analysis to support negotiation and price/cost evaluation.' },
      { id: 'C', text: 'Skip analysis and move straight to award if the schedule is urgent.' },
      { id: 'D', text: "Use only the contractor's own staffing assumptions because questioning them would be unfair." }
    ],
    correctChoiceId: 'B',
    explanation: 'Technical analysis may be used to support price/cost evaluation and negotiation in sole-source settings.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-060',
    questionNumber: 60,
    topic: 'Negotiation',
    stem: 'A sole-source proposal appears overstated in several labor categories. Which Government action best fits the absorbed sole-source process?',
    choices: [
      { id: 'A', text: 'Rely only on adequate price competition.' },
      { id: 'B', text: 'Conduct cost and/or price analysis and negotiate from a pre-negotiation objective.' },
      { id: 'C', text: 'Issue a source selection decision document.' },
      { id: 'D', text: 'Provide a post-award debriefing to the contractor before negotiation.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Sole-source negotiation relies on price/cost analysis and pre-negotiation objectives rather than competition-based pricing.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-061',
    questionNumber: 61,
    topic: 'Negotiation',
    stem: 'Your team wants audit support on a complex sole-source pricing proposal. Which answer best fits the absorbed materials?',
    choices: [
      { id: 'A', text: 'Audit or field pricing support can be part of the sole-source evaluation process.' },
      { id: 'B', text: 'Audit support is never allowed in negotiated acquisitions.' },
      { id: 'C', text: 'Audit support is used only after final payment.' },
      { id: 'D', text: 'Audit support replaces the need for a PNM.' }
    ],
    correctChoiceId: 'A',
    explanation: 'The absorbed sole-source negotiation materials specifically mention field pricing support and audit assistance.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-062',
    questionNumber: 62,
    topic: 'Negotiation',
    stem: "A trainee says 'business clearance approval' belongs only in competitive source selection. What is the best answer?",
    choices: [
      { id: 'A', text: 'Correct, because business clearance is never used in sole-source negotiation.' },
      { id: 'B', text: 'Incorrect, because the absorbed sole-source process specifically references business clearance approvals.' },
      { id: 'C', text: 'Correct, because business clearance is only a post-award concept.' },
      { id: 'D', text: 'Incorrect, because business clearance applies only to SAP.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The absorbed sole-source process specifically references business clearance approvals.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-063',
    questionNumber: 63,
    topic: 'Source Selection',
    stem: 'A source selection evaluation team is scoring factors and subfactors. Where must those factors come from?',
    choices: [
      { id: 'A', text: 'They may come from evaluator preference as long as the SSA agrees.' },
      { id: 'B', text: 'They must come from the solicitation and be evaluated in accordance with it.' },
      { id: 'C', text: 'They should be developed after proposal receipt for flexibility.' },
      { id: 'D', text: 'They are only needed in sole-source acquisitions.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Factors and subfactors must come from the solicitation and be evaluated in accordance with it.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-064',
    questionNumber: 64,
    topic: 'Source Selection',
    stem: 'A team member wants to issue evaluation notices in a competitive negotiation. What is the best answer?',
    choices: [
      { id: 'A', text: 'Evaluation notices are associated with competitive source-selection practice in the absorbed material.' },
      { id: 'B', text: 'Evaluation notices are used only for sealed bidding.' },
      { id: 'C', text: 'Evaluation notices replace final proposal revisions.' },
      { id: 'D', text: 'Evaluation notices are prohibited once a competitive range is established.' }
    ],
    correctChoiceId: 'A',
    explanation: 'The absorbed competitive source-selection reference mentions issuance of evaluation notices in the source-selection context.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-065',
    questionNumber: 65,
    topic: 'Source Selection',
    stem: 'Who makes the best value source selection decision in the competitive process described in the absorbed material?',
    choices: [
      { id: 'A', text: 'The COR' },
      { id: 'B', text: 'The Source Selection Authority' },
      { id: 'C', text: 'The requiring activity resource advisor' },
      { id: 'D', text: 'The incumbent contractor' }
    ],
    correctChoiceId: 'B',
    explanation: 'The absorbed competitive source-selection material ties the best value decision to the Source Selection Authority.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-066',
    questionNumber: 66,
    topic: 'Source Selection',
    stem: 'A new evaluator says competitive source selection and sole-source negotiation are basically the same because both are under FAR Part 15. What is the best answer?',
    choices: [
      { id: 'A', text: 'Correct, because both use identical exchanges, documents, and decision authorities.' },
      { id: 'B', text: 'Incorrect, because they use different pricing bases, exchange structures, documentation, and decision processes.' },
      { id: 'C', text: 'Correct, but only when the dollar value exceeds the SAT.' },
      { id: 'D', text: 'Incorrect, but only for commercial item acquisitions.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The absorbed material explicitly contrasts sole-source negotiation and competitive source selection as distinct processes within FAR Part 15.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'hard'
  },
  {
    id: 'scenario-067',
    questionNumber: 67,
    topic: 'Protests / Debriefs',
    stem: 'An unsuccessful offeror asks what a debrief is actually for. Which answer is best?',
    choices: [
      { id: 'A', text: 'To coach the offeror into winning the recompete.' },
      { id: 'B', text: 'To help the offeror understand the evaluation and award decision within allowable disclosure limits.' },
      { id: 'C', text: "To disclose the awardee's proprietary solution in detail." },
      { id: 'D', text: 'To reopen negotiations after award.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Debriefings are intended to explain the evaluation and award decision within permitted disclosure limits.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-068',
    questionNumber: 68,
    topic: 'Protests / Debriefs',
    stem: 'A disappointed offeror wants to know whether debriefing timelines matter. What is the best answer based on the absorbed process aids?',
    choices: [
      { id: 'A', text: 'No, because an offeror can request a debriefing whenever it wants.' },
      { id: 'B', text: 'Yes, because debriefing timing and type are tied to where the offeror exited the process.' },
      { id: 'C', text: 'No, because only the awardee may request a debriefing.' },
      { id: 'D', text: 'Yes, but only if the acquisition used sealed bidding.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The process aids tie debrief timing and type to when an offeror is excluded or loses award.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-069',
    questionNumber: 69,
    topic: 'Ethics / Conduct',
    stem: "A program office asks the CO to email one vendor advance information about how the requirement will be evaluated because 'they're likely the best fit anyway.' What is the best answer?",
    choices: [
      { id: 'A', text: 'Share it, because early collaboration improves competition.' },
      { id: 'B', text: 'Do not share nonpublic source-selection-sensitive information in a way that gives one vendor an unfair advantage.' },
      { id: 'C', text: 'Share it only if the vendor signs a nondisclosure agreement.' },
      { id: 'D', text: 'Share it only if the vendor is a small business.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The Government must protect fairness and integrity and avoid giving one vendor unequal access to evaluation-sensitive information.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-070',
    questionNumber: 70,
    topic: 'Ethics / Conduct',
    stem: 'A contractor representative offers a gift basket to the acquisition team during source selection. What is the best answer?',
    choices: [
      { id: 'A', text: 'Accept it if the value is small.' },
      { id: 'B', text: 'Decline it and follow ethics rules regarding gifts from contractors.' },
      { id: 'C', text: 'Accept it if all offerors are invited to send one.' },
      { id: 'D', text: 'Accept it only after award.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Government personnel should not solicit or accept gifts from contractors or prospective contractors.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-071',
    questionNumber: 71,
    topic: 'OCI',
    stem: 'A contractor helped draft the specifications for a system and now wants to compete for the production contract. What issue should the CO be most concerned about?',
    choices: [
      { id: 'A', text: 'The contractor may have an organizational conflict of interest due to biased ground rules.' },
      { id: 'B', text: 'The contractor automatically becomes the only qualified source.' },
      { id: 'C', text: 'No issue exists because market research has already been completed.' },
      { id: 'D', text: 'Only schedule risk matters in this situation.' }
    ],
    correctChoiceId: 'A',
    explanation: 'Helping draft requirements can create an OCI because the contractor may have biased the ground rules.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-072',
    questionNumber: 72,
    topic: 'OCI',
    stem: 'A contractor receives nonpublic information during advisory support work and later competes on a related acquisition. What is the best concern?',
    choices: [
      { id: 'A', text: 'Unequal access to information OCI.' },
      { id: 'B', text: 'Late proposal risk.' },
      { id: 'C', text: 'Improper use of SF 30.' },
      { id: 'D', text: 'Minor informality.' }
    ],
    correctChoiceId: 'A',
    explanation: 'Access to nonpublic information can create an unequal-access OCI concern.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-073',
    questionNumber: 73,
    topic: 'Communication / Documentation',
    stem: "A junior specialist wants to rely entirely on verbal guidance from the requiring activity and skip documenting the acquisition strategy because 'everyone already understands it.' What is the best response?",
    choices: [
      { id: 'A', text: 'That is acceptable if the team is small.' },
      { id: 'B', text: 'Key acquisition decisions and rationale must be documented clearly in the file.' },
      { id: 'C', text: 'Documentation is only needed after award.' },
      { id: 'D', text: 'Only legal determinations need written support.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The course materials emphasize communication and documentation as foundational to defensible contracting.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-074',
    questionNumber: 74,
    topic: 'Communication / Documentation',
    stem: "A CO says, 'If I know the answer, I don't need to show my work in the file.' What is the best reply?",
    choices: [
      { id: 'A', text: 'Correct, because contracting is based on expertise, not records.' },
      { id: 'B', text: 'Incorrect, because the contract file must support the decisions made and actions taken.' },
      { id: 'C', text: 'Correct, unless the action exceeds the SAT.' },
      { id: 'D', text: 'Incorrect, but only in source selections.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The contract file must support decisions and actions, not just the final result.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-075',
    questionNumber: 75,
    topic: 'Situational Assessment',
    stem: 'A requirement appears simple at first, but market research reveals cybersecurity, supply-chain, and overseas shipping concerns. What is the best lesson?',
    choices: [
      { id: 'A', text: 'Keep the original approach because new facts should not change the acquisition strategy.' },
      { id: 'B', text: 'Use situational assessment and adjust the acquisition strategy as new facts emerge.' },
      { id: 'C', text: 'Cancel the requirement automatically whenever complexity increases.' },
      { id: 'D', text: 'Convert the buy to a BPA regardless of the requirement.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Situational assessment means the contracting professional evaluates facts and adjusts strategy accordingly.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-076',
    questionNumber: 76,
    topic: 'Team Dynamics',
    stem: 'The requiring activity, finance office, and contracting office are each making conflicting assumptions about the requirement schedule. What is the best contracting response?',
    choices: [
      { id: 'A', text: 'Proceed quickly and resolve disagreements after solicitation release.' },
      { id: 'B', text: 'Reestablish team alignment early so requirement, funding, and schedule assumptions are consistent.' },
      { id: 'C', text: 'Let the incumbent decide which schedule is realistic.' },
      { id: 'D', text: 'Ask legal to pick the schedule unilaterally.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Team dynamics and communication are foundational; early alignment prevents avoidable acquisition failure.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-077',
    questionNumber: 77,
    topic: 'Contract Principles',
    stem: 'A program office assumes that because a contractor is already performing well, the CO can simply tell it to start new work while the paperwork catches up. What is the best answer?',
    choices: [
      { id: 'A', text: 'That is fine if the contractor agrees.' },
      { id: 'B', text: 'No new work should begin without proper authority because that creates unauthorized commitment risk.' },
      { id: 'C', text: 'That is fine if the COR sends the direction in writing.' },
      { id: 'D', text: 'That is fine if the value is under the SAT.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Only authorized officials can bind the Government; directing new work without proper authority risks an unauthorized commitment.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-078',
    questionNumber: 78,
    topic: 'Contract Principles',
    stem: 'A contracting trainee is asked what three broad categories help determine how many acquisition rules apply to a particular action. Based on the absorbed material, what is the best answer?',
    choices: [
      { id: 'A', text: 'Dollar value, subject matter, and contract type.' },
      { id: 'B', text: 'Vendor preference, local custom, and payment timing.' },
      { id: 'C', text: 'Only dollar value matters.' },
      { id: 'D', text: 'Only whether the item is commercial matters.' }
    ],
    correctChoiceId: 'A',
    explanation: "The 'Subset of Acquisitions' material identifies dollar value, subject matter, and contract type as broad categories that drive many rules.",
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-079',
    questionNumber: 79,
    topic: 'Subset of Acquisitions',
    stem: 'A trainee is trying to choose the right set of rules for a procurement. Why is identifying the subject matter important?',
    choices: [
      { id: 'A', text: 'Because subject matter has no effect on procurement rules.' },
      { id: 'B', text: 'Because whether the requirement is supply, service, construction, A&E, R&D, or another category affects applicable rules.' },
      { id: 'C', text: 'Because subject matter only matters after award.' },
      { id: 'D', text: 'Because subject matter affects only the payment office.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Subject matter drives many rule sets, including labor laws, contract format, and applicable FAR parts.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-080',
    questionNumber: 80,
    topic: 'Subset of Acquisitions',
    stem: 'A team member says contract type affects only pricing and nothing else. Which answer best fits the absorbed material?',
    choices: [
      { id: 'A', text: 'Correct, because clauses are based only on dollar value.' },
      { id: 'B', text: 'Incorrect, because contract type can affect inspection, changes, allowable costs, terminations, and compliance systems.' },
      { id: 'C', text: 'Correct, unless the requirement is construction.' },
      { id: 'D', text: 'Incorrect, but only for service contracts.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The absorbed material notes that contract type affects many downstream rule areas, not just pricing.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-081',
    questionNumber: 81,
    topic: 'Subset of Acquisitions',
    stem: 'A trainee is confusing SAP for certain commercial items with the SAT itself. What is the best correction?',
    choices: [
      { id: 'A', text: 'They are exactly the same threshold concept.' },
      { id: 'B', text: 'Do not confuse special commercial authorities under FAR 13.5 with the SAT threshold itself.' },
      { id: 'C', text: 'The SAT only applies to construction.' },
      { id: 'D', text: 'SAP for certain commercial items replaces all other threshold concepts.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The absorbed material specifically warns not to confuse special commercial authorities with the SAT threshold.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-082',
    questionNumber: 82,
    topic: 'Competition',
    stem: 'A specialist says FAR Part 6 applies in exactly the same way to SAP acquisitions as it does to all other procurements. Based on the absorbed study aid, what is the best answer?',
    choices: [
      { id: 'A', text: 'Correct, with no exceptions or nuance.' },
      { id: 'B', text: 'Not exactly; the competition framework includes important distinctions, and the study aid notes Part 6 does not apply the same way to SAP.' },
      { id: 'C', text: 'Incorrect, because competition rules never apply to SAP.' },
      { id: 'D', text: 'Correct, but only if the requirement is commercial.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The study aid distinguishes SAP from the standard Part 6 competition framework.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'hard'
  },
  {
    id: 'scenario-083',
    questionNumber: 83,
    topic: 'Competition',
    stem: 'A program office wants to limit competition because the incumbent is already familiar with the mission. What is the best contracting response?',
    choices: [
      { id: 'A', text: 'Limit competition because incumbent familiarity is always a sufficient reason.' },
      { id: 'B', text: 'Do not limit competition unless a valid statutory or regulatory authority applies and is documented.' },
      { id: 'C', text: 'Allow the incumbent to submit first and decide later if competition is needed.' },
      { id: 'D', text: 'Convert the requirement into a BPA to avoid competition rules.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Competition may only be limited when a valid authority applies and is properly documented.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-084',
    questionNumber: 84,
    topic: 'Competition',
    stem: 'Your J&A cites urgency, but the file shows the requirement was known for months and delayed internally. What is the biggest problem?',
    choices: [
      { id: 'A', text: 'No problem, because urgency always overrides poor planning.' },
      { id: 'B', text: 'Urgency caused by lack of advance planning is not a sound basis for limiting competition.' },
      { id: 'C', text: 'The only issue is that the J&A should be signed after award.' },
      { id: 'D', text: 'The only issue is that the contract should be cost-reimbursement.' }
    ],
    correctChoiceId: 'B',
    explanation: 'A claimed urgency rationale is weakened when the urgency results from lack of advance planning.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-085',
    questionNumber: 85,
    topic: 'Modifications',
    stem: 'A contract specialist is unsure whether to use Block 13A, 13B, 13C, or 13D on an SF 30. Which question should be answered first?',
    choices: [
      { id: 'A', text: 'What lunch preference does the contractor have?' },
      { id: 'B', text: 'What is the actual modification authority and type of action being taken?' },
      { id: 'C', text: 'What did the previous SF 30 use?' },
      { id: 'D', text: 'Which block looks the simplest to complete?' }
    ],
    correctChoiceId: 'B',
    explanation: 'The modification authority chart emphasizes identifying the type and authority of the action first.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-086',
    questionNumber: 86,
    topic: 'Modifications',
    stem: 'A unilateral SF 30 changes the paying office and corrects a typographical error without affecting substantive rights. What kind of modification is this most likely?',
    choices: [
      { id: 'A', text: 'Administrative change' },
      { id: 'B', text: 'Supplemental agreement' },
      { id: 'C', text: 'Termination settlement' },
      { id: 'D', text: 'Change order under the Changes clause' }
    ],
    correctChoiceId: 'A',
    explanation: 'Administrative changes are unilateral and do not affect substantive rights.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-087',
    questionNumber: 87,
    topic: 'Modifications',
    stem: 'A contracting officer issues a unilateral change order within the general scope of a noncommercial contract under the applicable Changes clause. Later, the parties negotiate the resulting price adjustment. What is the follow-on mod most likely?',
    choices: [
      { id: 'A', text: 'A bilateral supplemental agreement definitizing the equitable adjustment.' },
      { id: 'B', text: 'Another unilateral administrative change.' },
      { id: 'C', text: 'A novation agreement.' },
      { id: 'D', text: 'A post-award debriefing.' }
    ],
    correctChoiceId: 'A',
    explanation: 'After a unilateral change order, negotiated equitable adjustments are typically captured bilaterally.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-088',
    questionNumber: 88,
    topic: 'Modifications',
    stem: 'The team wants to use the standard Changes clause approach on a commercial item contract formatted under FAR 52.212-4. What is the best answer?',
    choices: [
      { id: 'A', text: 'That is always correct because all contracts use the same Changes clause.' },
      { id: 'B', text: 'Be careful, because commercial item changes are handled differently and rely on mutual agreement under the commercial terms.' },
      { id: 'C', text: 'Use the noncommercial Changes clause anyway if the dollar value is high.' },
      { id: 'D', text: 'No contract authority is needed for commercial changes.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Commercial item changes are generally handled under the commercial terms, which differ from standard noncommercial Changes clauses.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-089',
    questionNumber: 89,
    topic: 'Modifications',
    stem: 'A CO wants to exercise an option under an existing contract. Under the mod authority chart, where is that type of action typically supported?',
    choices: [
      { id: 'A', text: 'Under an appropriate clause/authority permitting the action, not as a random administrative change.' },
      { id: 'B', text: 'Only under a bilateral supplemental agreement with no clause citation.' },
      { id: 'C', text: 'Only through termination authority.' },
      { id: 'D', text: 'Only through a pre-award amendment.' }
    ],
    correctChoiceId: 'A',
    explanation: 'Option exercises rely on the applicable contract option clause and proper authority.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-090',
    questionNumber: 90,
    topic: 'Modifications',
    stem: "A specialist proposes citing no authority on an SF 30 because 'everyone knows why we're changing it.' What is the best answer?",
    choices: [
      { id: 'A', text: 'Fine, because authority is optional if both parties agree.' },
      { id: 'B', text: 'The SF 30 must be supported by the appropriate authority for the action being taken.' },
      { id: 'C', text: 'Authority is needed only on construction contracts.' },
      { id: 'D', text: 'Authority is needed only for unilateral actions, never bilateral ones.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Modification actions must be supported by the correct authority, whether clause-based, term-based, FAR-based, or mutual agreement as applicable.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-091',
    questionNumber: 91,
    topic: 'Quality Assurance',
    stem: "A team member says quality assurance is only the contractor's problem. Based on the absorbed material, what is the best response?",
    choices: [
      { id: 'A', text: 'Correct, because the Government only pays invoices.' },
      { id: 'B', text: 'Incorrect; quality assurance involves both Government and contractor roles.' },
      { id: 'C', text: 'Correct, unless the contract is commercial.' },
      { id: 'D', text: 'Incorrect, but only when the contract uses T&M.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The absorbed material states that quality assurance applies to both Government and contractor.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-092',
    questionNumber: 92,
    topic: 'Standards of Conduct',
    stem: "A program office wants to steer a requirement to a favored vendor because 'they've always taken care of us.' Which foundational contracting principle is most directly at risk?",
    choices: [
      { id: 'A', text: 'Standards of conduct and impartiality.' },
      { id: 'B', text: 'Only the invoice approval process.' },
      { id: 'C', text: 'Only contract closeout.' },
      { id: 'D', text: 'Only the funding certification.' }
    ],
    correctChoiceId: 'A',
    explanation: 'Steering business to a favored source implicates standards of conduct, fairness, and impartiality.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-093',
    questionNumber: 93,
    topic: 'Communication / Documentation',
    stem: 'A senior reviewer asks why your contract file contains both market research notes and acquisition planning rationale. What is the best answer?',
    choices: [
      { id: 'A', text: 'Because documentation should show how the facts led to the chosen acquisition strategy.' },
      { id: 'B', text: 'Because extra documents always improve file size.' },
      { id: 'C', text: 'Because legal requires duplicate paperwork for every file.' },
      { id: 'D', text: 'Because planning and market research have no real connection.' }
    ],
    correctChoiceId: 'A',
    explanation: 'Documentation should show how facts and analysis supported the final acquisition strategy.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-094',
    questionNumber: 94,
    topic: 'Plan Solicitation',
    stem: "A requirement owner says 'just issue the RFP now and we'll figure out evaluation factors later.' What is the best answer?",
    choices: [
      { id: 'A', text: 'Do it, because evaluation factors can always be added during discussions.' },
      { id: 'B', text: 'Do not issue the solicitation until the evaluation structure is defined and aligned with the requirement.' },
      { id: 'C', text: 'Issue the RFP and let the SSEB decide the factors after receipt.' },
      { id: 'D', text: 'Issue the solicitation only to the incumbent first.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Evaluation factors must be defined and aligned with the requirement before solicitation release.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-095',
    questionNumber: 95,
    topic: 'Request Offers',
    stem: 'A source selection team wants to evaluate oral presentations as part of the competitive process. What is the best answer?',
    choices: [
      { id: 'A', text: 'Oral presentations can be used when structured and disclosed appropriately in the acquisition approach.' },
      { id: 'B', text: 'Oral presentations are prohibited under FAR Part 15.' },
      { id: 'C', text: 'Oral presentations replace the need for written proposals in every acquisition.' },
      { id: 'D', text: 'Oral presentations are only used after award.' }
    ],
    correctChoiceId: 'A',
    explanation: 'The source-selection process aid specifically includes oral presentations as part of the Part 15 process.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'medium'
  },
  {
    id: 'scenario-096',
    questionNumber: 96,
    topic: 'Source Selection',
    stem: 'An evaluator says that once discussions begin, the Government must tell each offeror every possible area where its proposal could be improved. What is the best answer?',
    choices: [
      { id: 'A', text: 'Correct, because discussions require full proposal coaching.' },
      { id: 'B', text: 'Incorrect; discussions must be meaningful, but they do not require the Government to coach offerors to perfection.' },
      { id: 'C', text: 'Correct, but only in LPTA.' },
      { id: 'D', text: 'Incorrect, because discussions are prohibited in source selection.' }
    ],
    correctChoiceId: 'B',
    explanation: 'Meaningful discussions must address deficiencies and significant weaknesses, but do not require coaching every possible improvement.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'hard'
  },
  {
    id: 'scenario-097',
    questionNumber: 97,
    topic: 'Lifecycle',
    stem: 'A trainee is trying to connect pre-award and post-award. Which answer best reflects the course framing?',
    choices: [
      { id: 'A', text: 'Pre-award and post-award are unrelated because one ends when the other begins.' },
      { id: 'B', text: 'Pre-award decisions shape post-award outcomes, including monitoring, modifications, and completion.' },
      { id: 'C', text: 'Only post-award matters to mission success.' },
      { id: 'D', text: 'Only pre-award matters because the contract file closes at award.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The life-cycle framing emphasizes that pre-award choices drive post-award performance and administration.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-098',
    questionNumber: 98,
    topic: 'RFO Transition',
    stem: 'A learner asks whether they should stop studying current course concepts and wait for every RFO update to be finalized before preparing. Based on the absorbed FAQ, what is the best answer?',
    choices: [
      { id: 'A', text: 'Yes, because the current competencies are obsolete.' },
      { id: 'B', text: 'No; the core competencies remain largely the same, so current preparation is still valid even during the transition.' },
      { id: 'C', text: 'Yes, because the exam is unavailable until all RFO updates are complete.' },
      { id: 'D', text: 'No, but only if the learner already passed CON 3910.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The FAQ says the core competencies remain substantially the same and that current preparation remains valid during the transition.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-099',
    questionNumber: 99,
    topic: 'Exam Strategy',
    stem: 'A trainee asks what study logic is most useful for the certification-style exam based on the absorbed prep advice. What is the best answer?',
    choices: [
      { id: 'A', text: 'Memorize isolated words only and avoid scenario practice.' },
      { id: 'B', text: 'Study major topics, but learn how to apply them to scenarios and process logic.' },
      { id: 'C', text: 'Ignore FAR Part 15 because it rarely matters.' },
      { id: 'D', text: 'Focus only on post-award forms and skip acquisition planning.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The absorbed prep advice emphasized studying major topics and learning to apply them to scenarios rather than memorizing isolated facts.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  },
  {
    id: 'scenario-100',
    questionNumber: 100,
    topic: 'Exam Strategy',
    stem: 'A student wants one final rule of thumb for this scenario-based section of the site. Which answer best reflects the absorbed materials and overall prep logic?',
    choices: [
      { id: 'A', text: 'Choose the answer that seems fastest, even if it skips required process steps.' },
      { id: 'B', text: 'Start by identifying the acquisition phase, the controlling topic, and the process logic before choosing an answer.' },
      { id: 'C', text: 'Pick whichever answer mentions the most forms.' },
      { id: 'D', text: 'Always choose the option that names the incumbent contractor.' }
    ],
    correctChoiceId: 'B',
    explanation: 'The absorbed course and prep materials consistently point toward phase-based, process-based reasoning rather than guessing from isolated wording.',
    sourceSet: 'con3990v-scenario-bank-s1-s3',
    batch: 'part-2',
    difficulty: 'easy'
  }
];
