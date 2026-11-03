/**
 * bib.thebibliography's presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  numbered: {
    description: 'A hand-written list, \\begin{thebibliography}{99} with one \\bibitem{key} per entry; no BibTeX run.',
    features: ['numeric-citations', 'hand-written'],
    params: {},
    evidence: [solution('0070-ntgclass', '47'), solution('0107-elsarticle', '60')],
  },
  'small-tight': {
    description: 'The hand-written list in a smaller size with no space between entries (\\small, \\itemsep 0pt).',
    features: ['numeric-citations', 'hand-written', 'small-type', 'compact'],
    params: { font: '\\small', itemsep: '0pt' },
    evidence: [solution('0003-ucsmonograph', '78')],
  },
  renamed: {
    description: 'The hand-written list under a heading of its own (\\refname, \\bibname).',
    features: ['numeric-citations', 'hand-written'],
    params: { heading: 'Documentation' },
    evidence: [solution('0469-latex-brochure', '67')],
  },
} as const satisfies { readonly [name: string]: Preset };
