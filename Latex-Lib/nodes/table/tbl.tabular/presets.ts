/**
 * tbl.tabular's presets, each from the templates that use it (`node seed.ts tbl --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  grid: {
    description: "General's grid: equal columns filling the line, vertical rules at every edge, \\hline above, between and below every row.",
    features: ['floating', 'captioned', 'vertical-rules', 'horizontal-rules'],
    params: {},
    evidence: [solution('0053-zhanghai-zju-csse-undergraduate-design-l', '60'), solution('0042-jankapunkt-master-thesis', '67')],
  },
  open: {
    description: 'Columns set left, centred, centred (lcc as p-columns sharing the line, so a cell wraps) with no rules at all, in a table float.',
    writes: '\\begin{tabular}{>{\\raggedright\\arraybackslash}p{…}>{\\centering\\arraybackslash}p{…}} … & … \\\\ … \\\\ \\end{tabular}',
    features: ['floating', 'captioned'],
    params: { colspec: 'first-left', vrules: false, rules: 'none' },
    evidence: [solution('0001-digital-minimal', '63'), solution('0167-chinese-and-english-article', '43')],
  },
  'header-rule': {
    description: 'Rules only above, under the header row and below; no vertical rules; centred columns that wrap (p-columns sharing the line).',
    writes: '\\begin{tabular}{>{\\centering\\arraybackslash}p{…}>{\\centering\\arraybackslash}p{…}} \\hline … \\\\ \\hline … \\\\ … \\\\ \\hline \\end{tabular}',
    features: ['floating', 'captioned', 'horizontal-rules'],
    params: { colspec: 'c', vrules: false, rules: 'header' },
    evidence: [solution('0005-cococo2000-ict-beamer', '36')],
  },
  stretched: {
    description: 'The grid with taller rows, \\renewcommand{\\arraystretch}{1.35}, and the table in a smaller size.',
    writes: '\\small \\renewcommand{\\arraystretch}{…} \\begin{tabular}{|p{…}|p{…}|} \\hline … & … \\\\ \\hline … \\\\ \\hline \\end{tabular}',
    features: ['floating', 'captioned', 'vertical-rules', 'horizontal-rules'],
    params: { stretch: 1.35, fontSize: '\\small' },
    evidence: [solution('0308-iso-signs-safety-board', '41'), solution('0037-hilbert', '66')],
  },
} as const satisfies { readonly [name: string]: Preset };
