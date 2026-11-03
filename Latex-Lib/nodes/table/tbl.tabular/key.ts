import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.tabular',
    node: 'table',
    description:
      "The kernel's tabular in a table float: \\begin{tabular}{|p{…}|p{…}|} with \\hline between rows, \\caption and \\label above (General's grid); or the same wrapping columns set left, centred or right (>{\\centering\\arraybackslash}p{…}, array), rules only where asked, \\arraystretch, \\tabcolsep and a size inside the float; a spanning cell a paragraph of its columns' share. 549 templates.",
    ctan: ['latex-base'],
    features: ['floating', 'captioned', 'vertical-rules', 'horizontal-rules'],
    params: {
      colspec: { type: 'enum', values: ['equal', 'l', 'c', 'r', 'first-left'], default: 'equal', description: "the columns, each a p-column sharing the line so a cell's paragraph wraps: equal (General's), or set ragged right, centred or ragged left for l, c, r, ragged right then centred for first-left (array)" },
      vrules: { type: 'boolean', default: true, description: 'vertical rules between columns and at the edges (|)' },
      rules: { type: 'enum', values: ['all', 'header', 'outer', 'none'], default: 'all', description: '\\hline above, between and below every row; above, under the header and below; above and below; or none' },
      fontSize: { type: 'tex', default: '', description: "the table's size inside its float (\\small); ''" },
      stretch: { type: 'number', default: 1, description: 'row height factor (\\renewcommand{\\arraystretch}{…}); 1 leaves it' },
      colsep: { type: 'dimen', default: '', description: "space either side of a column (\\tabcolsep); ''" },
    },
    presets: PRESETS,
    // The aligned columns' >{…\arraybackslash} is array's (columnSpec).
    loads: [
      { pkg: 'array', when: { colspec: ['l', 'c', 'r', 'first-left'] } },
    ],
    requires: [
      'env:table',
    ],
    // A table float, so it needs a place that takes floats: "Not in outer par mode" in a box (7cf70bf9a6, article.A run: footnote >
    // General's tcolorbox statement > tbl.tabular@header-rule, l.1161), "Float(s) lost" at \end{document} in a breakable statement
    // (53de802671, article.A run: thm.tcolorbox@sharp > tbl.tabular@header-rule, l.431).
    needs: { floats: true },
    // The table is itself a float (GENERAL_GIVES table): no float below it.
    gives: { floats: false },
    zerotex: 'untested',
  }),
);
