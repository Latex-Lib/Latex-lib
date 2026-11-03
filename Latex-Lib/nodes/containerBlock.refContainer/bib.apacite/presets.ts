/**
 * bib.apacite's presets, each from the templates that use it (`node seed.ts bib --rows`) and the manual.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  apa: {
    description: 'APA author-year citations and reference list, \\bibliographystyle{apacite}, the list under its own heading.',
    features: ['author-year', 'external-tool'],
    params: { heading: 'References' },
    evidence: [solution('0469-latex-brochure', '67')],
  },
  'natbib-commands': {
    description: "apacite's list with natbib's citation commands (\\citep, \\citet) through the natbibapa option.",
    features: ['author-year', 'external-tool'],
    params: { natbib: true },
    evidence: [manual('apacite', 'option natbibapa')],
  },
} as const satisfies { readonly [name: string]: Preset };
