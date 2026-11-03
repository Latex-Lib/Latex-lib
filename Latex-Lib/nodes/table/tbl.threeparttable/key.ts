import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.threeparttable',
    node: 'table',
    description:
      "threeparttable: caption, tabular and notes held to the table's own width (the line's, with its equal p-columns sharing the line), \\begin{threeparttable}\\caption{…} … \\end{threeparttable} in a table float; flushleft or para for the notes, \\hline or booktabs rules. 13 templates.",
    ctan: ['threeparttable'],
    features: ['floating', 'captioned', 'horizontal-rules', 'booktabs-rules', 'table-notes'],
    params: {
      rules: { type: 'enum', values: ['hline', 'booktabs'], default: 'hline', description: 'rules above, under the header and below: \\hline or booktabs (loads booktabs)' },
      notes: { type: 'enum', values: ['normal', 'flushleft', 'para'], default: 'normal', description: 'the table notes: hanging, flush left, or run into a paragraph (the package option)' },
      // 'equal' (was 'l'): a natural l column is as wide as its cell, and General's cells hold a paragraph (article.A, oracle 4: 208 of
      // 211 fit tbl.threeparttable branches past the line, 294pt with the escape run, 1817pt with the marked run, e.g. 5f08f5b4b9).
      // Its templates (0030, 0104) set table notes and never ask for l columns; 0053 uses |c|c|. The cost: the caption, held to the
      // tabular's width, is now as wide as the line.
      colspec: { type: 'enum', values: ['equal', 'l', 'c', 'r', 'first-left'], default: 'equal', description: "the columns, each a p-column sharing the line so a cell's paragraph wraps: equal (General's), or set ragged right, centred or ragged left for l, c, r, ragged right then centred for first-left (array)" },
      fontSize: { type: 'tex', default: '', description: "the table's size inside its float (\\small); ''" },
      stretch: { type: 'number', default: 1, description: 'row height factor (\\renewcommand{\\arraystretch}{…}); 1 leaves it' },
      colsep: { type: 'dimen', default: '', description: "space either side of a column (\\tabcolsep); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'threeparttable', when: { notes: 'normal' } },
      { pkg: 'threeparttable', options: ['flushleft'], when: { notes: 'flushleft' } },
      { pkg: 'threeparttable', options: ['para'], when: { notes: 'para' } },
      { pkg: 'booktabs', when: { rules: 'booktabs' } },
      // The aligned columns' >{…\arraybackslash} is array's (columnSpec).
      { pkg: 'array', when: { colspec: ['l', 'c', 'r', 'first-left'] } },
    ],
    requires: [
      'env:table',
    ],
    // A table float, so it needs a place that takes floats: "Not in outer par mode" in a box (c609cddf12, article.A run: General's
    // tcolorbox statement > tbl.threeparttable@ruled, l.1162), "Float(s) lost" at \end{document} in a breakable statement (e123fbfdea,
    // article.A run: thm.mdframed@thick > tbl.threeparttable@booktabs, the document's only float in a box, l.591).
    needs: { floats: true },
    deny: [
      {
        class: 'class.sn-jnl',
        reason: "sn-jnl sets every table float in a threeparttable of its own (its table environment, sn-jnl.cls l.1326-1340), so this way's \\begin{threeparttable} inside it is nested: \"Illegal nested threeparttable environments\", then threeparttable's tabular hook calls itself until TeX's grouping levels run out (\\TPTsav@tabular ->\\TPT@begintabhook), and the document stops",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/sn-jnl.cls', line: '1326-1340 (CR line ends)' },
          { kind: 'compile', cell: 'GitHub run 41584963423 results/fc495c5d8ed5 (sn-jnl.A, d45585e580a553e647a33, l.548; all 35 sn-jnl.A documents stopped at grouping levels=65535 hold this way: 1,327 branches, and F83 24)' },
        ],
      },
    ],
    // The table is itself a float (GENERAL_GIVES table): no float below it.
    gives: { floats: false },
    zerotex: 'untested',
  }),
);
