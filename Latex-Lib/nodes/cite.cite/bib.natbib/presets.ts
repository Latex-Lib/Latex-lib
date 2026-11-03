/**
 * bib.natbib's (cite/cite) presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  parenthetical: {
    description: "natbib's \\citep{key}: (Knuth, 1984) or [1].",
    features: ['author-year'],
    params: {},
    evidence: [solution('0002-ulth-se-universit-laval-thesis', '47'), solution('0083-ntu-thesis', '79')],
  },
  textual: {
    description: "natbib's \\citet{key}: Knuth (1984), the author part of the sentence.",
    features: ['author-year'],
    params: { command: 'citet' },
    evidence: [solution('0094-nostarch', '46'), solution('0141-msu-thesis', '40')],
  },
} as const satisfies { readonly [name: string]: Preset };
