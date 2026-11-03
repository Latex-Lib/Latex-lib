/**
 * thm.kernel's presets, each from the templates that use it (`node seed.ts thm --rows`).
 */
import type { Preset } from '../../../schema/params.ts';

const solution = (file: string, lines: string) => ({ kind: 'solution', file: `Solution/${file}.md`, lines }) as const;

export const PRESETS = {
  global: {
    description: "The kernel's \\newtheorem, each kind on its own counter through the document: bold head, italic body (Theorem 1, Lemma 1).",
    features: ['numbered', 'bold-head', 'italic-body'],
    params: { numberWithin: 'none', sharedCounter: false },
    evidence: [solution('0771-smf-mathematics-article', '37'), solution('0532-sciposter', '51'), solution('0876-huangyxi-whutmod', '53')],
  },
  shared: {
    description: "Every kind on the theorem's counter, through the document (Theorem 1, Lemma 2).",
    features: ['numbered', 'shared-counter', 'bold-head', 'italic-body'],
    params: { numberWithin: 'none', sharedCounter: true },
    evidence: [solution('0209-unamthesis', '58'), solution('0307-ifac', '63')],
  },
  section: {
    description: "Every kind on the theorem's counter, numbered within the section (Theorem 2.1).",
    features: ['numbered', 'numbered-within', 'shared-counter', 'bold-head', 'italic-body'],
    params: { numberWithin: 'section', sharedCounter: true },
    evidence: [solution('0401-erfnzdeh-sharif-course-project-report-te', '52')],
  },
  chapter: {
    description: 'Each kind numbered within the chapter.',
    features: ['numbered', 'numbered-within', 'bold-head', 'italic-body'],
    params: { numberWithin: 'chapter', sharedCounter: false },
    evidence: [solution('0940-science-textbook-template', '52')],
  },
} as const satisfies { readonly [name: string]: Preset };
