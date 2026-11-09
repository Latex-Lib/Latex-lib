/**
 * cols.tikzposter's presets, each from the posters that use it (the research's Solution files and their sources).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  equal: {
    description: 'Poster columns of equal width, \\column{0.33} \\column{0.34} \\column{0.33} for three, \\column{0.5} for two, the blocks shared out in order.',
    features: ['parallel-columns'],
    params: {},
    evidence: [solution('0436-jacobs-landscape-poster', '36'), solution('0707-tu-delft-poster', '37'), solution('0429-ndpvt-web-latex-document-skill', '53')],
  },
  'wide-middle': {
    description: 'Three poster columns with a wider middle one for the main results, \\column{0.30} \\column{0.40} \\column{0.30}.',
    features: ['parallel-columns', 'unequal-widths'],
    params: { widths: 'wide-middle' },
    evidence: [{ kind: 'source', file: `${SOURCE}/0429-ndpvt-web-latex-document-skill/assets/templates/poster-landscape.tex`, line: '9, 113-118, 190, 287' }],
  },
  'quarter-half-quarter': {
    description: 'Three poster columns, the middle one half the width, \\column{0.25} \\column{0.5} \\column{0.25}.',
    features: ['parallel-columns', 'unequal-widths'],
    params: { widths: '0.25,0.5,0.25' },
    evidence: [{ kind: 'source', file: `${SOURCE}/0368-sjijon-tex-templates/Tikzposter posters/Simple poster - Landscape/simple-poster-landscape.tex`, line: '77-78, 136, 184, 209' }],
  },
  'wide-first': {
    description: 'Two poster columns, a wide first one and a narrow second, \\column{0.65} \\column{0.35}.',
    features: ['parallel-columns', 'unequal-widths'],
    params: { widths: '0.65,0.35' },
    evidence: [{ kind: 'source', file: `${SOURCE}/0368-sjijon-tex-templates/Tikzposter posters/Simple poster - Landscape/simple-poster-landscape.tex`, line: '218-219, 232, 241' }],
  },
} as const satisfies { readonly [name: string]: Preset };
