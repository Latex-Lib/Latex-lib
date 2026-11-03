/**
 * xref.kernel's presets, each from the templates that use it (`node seed.ts xref --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  named: {
    description: "The kernel's \\ref{label} after the target's name when the node gives one, tied to it (Figure~\\ref{…}).",
    features: ['named-refs'],
    params: {},
    evidence: [solution('0166-retosmatematicos', '74'), solution('0021-elife', '59')],
  },
  'number-only': {
    description: 'The number alone, \\ref{label}, whatever name the node gives.',
    features: [],
    params: { name: false },
    evidence: [solution('0099-prosper', '55')],
  },
} as const satisfies { readonly [name: string]: Preset };
