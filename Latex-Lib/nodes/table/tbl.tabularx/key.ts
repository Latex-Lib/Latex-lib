import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.tabularx',
    node: 'table',
    description:
      "tabularx: a table of a set width, \\begin{tabularx}{\\linewidth}{|X|X|}, its X columns sharing the room; X ragged or centred (>{\\centering\\arraybackslash}X), a natural-width first column, | and \\hline where asked; a spanning cell a paragraph of its columns' share of the width; in a table float. 126 templates.",
    ctan: ['tabularx'],
    features: ['floating', 'captioned', 'full-width', 'vertical-rules', 'horizontal-rules'],
    params: {
      width: { type: 'string', default: '\\linewidth', description: "the table's width" },
      align: { type: 'enum', values: ['justify', 'left', 'center', 'right'], default: 'justify', description: "the X columns' alignment" },
      firstColumn: { type: 'enum', values: ['X', 'l', 'c', 'r'], default: 'X', description: 'the first column: an X column, or a natural-width one' },
      vrules: { type: 'boolean', default: true, description: 'vertical rules between columns and at the edges (|)' },
      rules: { type: 'enum', values: ['all', 'header', 'outer', 'none'], default: 'all', description: '\\hline above, between and below every row; above, under the header and below; above and below; or none' },
      fontSize: { type: 'tex', default: '', description: "the table's size inside its float (\\small); ''" },
      stretch: { type: 'number', default: 1, description: 'row height factor (\\renewcommand{\\arraystretch}{…}); 1 leaves it' },
      colsep: { type: 'dimen', default: '', description: "space either side of a column (\\tabcolsep); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'tabularx' },
    ],
    requires: [
      'env:table',
    ],
    // A table float, so it needs a place that takes floats: "Not in outer par mode" in a box (c609cddf12, article.A run: General's
    // tcolorbox statement > tbl.tabularx@grid, l.1132), "Float(s) lost" at \end{document} in a breakable statement (53de802671,
    // article.A run: thm.tcolorbox@sharp > tbl.tabularx@grid, l.431).
    needs: { floats: true },
    // A float, and tabularx reads its whole body as an argument (to measure it), so a verbatim child (a library code way) cannot
    // sit below it ("Paragraph ended before \lst@next was complete", the vwcol failure).
    gives: { floats: false, argument: true },
    zerotex: 'yes',
  }),
);
