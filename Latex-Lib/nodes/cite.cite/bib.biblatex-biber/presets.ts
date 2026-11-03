/**
 * bib.biblatex-biber's (cite/cite) presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  autocite: {
    description: "biblatex's \\autocite{key}, which the style turns into its own citation form.",
    features: ['numeric-citations'],
    params: {},
    evidence: [solution('0006-gsemthesis', '35')],
  },
  textual: {
    description: "biblatex's \\textcite{key}: Knuth [1] or Knuth (1984) as part of the sentence.",
    features: ['author-year'],
    params: { command: 'textcite' },
    evidence: [solution('0153-komacv', '57')],
  },
  footnote: {
    description: "biblatex's \\footcite{key}: the citation in a footnote.",
    features: [],
    params: { command: 'footcite' },
    evidence: [solution('0064-korogodin-nslreport', '77')],
  },
} as const satisfies { readonly [name: string]: Preset };
