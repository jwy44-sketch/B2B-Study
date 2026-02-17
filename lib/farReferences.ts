import type { Question } from './types';

export type FarRef = {
  part: number;
  title: string;
  url: string;
};

export type FarSectionRef = {
  cite: string;
  title: string;
  url: string;
};

export type FarDetail = {
  part: FarRef;
  subpart?: { code: string; title: string; url: string };
  sections: FarSectionRef[];
};

export const farPart = (part: number, title: string): FarRef => ({
  part,
  title,
  url: `https://www.acquisition.gov/far/part-${part}`
});

export const farSubpart = (code: string, title: string) => ({
  code,
  title,
  url: `https://www.acquisition.gov/far/subpart-${code}`
});

export const farSection = (cite: string, title: string): FarSectionRef => ({
  cite,
  title,
  url: `https://www.acquisition.gov/far/${cite}`
});

const FAR_PARTS: Record<number, string> = {
  1: 'Federal Acquisition Regulations System',
  4: 'Administrative Matters',
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

const KEYWORD_TO_PART: Array<{ part: number; keywords: string[] }> = [
  { part: 10, keywords: ['market research'] },
  { part: 13, keywords: ['simplified acquisition', 'sap', 'micro-purchase'] },
  { part: 14, keywords: ['sealed bidding', 'ifb', 'invitation for bids'] },
  { part: 15, keywords: ['rfp', 'competitive range', 'discussions', 'negotiation', 'negotiations', 'proposal'] },
  { part: 16, keywords: ['contract type', 't&m', 'time-and-materials', 'firm-fixed-price', 'cpff', 'cost-reimbursement'] },
  { part: 17, keywords: ['option year', 'exercise an option', 'options'] },
  { part: 33, keywords: ['protest', 'gao', 'claim', 'adr', 'dispute', 'appeal'] },
  { part: 43, keywords: ['modification', 'sf 30', 'change order'] },
  { part: 44, keywords: ['subcontracting', 'subcontractor', 'privity'] },
  { part: 45, keywords: ['government property', 'property'] },
  { part: 46, keywords: ['quality assurance', 'inspection', 'acceptance', 'nonconforming'] },
  { part: 49, keywords: ['termination for cause', 'termination for default', 'termination for convenience', 'termination'] },
  { part: 6, keywords: ['competition', 'full and open'] },
  { part: 12, keywords: ['commercial item', 'commercial products', 'commercial services'] },
  { part: 4, keywords: ['contract files', 'administrative', 'piid'] },
  { part: 1, keywords: ['delegation of authority', 'far part 1', 'federal acquisition regulations system'] }
];

const scenarioDetailById: Record<string, FarDetail> = {
  'con3910-151': { part: farPart(13, 'Simplified Acquisition Procedures'), sections: [farSection('13.104', 'Promoting competition'), farSection('13.106-1', 'Soliciting competition')] },
  'con3910-152': { part: farPart(6, 'Competition Requirements'), sections: [farSection('6.302-2', 'Unusual and compelling urgency'), farSection('6.303', 'Justifications')] },
  'con3910-153': { part: farPart(43, 'Contract Modifications'), sections: [farSection('43.103', 'Types of contract modifications')] },
  'con3910-154': { part: farPart(6, 'Competition Requirements'), sections: [farSection('6.302-1', 'Only one responsible source'), farSection('6.303', 'Justifications')] },
  'con3910-155': { part: farPart(17, 'Special Contracting Methods'), subpart: farSubpart('17.2', 'Options'), sections: [farSection('17.207', 'Exercise of options')] },
  'con3910-156': { part: farPart(16, 'Types of Contracts'), subpart: farSubpart('16.6', 'Time-and-Materials, Labor-Hour, and Letter Contracts'), sections: [farSection('16.601', 'Time-and-materials contracts')] },
  'con3910-157': { part: farPart(1, 'Federal Acquisition Regulations System'), sections: [farSection('1.602-2', 'Responsibilities'), farSection('43.103', 'Types of contract modifications')] },
  'con3910-158': { part: farPart(15, 'Contracting by Negotiation'), subpart: farSubpart('15.3', 'Source Selection'), sections: [farSection('15.000', 'Scope of part')] },
  'con3910-159': { part: farPart(33, 'Protests, Disputes, and Appeals'), sections: [farSection('33.104', 'Protests to GAO')] },
  'con3910-160': { part: farPart(12, 'Acquisition of Commercial Products and Commercial Services'), sections: [farSection('12.102', 'Applicability')] },
  'con3910-161': { part: farPart(10, 'Market Research'), sections: [farSection('10.001', 'Policy'), farSection('10.002', 'Procedures')] },
  'con3910-162': { part: farPart(13, 'Simplified Acquisition Procedures'), sections: [farSection('13.104', 'Promoting competition')] },
  'con3910-163': { part: farPart(15, 'Contracting by Negotiation'), sections: [farSection('15.101-1', 'Tradeoff process')] },
  'con3910-164': { part: farPart(16, 'Types of Contracts'), sections: [farSection('16.103', 'Negotiating contract type')] },
  'con3910-165': { part: farPart(6, 'Competition Requirements'), sections: [farSection('6.101', 'Policy')] },
  'con3910-166': { part: farPart(12, 'Acquisition of Commercial Products and Commercial Services'), sections: [farSection('12.102', 'Applicability')] },
  'con3910-167': { part: farPart(15, 'Contracting by Negotiation'), subpart: farSubpart('15.2', 'Solicitation and Receipt of Proposals and Information'), sections: [farSection('15.206', 'Amending the solicitation')] },
  'con3910-168': { part: farPart(43, 'Contract Modifications'), sections: [farSection('43.103', 'Types of contract modifications'), farSection('6.101', 'Policy')] },
  'con3910-169': { part: farPart(6, 'Competition Requirements'), sections: [farSection('6.302-2', 'Unusual and compelling urgency')] },
  'con3910-170': { part: farPart(33, 'Protests, Disputes, and Appeals'), sections: [farSection('33.104', 'Protests to GAO')] },
  'con3910-171': { part: farPart(10, 'Market Research'), sections: [farSection('10.002', 'Procedures')] },
  'con3910-172': { part: farPart(13, 'Simplified Acquisition Procedures'), sections: [farSection('13.106-1', 'Soliciting competition')] },
  'con3910-173': { part: farPart(15, 'Contracting by Negotiation'), sections: [farSection('15.306', 'Exchanges with offerors after receipt of proposals')] },
  'con3910-174': { part: farPart(16, 'Types of Contracts'), sections: [farSection('16.103', 'Negotiating contract type')] },
  'con3910-175': { part: farPart(12, 'Acquisition of Commercial Products and Commercial Services'), sections: [farSection('12.301', 'Solicitation provisions and contract clauses for acquisition of commercial products and commercial services')] },
  'con3910-176': { part: farPart(43, 'Contract Modifications'), sections: [farSection('43.103', 'Types of contract modifications')] },
  'con3910-177': { part: farPart(10, 'Market Research'), sections: [farSection('10.002', 'Procedures'), farSection('6.302-1', 'Only one responsible source')] },
  'con3910-178': { part: farPart(15, 'Contracting by Negotiation'), sections: [farSection('15.308', 'Source selection decision')] },
  'con3910-179': { part: farPart(17, 'Special Contracting Methods'), sections: [farSection('17.207', 'Exercise of options')] },
  'con3910-180': { part: farPart(33, 'Protests, Disputes, and Appeals'), subpart: farSubpart('33.2', 'Disputes and Appeals'), sections: [farSection('33.204', 'Policy')] }
};

export const inferFarRef = (questionText: string): FarRef => {
  const haystack = questionText.toLowerCase();
  for (const rule of KEYWORD_TO_PART) {
    if (rule.keywords.some((kw) => haystack.includes(kw))) {
      return farPart(rule.part, FAR_PARTS[rule.part]);
    }
  }
  return farPart(1, `${FAR_PARTS[1]} (primary)`);
};

export const inferFarDetail = (questionId: string, questionText: string): FarDetail => {
  if (scenarioDetailById[questionId]) return scenarioDetailById[questionId];
  const part = inferFarRef(questionText);
  return { part, sections: [] };
};

export const getFarReference = (question: Question): { partNumber: number; partTitle: string; url: string } => {
  const ref = inferFarRef(`${question.prompt} ${question.choices.join(' ')}`);
  return {
    partNumber: ref.part,
    partTitle: ref.title,
    url: ref.url
  };
};
