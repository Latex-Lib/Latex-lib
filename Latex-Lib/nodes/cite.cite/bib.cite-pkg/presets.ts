/**
 * bib.cite-pkg's (cite/cite) presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  cite: {
    description: '\\cite{key}, several keys sorted and compressed by the cite package ([1-3]).',
    features: ['numeric-citations', 'sorted-compressed'],
    params: {},
    evidence: [solution('0524-doem97-ntu-eee-msc-dissertation-template', '76')],
  },
} as const satisfies { readonly [name: string]: Preset };
