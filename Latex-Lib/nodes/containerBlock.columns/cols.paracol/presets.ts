/**
 * cols.paracol's presets, each from the templates that use it (`node seed.ts cols --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  equal: {
    description: 'Parallel columns of equal width side by side, the blocks shared out in order (\\begin{paracol}{2} … \\switchcolumn …).',
    features: ['parallel-columns'],
    params: {},
    evidence: [solution('0022-lucid-cv', '31')],
  },
  'cv-ratio': {
    description: 'A wide main column and a narrow side column, 0.65 of the width to the first (\\columnratio{0.65}).',
    features: ['parallel-columns', 'unequal-widths'],
    params: { ratio: '0.65' },
    evidence: [solution('0022-lucid-cv', '31')],
  },
  ruled: {
    description: 'Equal parallel columns with a thin grey rule between them (\\columnseprule, \\colseprulecolor).',
    features: ['parallel-columns', 'column-rule'],
    params: { rule: '0.4pt', ruleColor: 'gray' },
    evidence: [manual('paracol', 'column-separating rules: \\colseprulecolor')],
  },
} as const satisfies { readonly [name: string]: Preset };
