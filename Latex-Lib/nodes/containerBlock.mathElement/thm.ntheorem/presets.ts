/**
 * thm.ntheorem's presets, each from the templates that use it (`node seed.ts thm --rows`).
 */
import type { Preset } from '../../../schema/params.ts';

const solution = (file: string, lines: string) => ({ kind: 'solution', file: `Solution/${file}.md`, lines }) as const;

export const PRESETS = {
  'plain-upright': {
    description: "ntheorem's plain style with an upright body and a full stop after the head, numbered within the chapter.",
    features: ['numbered', 'numbered-within', 'bold-head', 'upright-body'],
    params: { style: 'plain', bodyFont: '\\upshape', separator: '.', numberWithin: 'chapter', sharedCounter: false },
    evidence: [solution('0421-albertopessia-latex-book-template', '51'), solution('0675-basic-latex2e-book-template', '45')],
  },
  break: {
    description: "ntheorem's break style: the head on a line of its own, bold, the body upright, a filled square at the end.",
    features: ['numbered', 'numbered-within', 'bold-head', 'break-after-head', 'upright-body', 'qed-mark'],
    params: { style: 'break', headFont: '\\normalfont\\bfseries', bodyFont: '\\normalfont', separator: '', symbol: '\\rule{1ex}{1ex}', numberWithin: 'section', sharedCounter: true },
    evidence: [solution('0832-cai4cai-xclthesistemplate', '65')],
  },
  thesis: {
    description: "ntheorem's plain style numbered within the chapter, an open square at the end of each statement, no separator.",
    features: ['numbered', 'numbered-within', 'bold-head', 'qed-mark'],
    params: { style: 'plain', separator: '', symbol: '$\\square$', numberWithin: 'chapter', sharedCounter: false },
    evidence: [solution('0100-hitszthesis', '60'), solution('0625-nju-thesis-starter', '73')],
  },
} as const satisfies { readonly [name: string]: Preset };
