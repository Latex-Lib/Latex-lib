/**
 * tbl.booktabs's presets, each from the templates that use it (`node seed.ts tbl --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  classic: {
    description: 'booktabs at its defaults: \\toprule, \\midrule under the header row, \\bottomrule, no vertical rules, equal columns.',
    features: ['floating', 'captioned', 'booktabs-rules'],
    params: {},
    evidence: [solution('0001-digital-minimal', '64'), solution('0015-malaysian-journal-of-mathematical-scienc', '32')],
  },
  'left-columns': {
    description: 'The booktabs rules with left-aligned columns (ll), as KOMA\'s guide sets its tables, here ragged-right p-columns sharing the line so a cell wraps.',
    features: ['floating', 'captioned', 'booktabs-rules'],
    params: { colspec: 'l' },
    evidence: [solution('0020-koma-script', '66'), solution('0240-ksp-thesis', '52')],
  },
  spaced: {
    description: 'Space between every body row (\\addlinespace), the booktabs rules, a smaller size.',
    features: ['floating', 'captioned', 'booktabs-rules'],
    params: { rowSpace: true, fontSize: '\\small' },
    evidence: [manual('booktabs', 'the commands: \\addlinespace')],
  },
  heavy: {
    description: 'Heavier top and bottom rules (\\heavyrulewidth 1pt) over a light 0.5pt mid rule.',
    features: ['floating', 'captioned', 'booktabs-rules'],
    params: { heavyRule: '1pt', lightRule: '0.5pt' },
    evidence: [manual('booktabs', 'rule widths: \\heavyrulewidth, \\lightrulewidth')],
  },
} as const satisfies { readonly [name: string]: Preset };
