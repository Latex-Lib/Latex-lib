/**
 * toc.koma's presets, each from the templates that use it (`node seed.ts toc --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  flat: {
    description: 'KOMA\'s flat contents, every entry flush left with its number in a column (\\KOMAoptions{toc=flat}).',
    features: ['flat-contents'],
    params: {},
    evidence: [solution('0236-hu-berlin-bundle', '59')],
  },
  graduated: {
    description: "KOMA's graduated contents, each level indented under the one above (toc=graduated).",
    features: [],
    params: { layout: 'graduated' },
    evidence: [solution('0582-biblatex-juradiss', '31')],
  },
  'with-entries': {
    description: 'The bibliography and the lists of figures and tables entered in the contents (toc=bibliography, toc=listof).',
    features: ['in-contents', 'lists-of-floats'],
    params: { entries: 'bibliography,listof' },
    evidence: [solution('0020-koma-script', '51'), solution('0315-valentjn-uni-stuttgart-phdthesis-templat', '85')],
  },
} as const satisfies { readonly [name: string]: Preset };
