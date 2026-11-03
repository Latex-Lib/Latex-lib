/**
 * thm.amsthm's presets, each from the templates that use it (`node seed.ts thm --rows`).
 */
import type { Preset } from '../../../schema/params.ts';

const solution = (file: string, lines: string) => ({ kind: 'solution', file: `Solution/${file}.md`, lines }) as const;

export const PRESETS = {
  'ams-section': {
    description: 'The AMS classic: plain statements with an italic body, definitions and examples upright, remarks in the remark style, all on one counter numbered within the section (Theorem 2.1, Lemma 2.2).',
    features: ['numbered', 'numbered-within', 'shared-counter', 'bold-head', 'italic-body'],
    params: { style: 'ams', numberWithin: 'section', sharedCounter: true },
    evidence: [solution('0260-amsproc', '49'), solution('0207-tandf-interact', '63'), solution('0398-simple-article', '41')],
  },
  chapter: {
    description: 'The AMS styles on one counter numbered within the chapter, as theses number them (Theorem 3.4).',
    features: ['numbered', 'numbered-within', 'shared-counter', 'bold-head', 'italic-body'],
    params: { style: 'ams', numberWithin: 'chapter', sharedCounter: true },
    evidence: [solution('0083-ntu-thesis', '65'), solution('0218-phd-thesis-southampton', '53'), solution('0325-edinburgh-maths-thesis-edmaths', '48')],
  },
  global: {
    description: "Every kind in amsthm's plain style, each on its own counter running through the document (Theorem 1, Lemma 1).",
    features: ['numbered', 'bold-head', 'italic-body'],
    params: { style: 'plain', numberWithin: 'none', sharedCounter: false },
    evidence: [solution('0319-ijcai', '63'), solution('0113-beamer-presentation', '56'), solution('0168-temat-article', '35')],
  },
  upright: {
    description: "Every kind in amsthm's definition style, upright body, on one counter within the section.",
    features: ['numbered', 'numbered-within', 'shared-counter', 'bold-head', 'upright-body'],
    params: { style: 'definition', numberWithin: 'section', sharedCounter: true },
    evidence: [solution('0222-sara-venkatraman-latex-templates', '93')],
  },
  'colored-head': {
    description: 'A style of its own (\\newtheoremstyle): bold head in an accent colour, a colon after it, italic body, 0.75em above and below.',
    features: ['numbered', 'numbered-within', 'shared-counter', 'bold-head', 'italic-body', 'colored', 'custom-head'],
    params: {
      style: 'custom',
      numberWithin: 'section',
      sharedCounter: true,
      spaceAbove: '0.75em',
      spaceBelow: '0.75em',
      bodyFont: '\\itshape',
      headFont: '\\bfseries',
      headColor: 'blue!50!black',
      headPunct: ':',
      headSpace: '0.5em',
    },
    evidence: [solution('0318-stem-assignment-template', '64'), solution('0180-simple-thesis-dissertation', '73')],
  },
} as const satisfies { readonly [name: string]: Preset };
