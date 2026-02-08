import type { Question } from './types';

export type FarReference = {
  partNumber: number;
  partTitle: string;
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
  33: 'Protests, Disputes, and Appeals',
  43: 'Contract Modifications',
  44: 'Subcontracting Policies and Procedures',
  45: 'Government Property',
  46: 'Quality Assurance',
  49: 'Termination of Contracts'
};

const partUrl = (partNumber: number) => `https://www.acquisition.gov/far/part-${partNumber}`;

const KEYWORD_TO_PART: Array<{ partNumber: number; keywords: string[] }> = [
  { partNumber: 10, keywords: ['market research'] },
  { partNumber: 13, keywords: ['simplified acquisition', 'sap', 'micro-purchase'] },
  { partNumber: 14, keywords: ['sealed bidding', 'ifb', 'invitation for bids'] },
  { partNumber: 15, keywords: ['rfp', 'competitive range', 'discussions', 'negotiation', 'negotiations', 'proposal revisions'] },
  { partNumber: 16, keywords: ['contract type', 't&m', 'time-and-materials', 'firm-fixed-price', 'cpff', 'cost-reimbursement'] },
  { partNumber: 33, keywords: ['protest', 'gao', 'claim', 'adr', 'dispute', 'appeal'] },
  { partNumber: 43, keywords: ['modification', 'sf 30', 'change order'] },
  { partNumber: 44, keywords: ['subcontracting', 'subcontractor', 'privity'] },
  { partNumber: 45, keywords: ['government property', 'property administrator'] },
  { partNumber: 46, keywords: ['quality assurance', 'inspection', 'acceptance', 'nonconforming'] },
  { partNumber: 49, keywords: ['termination for cause', 'termination for default', 'termination for convenience', 'termination'] },
  { partNumber: 6, keywords: ['competition', 'full and open'] },
  { partNumber: 12, keywords: ['commercial item', 'commercial products', 'commercial services'] },
  { partNumber: 4, keywords: ['contract files', 'administrative', 'piid'] },
  { partNumber: 1, keywords: ['delegation of authority', 'far part 1', 'federal acquisition regulations system'] }
];

export function getFarReference(question: Question): FarReference {
  const haystack = `${question.prompt} ${question.choices.join(' ')}`.toLowerCase();

  for (const rule of KEYWORD_TO_PART) {
    if (rule.keywords.some((kw) => haystack.includes(kw))) {
      return {
        partNumber: rule.partNumber,
        partTitle: FAR_PARTS[rule.partNumber],
        url: partUrl(rule.partNumber)
      };
    }
  }

  return {
    partNumber: 1,
    partTitle: `${FAR_PARTS[1]} (primary)`,
    url: partUrl(1)
  };
}
