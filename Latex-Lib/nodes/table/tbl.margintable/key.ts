import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.margintable',
    node: 'table',
    description:
      "Tufte-LaTeX's margin table (tufte-handout, tufte-book): \\begin{margintable}[offset] with the caption and label above a tabular whose p-columns share the margin's width, booktabs or \\hline rules; or the class's full-width table* spanning text and margin. The margin float is a \\marginpar, so not in a box, a float or a footnote.",
    writes: '\\begin{margintable} \\centering \\caption{…} \\label{…} \\begin{tabular}{p{…}p{…}} \\toprule … & … \\\\ \\midrule … \\\\ \\bottomrule \\end{tabular} \\end{margintable}',
    ctan: ['tufte-latex', 'booktabs'],
    features: ['floating', 'captioned', 'booktabs-rules', 'margin-note', 'class-styled'],
    params: {
      placement: { type: 'enum', values: ['margin', 'full'], default: 'margin', description: 'the margin (margintable) or across text and margin (table*)' },
      offset: { type: 'dimen', default: '', description: "margintable's vertical offset ([-1.2ex] by the class); ''" },
      rules: { type: 'enum', values: ['booktabs', 'hline', 'none'], default: 'booktabs', description: 'booktabs rules above, under the header row and below (loads booktabs), \\hline rules there, or none' },
      colspec: { type: 'enum', values: ['equal', 'l', 'c', 'r', 'first-left'], default: 'equal', description: "the columns, each a p-column sharing the width so a cell's paragraph wraps: equal, or set ragged right, centred or ragged left (array)" },
      fontSize: { type: 'tex', default: '', description: "the table's size (\\footnotesize); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'booktabs', when: { rules: 'booktabs' } },
      // The aligned columns' >{…\arraybackslash} is array's (columnSpec).
      { pkg: 'array', when: { colspec: ['l', 'c', 'r', 'first-left'] } },
    ],
    requires: ['env:margintable'],
    requiresWhen: [{ when: { placement: 'full' }, requires: ['env:table'] }],
    only: ['class.tufte-handout', 'class.tufte-book'],
    // The margin float is a \marginpar holding a minipage (xtufte-common.def l.1027-1042), the full-width one a float: both need
    // a place that takes floats ("Not in outer par mode" in a box or a float).
    needs: { floats: true },
    gives: { floats: false },
    // ZeroTeX-NG, 2026-11-07: every preset typeset ok with no error or overfull line, on both sample tables (a captioned one with a
    // header row and a span; a headless, captionless, labelled one with a long cell), under tufte-handout [nols] (margin, margin
    // with \footnotesize, \hline and a 2ex offset, full) and tufte-book [nols] (margin).
    targetEngine: 'yes',
  }),
);
