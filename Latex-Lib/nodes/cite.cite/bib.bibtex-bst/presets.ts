/**
 * bib.bibtex-bst's (cite/cite) presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  cite: {
    description: "The kernel's \\cite{key}, its label from the style ([1], [Knu84]).",
    features: ['numeric-citations'],
    params: {},
    evidence: [solution('0524-doem97-ntu-eee-msc-dissertation-template', '76')],
  },
  tied: {
    description: 'The citation tied to the word before it so a line never breaks between them (~\\cite{key}).',
    features: ['numeric-citations'],
    params: { tie: true },
    evidence: [solution('0023-korigamik-assignment', '36')],
  },
} as const satisfies { readonly [name: string]: Preset };
