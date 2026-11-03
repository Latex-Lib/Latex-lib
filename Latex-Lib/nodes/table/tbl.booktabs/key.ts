import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.booktabs',
    node: 'table',
    description:
      "booktabs: \\toprule, \\midrule under a header row, \\bottomrule, no vertical rules, in a tabular in a table float, its columns p-columns sharing the line (set left, centred or right with array); \\heavyrulewidth and \\lightrulewidth for the rules' weights, \\addlinespace between body rows. 283 templates.",
    ctan: ['booktabs'],
    features: ['floating', 'captioned', 'booktabs-rules'],
    params: {
      colspec: { type: 'enum', values: ['equal', 'l', 'c', 'r', 'first-left'], default: 'equal', description: "the columns, each a p-column sharing the line so a cell's paragraph wraps: equal (General's), or set ragged right, centred or ragged left for l, c, r, ragged right then centred for first-left (array)" },
      rowSpace: { type: 'boolean', default: false, description: 'space between body rows (\\addlinespace)' },
      heavyRule: { type: 'dimen', default: '', description: "top and bottom rules' width (\\heavyrulewidth); ''" },
      lightRule: { type: 'dimen', default: '', description: "the mid rule's width (\\lightrulewidth); ''" },
      fontSize: { type: 'tex', default: '', description: "the table's size inside its float (\\small); ''" },
      stretch: { type: 'number', default: 1, description: 'row height factor (\\renewcommand{\\arraystretch}{…}); 1 leaves it' },
      colsep: { type: 'dimen', default: '', description: "space either side of a column (\\tabcolsep); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'booktabs' },
      // The aligned columns' >{…\arraybackslash} is array's (columnSpec).
      { pkg: 'array', when: { colspec: ['l', 'c', 'r', 'first-left'] } },
    ],
    requires: [
      'env:table',
    ],
    // A table float in every preset (fixed members too), so it needs a place that takes floats. In a box "Not in outer par mode"
    // (2db0ada17e, article.A run: General's tcolorbox statement > tbl.booktabs@heavy, l.523); in a breakable statement "Float(s) lost"
    // at \end{document} (53de802671, article.A run: thm.tcolorbox@sharp > tbl.booktabs@classic, l.431). 493 of 512 fail directly under
    // General's tcolorbox statement (8 core pairs).
    needs: { floats: true },
    // The table is itself a float (GENERAL_GIVES table): no float below it.
    gives: { floats: false },
    zerotex: 'yes',
  }),
);
