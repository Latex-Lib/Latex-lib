/**
 * bib.biblatex-bibtex's (cite/cite) presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  autocite: {
    description: "biblatex's \\autocite{key}, which the style turns into its own citation form.",
    features: ['numeric-citations'],
    params: {},
    evidence: [solution('0642-elegantnote', '41')],
  },
  parenthetical: {
    description: "biblatex's \\parencite{key}: the citation in brackets.",
    features: ['author-year'],
    params: { command: 'parencite' },
    evidence: [solution('0164-coursework-term-paper', '47')],
  },
  textual: {
    description: "biblatex's \\textcite{key}, the author part of the sentence.",
    features: ['author-year'],
    params: { command: 'textcite' },
    evidence: [solution('0700-lectures', '73')],
  },
} as const satisfies { readonly [name: string]: Preset };
