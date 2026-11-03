/**
 * bib.bibtex-bst's presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  plain: {
    description: 'BibTeX\'s plain style: numbered [1], sorted by author, the entries in \\jobname.bib.',
    features: ['numeric-citations', 'external-tool'],
    params: {},
    evidence: [solution('0023-korigamik-assignment', '36'), solution('0082-uiucthesis', '43')],
  },
  unsrt: {
    description: 'Numbered in the order the works are first cited (unsrt).',
    features: ['numeric-citations', 'external-tool'],
    params: { bst: 'unsrt' },
    evidence: [solution('0108-lix', '63'), solution('0524-doem97-ntu-eee-msc-dissertation-template', '77')],
  },
  alpha: {
    description: 'Labels from the authors and year, [Knu84] (alpha).',
    features: ['external-tool'],
    params: { bst: 'alpha' },
    evidence: [solution('0052-muthesis', '58'), solution('0185-memhfixc', '71')],
  },
  ieeetr: {
    description: 'IEEE transactions style, numbered in citation order (ieeetr).',
    features: ['numeric-citations', 'external-tool'],
    params: { bst: 'ieeetr' },
    evidence: [solution('0005-cococo2000-ict-beamer', '60'), solution('0370-aremju-latex-template', '66')],
  },
  apalike: {
    description: 'Author and year labels in the APA manner (apalike), the list under its own heading.',
    features: ['author-year', 'external-tool'],
    params: { bst: 'apalike' },
    evidence: [solution('0002-ulth-se-universit-laval-thesis', '48'), solution('0012-basic-academic-journal-article', '68')],
  },
} as const satisfies { readonly [name: string]: Preset };
