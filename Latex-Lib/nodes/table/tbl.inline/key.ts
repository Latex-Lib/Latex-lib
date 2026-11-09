import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.inline',
    node: 'table',
    description:
      "A tabular set in the text with no float and no caption, centred (\\begin{center}) or flush left: booktabs rules, \\hline rules or none, p-columns sharing the line (set left, centred or right with array). For letter, which has no table float, counter or caption, and for tikzposter, whose blocks are macro arguments that take no float; the caption and label are dropped.",
    writes: '\\begin{center} \\begin{tabular}{p{…}p{…}} \\toprule … & … \\\\ \\midrule … \\\\ \\bottomrule \\end{tabular} \\end{center}',
    ctan: ['latex-base', 'booktabs'],
    features: ['booktabs-rules', 'centered', 'box-safe'],
    params: {
      align: { type: 'enum', values: ['center', 'left'], default: 'center', description: 'in a center environment, or flush left in a paragraph of its own' },
      rules: { type: 'enum', values: ['booktabs', 'hline', 'none'], default: 'booktabs', description: 'booktabs rules above, under the header row and below (loads booktabs), \\hline rules there, or none' },
      vrules: { type: 'boolean', default: false, description: 'vertical rules between columns and at the edges (|)' },
      colspec: { type: 'enum', values: ['equal', 'l', 'c', 'r', 'first-left'], default: 'equal', description: "the columns, each a p-column sharing the line so a cell's paragraph wraps: equal, or set ragged right, centred or ragged left (array)" },
      fontSize: { type: 'tex', default: '', description: "the table's size (\\large in a poster); ''" },
      stretch: { type: 'number', default: 1, description: 'row height factor (\\renewcommand{\\arraystretch}{…}); 1 leaves it' },
      colsep: { type: 'dimen', default: '', description: "space either side of a column (\\tabcolsep); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'booktabs', when: { rules: 'booktabs' } },
      // The aligned columns' >{…\arraybackslash} is array's (columnSpec).
      { pkg: 'array', when: { colspec: ['l', 'c', 'r', 'first-left'] } },
    ],
    requires: [],
    only: ['class.letter', 'class.tikzposter'],
    // No float: it sits in a box or a macro argument (a tikzposter \block) as well as in the text. A tabular is a box of its own.
    needs: {},
    gives: { floats: false },
    // ZeroTeX-NG, 2026-11-07: both presets typeset ok with no error or overfull line, on both sample tables: letter (flush left with
    // \hline, and centred with | rules and centred columns, inside a letter environment) and tikzposter [25pt,a0paper,portrait]
    // (inside a \block in a column).
    targetEngine: 'yes',
  }),
);
