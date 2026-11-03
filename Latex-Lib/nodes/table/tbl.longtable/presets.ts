/**
 * tbl.longtable's presets, each from the templates that use it (`node seed.ts tbl --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  'repeat-header': {
    description: 'A table that breaks across pages, its caption first, the header row repeated at the top of every page (\\endfirsthead, \\endhead), ruled grid.',
    features: ['page-breaking', 'captioned', 'vertical-rules', 'horizontal-rules'],
    params: {},
    evidence: [solution('0044-long-invoice', '45')],
  },
  booktabs: {
    description: 'The long table with booktabs rules and left-aligned columns (ragged-right p-columns sharing the line, so a cell wraps), the header repeated, "continued" at the foot of each broken page.',
    features: ['page-breaking', 'captioned', 'booktabs-rules'],
    params: { rules: 'booktabs', colspec: 'l', vrules: false, continued: true },
    evidence: [solution('0020-koma-script', '66'), manual('longtable', 'heads and feet: \\endfirsthead, \\endhead, \\endfoot, \\endlastfoot')],
  },
  plain: {
    description: 'Rows only, no repeated header and no rules: a list that may run over pages.',
    features: ['page-breaking', 'captioned'],
    params: { rules: 'none', vrules: false, repeatHeader: false },
    evidence: [solution('0104-sjtutex', '94')],
  },
} as const satisfies { readonly [name: string]: Preset };
