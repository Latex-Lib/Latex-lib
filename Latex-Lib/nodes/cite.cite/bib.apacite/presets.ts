/**
 * bib.apacite's (cite/cite) presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  parenthetical: {
    description: "apacite's \\cite{key}: (Knuth, 1984).",
    features: ['author-year'],
    params: {},
    evidence: [solution('0469-latex-brochure', '67')],
  },
  textual: {
    description: "apacite's \\citeA{key}: Knuth (1984).",
    features: ['author-year'],
    params: { command: 'citeA' },
    evidence: [manual('apacite', 'citation commands: \\citeA')],
  },
} as const satisfies { readonly [name: string]: Preset };
