/**
 * bib.gbt7714's (cite/cite) presets.
 */
import type { Preset } from '../../../schema/params.ts';

export const PRESETS = {
  cite: {
    description: 'A GB/T 7714 citation, \\cite{key}: a superscript [1] (or [1], or Author, Year, as the list sets the mode).',
    features: ['numeric-citations', 'superscript'],
    params: {},
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0578-monetjoe-latex-paper-templates/finalversion.tex', line: '141' }],
  },
  citep: {
    description: "natbib's \\citep{key} beside the GB/T 7714 list: the citation in brackets.",
    writes: '\\citep{…}',
    features: ['numeric-citations', 'author-year'],
    params: { command: 'citep' },
    evidence: [{ kind: 'manual', of: 'gbt7714', section: 'citation commands (natbib\'s \\citep, \\citet)', url: 'https://ctan.org/pkg/gbt7714' }],
  },
  citet: {
    description: "natbib's \\citet{key} beside the GB/T 7714 list: the author part of the sentence.",
    writes: '\\citet{…}',
    features: ['author-year'],
    params: { command: 'citet' },
    evidence: [{ kind: 'manual', of: 'gbt7714', section: 'citation commands (natbib\'s \\citep, \\citet)', url: 'https://ctan.org/pkg/gbt7714' }],
  },
} as const satisfies { readonly [name: string]: Preset };
