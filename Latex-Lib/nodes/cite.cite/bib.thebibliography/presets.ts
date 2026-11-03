/**
 * bib.thebibliography's (cite/cite) presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  cite: {
    description: "The kernel's \\cite{key}, numbered by the hand-written list.",
    features: ['numeric-citations', 'hand-written'],
    params: {},
    evidence: [solution('0070-ntgclass', '47')],
  },
} as const satisfies { readonly [name: string]: Preset };
