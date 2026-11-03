/**
 * math.amsmath's (paragraph/mathPara) presets: one display row in amsmath's inner environments.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  row: {
    description: 'One row of display maths, in split or gathered when its data.latexStyle asks, with its \\label.',
    features: ['aligned'],
    params: {},
    evidence: [solution('0030-seu-ml-assign', '35'), solution('0107-elsarticle', '50')],
  },
} as const satisfies { readonly [name: string]: Preset };
