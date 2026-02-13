import type { Question } from './types';

export type FarRef = {
  part: number;
  title: string;
  url: string;
};

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

const partUrl = (part: number) => `https://www.acquisition.gov/far/part-${part}`;

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

export const inferFarRef = (questionText: string): FarRef => {
  const haystack = questionText.toLowerCase();
  for (const rule of KEYWORD_TO_PART) {
    if (rule.keywords.some((kw) => haystack.includes(kw))) {
      return { part: rule.part, title: FAR_PARTS[rule.part], url: partUrl(rule.part) };
    }
  }
  return { part: 1, title: `${FAR_PARTS[1]} (primary)`, url: partUrl(1) };
};

export const getFarReference = (question: Question): { partNumber: number; partTitle: string; url: string } => {
  const ref = inferFarRef(`${question.prompt} ${question.choices.join(' ')}`);
  return {
    partNumber: ref.part,
    partTitle: ref.title,
    url: ref.url
  };
};
