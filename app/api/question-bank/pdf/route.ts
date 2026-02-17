import { NextRequest } from 'next/server';
import { loadNormalizedQuestionBank } from '@/lib/questionBank';

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_X = 50;
const MARGIN_Y = 50;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN_X * 2);
const TITLE_FONT_SIZE = 16;
const BODY_FONT_SIZE = 11;
const LINE_HEIGHT = 15;
const MAX_EXPLANATION_LENGTH = 700;

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const sanitizeText = (value: string): string => {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
};

const wrapText = (value: string, maxCharsPerLine: number): string[] => {
  const words = value.split(/\s+/).filter(Boolean);
  if (!words.length) return [''];

  const lines: string[] = [];
  let current = words[0];

  for (let i = 1; i < words.length; i += 1) {
    const candidate = `${current} ${words[i]}`;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
    } else {
      lines.push(current);
      current = words[i];
    }
  }

  lines.push(current);
  return lines;
};

const buildPdf = (lines: string[]): Uint8Array => {
  const maxCharsPerLine = Math.floor(CONTENT_WIDTH / (BODY_FONT_SIZE * 0.52));
  const pages: string[][] = [[]];
  let currentPage = 0;
  let y = PAGE_HEIGHT - MARGIN_Y;

  const startNewPage = () => {
    pages.push([]);
    currentPage += 1;
    y = PAGE_HEIGHT - MARGIN_Y;
  };

  const drawLine = (text: string, fontSize = BODY_FONT_SIZE) => {
    if (y <= MARGIN_Y) startNewPage();
    pages[currentPage].push(`BT /F1 ${fontSize} Tf 1 0 0 1 ${MARGIN_X} ${y} Tm (${sanitizeText(text)}) Tj ET`);
    y -= LINE_HEIGHT;
  };

  drawLine('B2B Study — Question Bank', TITLE_FONT_SIZE);
  drawLine(`Generated: ${new Date().toISOString()}`);
  drawLine('');

  lines.forEach((line) => {
    const wrapped = wrapText(line, maxCharsPerLine);
    wrapped.forEach((wrappedLine) => drawLine(wrappedLine));
  });

  const objects: string[] = [];
  const pageObjectNumbers: number[] = [];

  let objectIndex = 1;
  const catalogObject = objectIndex;
  objectIndex += 1;
  const pagesObject = objectIndex;
  objectIndex += 1;

  pages.forEach((pageCommands) => {
    const contentObject = objectIndex;
    objectIndex += 1;
    const pageObject = objectIndex;
    objectIndex += 1;

    const contentStream = pageCommands.join('\n');
    objects[contentObject] = `${contentObject} 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`;
    objects[pageObject] = `${pageObject} 0 obj\n<< /Type /Page /Parent ${pagesObject} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents ${contentObject} 0 R >>\nendobj\n`;
    pageObjectNumbers.push(pageObject);
  });

  objects[pagesObject] = `${pagesObject} 0 obj\n<< /Type /Pages /Count ${pageObjectNumbers.length} /Kids [${pageObjectNumbers.map((num) => `${num} 0 R`).join(' ')}] >>\nendobj\n`;
  objects[catalogObject] = `${catalogObject} 0 obj\n<< /Type /Catalog /Pages ${pagesObject} 0 R >>\nendobj\n`;

  const header = '%PDF-1.4\n';
  let body = header;
  const offsets: number[] = [0];

  for (let i = 1; i < objects.length; i += 1) {
    offsets[i] = body.length;
    body += objects[i];
  }

  const xrefStart = body.length;
  body += `xref\n0 ${objects.length}\n`;
  body += '0000000000 65535 f \n';

  for (let i = 1; i < objects.length; i += 1) {
    body += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }

  body += `trailer\n<< /Size ${objects.length} /Root ${catalogObject} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return new TextEncoder().encode(body);
};

export async function GET(request: NextRequest): Promise<Response> {
  const includeAnswers = request.nextUrl.searchParams.get('includeAnswers') === '1';
  const includeExplanations = request.nextUrl.searchParams.get('includeExplanations') === '1';

  const questions = await loadNormalizedQuestionBank();

  const lines: string[] = [];
  questions.forEach((question, index) => {
    lines.push(`${index + 1}. ${question.stem}`);
    question.choices.forEach((choice, choiceIndex) => {
      const marker = LETTERS[choiceIndex] ?? `${choiceIndex + 1}`;
      lines.push(`   ${marker}. ${choice}`);
    });

    if (includeAnswers && Number.isInteger(question.correctIndex)) {
      const answerLetter = LETTERS[question.correctIndex as number] ?? String((question.correctIndex as number) + 1);
      lines.push(`   Answer: ${answerLetter}`);
    }

    if (includeExplanations && question.explanationText) {
      const trimmed = question.explanationText.slice(0, MAX_EXPLANATION_LENGTH);
      lines.push(`   Explanation: ${trimmed}`);
    }

    lines.push('');
  });

  const bytes = buildPdf(lines);

  return new Response(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="question-bank.pdf"',
      'Cache-Control': 'no-store'
    }
  });
}
