/**
 * box.mdframed's presets, each from the templates that use it (`node seed.ts box --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  titled: {
    description: "mdframed's own frame, one 0.4pt black line drawn with TeX rules, the note's title in bold at the top; it splits across pages.",
    features: ['framed', 'title-bar', 'breakable'],
    params: {},
    evidence: [solution('0142-topletter', '56'), solution('0191-cloze', '57')],
  },
  'gray-rounded': {
    description: 'A light grey panel with a thin grey line and 5pt round corners, drawn with TikZ (framemethod=TikZ).',
    features: ['framed', 'background', 'rounded-corners', 'breakable'],
    params: { method: 'tikz', backgroundColor: 'black!7', lineColor: 'black!30', lineWidth: '.2pt', roundCorner: '5pt' },
    evidence: [solution('0112-sizuhe-latex-templates-library', '87')],
  },
  'left-bar': {
    description: 'Only a coloured line at the left, a tinted back and coloured text (hidealllines, leftline).',
    features: ['left-rule', 'background', 'colored', 'breakable'],
    params: { lines: 'left', backgroundColor: 'tone!10', lineColor: 'tone', lineWidth: '3pt', fontColor: 'tone', title: false },
    evidence: [solution('0021-elife', '57')],
  },
  shadowed: {
    description: 'A tinted box with 10pt round corners, a 1pt coloured line and a drop shadow (TikZ).',
    features: ['framed', 'background', 'rounded-corners', 'shadow', 'colored', 'breakable'],
    params: { method: 'tikz', backgroundColor: 'tone!10', lineColor: 'tone', lineWidth: '1pt', roundCorner: '10pt', shadow: true },
    evidence: [solution('0315-valentjn-uni-stuttgart-phdthesis-templat', '102')],
  },
  'title-rule': {
    description: 'A framed box with a grey title band ruled off from the text (frametitlerule, frametitlebackgroundcolor).',
    features: ['framed', 'title-bar', 'breakable'],
    params: { titleRule: true, titleBackground: 'black!12' },
    evidence: [solution('0184-emersonmello-modelos-latex', '84')],
  },
  unbreakable: {
    description: 'A framed box kept on one page (nobreak=true).',
    features: ['framed', 'title-bar'],
    params: { breakable: false },
    evidence: [solution('0331-egel-uek-latex-thesis-class', '75')],
  },
} as const satisfies { readonly [name: string]: Preset };
