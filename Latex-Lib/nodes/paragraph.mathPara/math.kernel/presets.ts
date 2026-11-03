/**
 * math.kernel's (paragraph/mathPara) presets: one display row as written.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  row: {
    description: 'One row of display maths as written, with its \\label.',
    features: [],
    params: {},
    evidence: [solution('0544-china2e', '37')],
  },
} as const satisfies { readonly [name: string]: Preset };
