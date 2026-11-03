import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.arydshln',
    node: 'table',
    description:
      'arydshln: dashed rules, \\hdashline between rows and ;{2pt/3pt} between columns, \\dashlinedash and \\dashlinegap for the dashes, solid \\hline at the edges when asked; equal p-columns sharing the line, a spanning cell a paragraph of its columns\' share; array loaded before arydshln; in a tabular in a table float; array and longtable loaded before arydshln. 5 templates.',
    ctan: ['arydshln'],
    features: ['floating', 'captioned', 'dashed-rules', 'horizontal-rules'],
    params: {
      vertical: { type: 'boolean', default: true, description: 'dashed rules between columns too' },
      outer: { type: 'enum', values: ['dashed', 'solid'], default: 'dashed', description: 'the top and bottom rules dashed, or solid \\hline' },
      dash: { type: 'dimen', default: '', description: "a dash's length (\\dashlinedash); ''" },
      gap: { type: 'dimen', default: '', description: "a gap's length (\\dashlinegap); ''" },
      // 'equal' (was 'l'): a natural l column is as wide as its cell, and General's cells hold a paragraph (article.A, oracle 4: 209 of
      // 211 fit tbl.arydshln branches past the line, 294pt with the escape run, 1817pt with the marked run). Its templates (0180, 0861,
      // 0914) set dashed rules and never ask for l columns.
      colspec: { type: 'enum', values: ['equal', 'l', 'c', 'r', 'first-left'], default: 'equal', description: "the columns, each a p-column sharing the line so a cell's paragraph wraps: equal (General's), or set ragged right, centred or ragged left for l, c, r, ragged right then centred for first-left (array)" },
      fontSize: { type: 'tex', default: '', description: "the table's size inside its float (\\small); ''" },
      stretch: { type: 'number', default: 1, description: 'row height factor (\\renewcommand{\\arraystretch}{…}); 1 leaves it' },
      colsep: { type: 'dimen', default: '', description: "space either side of a column (\\tabcolsep); ''" },
    },
    presets: PRESETS,
    // array and longtable first, as the handler prints them (packages/arydshln.ts loadOrder).
    loads: [
      { pkg: 'array' },
      { pkg: 'longtable' },
      { pkg: 'arydshln' },
    ],
    requires: [
      'env:table',
    ],
    conflicts: [
      {
        way: 'tbl.colortbl',
        // Probed under batch 4 (staging store, result 3b802a6df945): d20f1d022be3059f90c2f as the run emitted it, with
        // \usepackage{colortbl} put before arydshln on arydshln's own line, builds with no error (4 of 8 branches pass, the rest
        // on width). So printing colortbl before arydshln in this way's preamble would let this conflict go, at the cost of
        // loading colortbl in every tbl.arydshln document: a library decision, not taken here.
        reason:
          "tbl.colortbl loads \\usepackage[table]{xcolor}, so colortbl patches array again when its line comes after arydshln's, and array loaded first does not stop that; the package fact's colortbl conflict does not see a load made through xcolor's option, and the host does not honour load order. In the copy's batch-3b article.A run all 17 tbl.arydshln branches of the 10 documents where tbl.colortbl came after arydshln stop at 'Illegal pream-token (;)' or \\adl@hline (report.A: 18 of 18); the 22 documents (33 branches) where colortbl came first had no error, and are filed apart too.",
        evidence: [{ kind: 'compile', cell: "copy batch-3b article.A run: d20f1d022be3059f90c2f (result 9ff16b8c1a, 'Illegal pream-token (;)' l.76), ddac9eb0ab723e907531d (2cfb92f28f), dddcb463e6e7f1f5795f8 (c7057e9cf9, \\adl@hline)" }],
      },
      {
        // With array loaded first (batch 4) a later array load no longer undoes arydshln, so its patches are in force in every
        // document that holds it: this conflict now matters wherever General's tables could sit beside it.
        general: 'table',
        reason:
          "arydshln's \\multicolumn is not \\long, and every one of General's table ways ends an aligned paragraph in a spanning cell with \\par (\\multicolumn{1}{|>{\\raggedright\\arraybackslash}X|}{{\\bfseries {\\centering Run...\\par}}}); the library's own tables keep \\par out of spanning cells (node.ts noPar). With arydshln's patches in force (no array or colortbl loaded after it) such a document never finishes: ZeroTeX's 120 s tool watchdog stops XeTeX and leaves no log. In the copy's article, report, amsart and scrartcl A runs, every document holding tbl.arydshln and such a cell either hung (67, one of them, report.A d478b2bae1389876cf39d, also holding tbl.nicematrix) or compiled with arydshln undone by a colortbl, xcolor[table] or tabularx load after it ('Illegal pream-token (;)', e.g. 47bbc3df1fa8); with arydshln in force and no such cell, 826 compiled and 1 hung (another cause).",
        evidence: [
          { kind: 'compile', cell: "cffbb6133d22cd0de787a (the copy's article.A run: document dfd42fd23728b836abaf9, result 2e61df00a61b, 121.5 s, empty log; General's caption+float+tabularx table, branch bfd5ca1b6de459d89df67, writes the \\par spanning cell beside tbl.arydshln@fine-dashes)" },
          { kind: 'compile', cell: "cb656b31f6f310ae69ef4, c04f7ff02a2b2b11cfac0, cfe67300aff07ad2cb822, c7d445e7d423358b65ac1 (the copy's article.A, amsart.A, report.A and scrartcl.A runs: tbl.arydshln beside General's tables, 121.5 to 121.6 s, empty logs)" },
          { kind: 'compile', reproducer: "fix-notes 'arydshln hang', the marked tbl.arydshln table under article.A: arydshln loaded and no dashes, hung; the \\multicolumn rows removed, 2,173 ms and no error" },
        ],
      },
    ],
    // A table float, so it needs a place that takes floats: "Not in outer par mode" in a box (2e12e44096, article.A run: General's
    // tcolorbox statement > tbl.arydshln@dashed, l.248), "Float(s) lost" at \end{document} in a breakable statement (53de802671,
    // article.A run: thm.tcolorbox@sharp > tbl.arydshln@fine-dashes, l.431).
    needs: { floats: true },
    // The table is itself a float (GENERAL_GIVES table): no float below it.
    gives: { floats: false },
    zerotex: 'untested',
  }),
);
