/**
 * tbl.margintable's presets, from the Tufte-LaTeX samples.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

const SRC = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  margin: {
    description: "Tufte's margin table: the table in the wide margin beside the text, caption above, booktabs rules, its columns sharing the margin's width.",
    features: ['floating', 'captioned', 'booktabs-rules', 'margin-note', 'class-styled'],
    params: {},
    evidence: [
      { kind: 'source', file: `${SRC}/0793-xtufte/latex/xtufte-common.def`, line: '1027-1058 (margin floats: lrbox, minipage of \\marginparwidth, \\marginpar; margintable[offset])' },
      { kind: 'source', file: `${SRC}/0793-xtufte/doc/sample-book.tex`, line: '605-622 (\\begin{margintable}[<offset>])' },
      solution('0793-xtufte', '68'),
    ],
  },
  'margin-small': {
    description: 'The margin table in footnote size, with \\hline rules above, under the header row and below.',
    writes: '\\begin{margintable} \\centering \\caption{…} \\label{…} \\footnotesize \\begin{tabular}{p{…}p{…}} \\hline … & … \\\\ \\hline … \\\\ \\hline \\end{tabular} \\end{margintable}',
    features: ['floating', 'captioned', 'horizontal-rules', 'margin-note', 'small-type', 'class-styled'],
    params: { rules: 'hline', fontSize: '\\footnotesize' },
    evidence: [manual('tufte-latex', 'margin figures and tables: margintable[offset]')],
  },
  full: {
    description: "Tufte's full-width table, table*, spanning the text and the margin, with booktabs rules.",
    writes: '\\begin{table*}[tbp] \\centering \\caption{…} \\label{…} \\begin{tabular}{p{…}p{…}} \\toprule … & … \\\\ \\midrule … \\\\ \\bottomrule \\end{tabular} \\end{table*}',
    features: ['floating', 'captioned', 'booktabs-rules', 'full-width', 'class-styled'],
    params: { placement: 'full' },
    evidence: [{ kind: 'source', file: `${SRC}/0793-xtufte/latex/xtufte-common.def`, line: '1281-1285 (table* renewed as a full-width float)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
