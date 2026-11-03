/**
 * thm.thmtools's presets, each from the templates that use it (`node seed.ts thm --rows`).
 */
import type { Preset } from '../../../schema/params.ts';

const solution = (file: string, lines: string) => ({ kind: 'solution', file: `Solution/${file}.md`, lines }) as const;

export const PRESETS = {
  kao: {
    description: "kaobook's: no punctuation after the head, half an em after it, italic body for theorems and upright for definitions, examples and remarks; one counter within the section.",
    features: ['numbered', 'numbered-within', 'shared-counter', 'bold-head', 'italic-body'],
    params: { headPunct: '', postHeadSpace: '.5em plus .1em minus .1em', bodyFont: '\\normalfont\\itshape', uprightKinds: true, numberWithin: 'section', sharedCounter: true },
    evidence: [solution('0068-kaobook', '108'), solution('0068-kaobook', '109')],
  },
  beauty: {
    description: 'Tight: 3pt above and below, bold head, upright body, a full stop after the head, a coloured filled square at the end.',
    features: ['numbered', 'numbered-within', 'shared-counter', 'bold-head', 'upright-body', 'qed-mark', 'colored'],
    params: { spaceAbove: '3pt', spaceBelow: '3pt', headFont: '\\normalfont\\bfseries', bodyFont: '\\normalfont', headPunct: '.', postHeadSpace: '.5em', qed: '\\color{cyan!40!black}$\\blacksquare$', numberWithin: 'section', sharedCounter: true },
    evidence: [solution('0935-beautybook', '57')],
  },
  chapter: {
    description: 'Italic body, numbered within the chapter, kinds as siblings of the theorem.',
    features: ['numbered', 'numbered-within', 'shared-counter', 'bold-head', 'italic-body'],
    params: { bodyFont: '\\itshape', numberWithin: 'chapter', sharedCounter: true },
    evidence: [solution('0315-valentjn-uni-stuttgart-phdthesis-templat', '99'), solution('0800-valentjn-thesis-arxiv', '106')],
  },
} as const satisfies { readonly [name: string]: Preset };
