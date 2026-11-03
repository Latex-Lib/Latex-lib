/**
 * tbl.tabularx's presets, each from the templates that use it (`node seed.ts tbl --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  grid: {
    description: 'A table the width of the line, every column an X column sharing the room, | rules and \\hline between rows.',
    features: ['floating', 'captioned', 'full-width', 'vertical-rules', 'horizontal-rules'],
    params: {},
    evidence: [solution('0020-koma-script', '66'), solution('0384-dgut-paper', '54')],
  },
  centered: {
    description: 'Full-width X columns with centred text (>{\\centering\\arraybackslash}X), rules only above, under the header and below.',
    features: ['floating', 'captioned', 'full-width', 'horizontal-rules'],
    params: { align: 'center', vrules: false, rules: 'header' },
    evidence: [solution('0037-hilbert', '65')],
  },
  'label-column': {
    description: 'A natural-width first column (l) and X columns for the rest, no rules: label and description tables.',
    features: ['floating', 'captioned', 'full-width'],
    params: { firstColumn: 'l', vrules: false, rules: 'none' },
    evidence: [solution('0205-amcos-conference-booklet', '53')],
  },
} as const satisfies { readonly [name: string]: Preset };
