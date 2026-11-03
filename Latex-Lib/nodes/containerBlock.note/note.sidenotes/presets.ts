/**
 * note.sidenotes's presets, each from the templates that use it (`node seed.ts note --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  floating: {
    description: "Tufte's numbered side notes: \\sidenote{…}, a superscript number in the text and the note beside it in the margin, floating so notes do not overlap.",
    features: ['margin-note', 'numbered', 'superscript'],
    params: {},
    evidence: [solution('0825-tufte-essay', '34'), solution('0087-xtufte', '37'), solution('0068-kaobook', '81')],
  },
  fixed: {
    description: 'A numbered side note fixed beside its line, \\sidenote[][0pt]{…} (an offset of 0 pins it instead of letting it float).',
    features: ['margin-note', 'numbered', 'superscript'],
    params: { offset: '0pt' },
    evidence: [solution('0793-xtufte', '65')],
  },
} as const satisfies { readonly [name: string]: Preset };
