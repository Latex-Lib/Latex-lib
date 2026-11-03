/**
 * toc.kernel's presets, each from the templates that use it (`node seed.ts toc --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  kernel: {
    description: "The kernel's \\tableofcontents at the class's depth.",
    features: [],
    params: {},
    evidence: [solution('0108-lix', '48'), solution('0006-gsemthesis', '33')],
  },
  'with-lists': {
    description: 'The contents, then the list of figures and the list of tables (\\listoffigures, \\listoftables).',
    features: ['lists-of-floats'],
    params: { lists: 'both' },
    evidence: [solution('0003-ucsmonograph', '62'), solution('0008-envlab', '39'), solution('0018-fhj-script', '68')],
  },
  'thesis-pages': {
    description: 'Contents and lists each on pages of their own, \\cleardoublepage after each (theses).',
    features: ['lists-of-floats', 'odd-page'],
    params: { lists: 'both', after: 'cleardoublepage' },
    evidence: [solution('0002-ulth-se-universit-laval-thesis', '41')],
  },
  shallow: {
    description: 'Only sections and subsections in the contents (\\setcounter{tocdepth}{2}), a new page after it.',
    features: ['flat-contents'],
    params: { depth: 2, after: 'newpage' },
    evidence: [solution('0201-nova-thesis-starter', '84'), solution('0108-lix', '48')],
  },
} as const satisfies { readonly [name: string]: Preset };
