/**
 * tbl.threeparttable's presets, each from the templates that use it (`node seed.ts tbl --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  ruled: {
    description: 'Caption and tabular held to the table\'s own width (threeparttable), \\hline above, under the header and below, equal columns sharing the line.',
    features: ['floating', 'captioned', 'horizontal-rules', 'table-notes'],
    params: {},
    evidence: [solution('0030-seu-ml-assign', '71'), solution('0053-zhanghai-zju-csse-undergraduate-design-l', '60')],
  },
  booktabs: {
    description: 'The same width-bound caption over booktabs rules, notes set flush left and in footnote size (flushleft option).',
    writes: '\\begin{threeparttable} \\caption{…}\\label{…} \\begin{tabular}{…} \\toprule … \\\\ \\midrule … \\\\ \\bottomrule \\end{tabular} \\end{threeparttable}',
    features: ['floating', 'captioned', 'booktabs-rules', 'table-notes'],
    params: { rules: 'booktabs', notes: 'flushleft' },
    evidence: [solution('0104-sjtutex', '94')],
  },
} as const satisfies { readonly [name: string]: Preset };
