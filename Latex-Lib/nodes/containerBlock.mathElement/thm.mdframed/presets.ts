/**
 * thm.mdframed's presets, each from the templates that use it (`node seed.ts thm --rows`).
 */
import type { Preset } from '../../../schema/params.ts';

const solution = (file: string, lines: string) => ({ kind: 'solution', file: `Solution/${file}.md`, lines }) as const;

export const PRESETS = {
  framed: {
    description: 'A thin blue frame on a light blue background, margins 13pt above, 7pt below, 5pt left, 6pt right (the templates name their own blue, mittelblau; blue!60!black stands for it).',
    features: ['framed', 'background', 'colored', 'breakable', 'numbered', 'numbered-within', 'shared-counter'],
    params: {
      linecolor: 'blue!60!black',
      backgroundcolor: 'blue!60!black!10',
      linewidth: '1pt',
      extra: 'innertopmargin=13pt,innerbottommargin=7pt,innerleftmargin=5pt,innerrightmargin=6pt',
    },
    evidence: [solution('0315-valentjn-uni-stuttgart-phdthesis-templat', '101'), solution('0800-valentjn-thesis-arxiv', '108')],
  },
  thick: {
    description: 'A black 1.5pt frame, no background.',
    features: ['framed', 'breakable', 'numbered', 'numbered-within', 'shared-counter'],
    params: { linecolor: 'black', backgroundcolor: 'white', linewidth: '1.5pt' },
    evidence: [solution('0667-rbt-mathnotes', '54')],
  },
} as const satisfies { readonly [name: string]: Preset };
