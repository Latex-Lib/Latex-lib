/**
 * list.scrextend's presets, each from the templates that use it (`node seed.ts list --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  labeling: {
    description: "KOMA's labeling list for descriptions: the labels in a column as wide as the widest pattern, the text aligned after them.",
    features: ['aligned-labels'],
    params: {},
    evidence: [solution('0841-ijsra', '56')],
  },
  'colon-bold': {
    description: 'Bold labels with a colon after each (\\begin{labeling}[:]{…}, the labelinglabel font element), as the KOMA guide sets its examples.',
    features: ['aligned-labels', 'bold-head'],
    params: { separator: ':', labelFont: '\\bfseries' },
    evidence: [solution('0020-koma-script', '69')],
  },
} as const satisfies { readonly [name: string]: Preset };
