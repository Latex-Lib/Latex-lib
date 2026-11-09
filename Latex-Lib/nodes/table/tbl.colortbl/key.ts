import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.colortbl',
    node: 'table',
    description:
      "xcolor with its table option (colortbl): alternate rows shaded, \\rowcolors{2}{gray!12}{white}; a header band (\\rowcolor, white text), \\arrayrulecolor, \\hline where asked; in a tabular in a table float, its columns p-columns sharing the line, a spanning cell a paragraph of its columns' share. 81 templates.",
    writes: '\\begin{table}[tbp] \\centering \\caption{…} \\label{…} \\rowcolors{2}{…}{…} \\begin{tabular}{p{…}p{…}} … & … \\\\ \\end{tabular} \\end{table}',
    ctan: ['colortbl', 'xcolor'],
    features: ['floating', 'captioned', 'zebra-rows', 'background', 'colored', 'horizontal-rules'],
    params: {
      odd: { type: 'color', default: 'gray!12', description: "the first striped row's colour and every second after (\\rowcolors); '' with even '' for no stripes" },
      even: { type: 'color', default: 'white', description: "the other rows' colour" },
      start: { type: 'number', default: 2, description: 'the row the stripes start at' },
      headerColor: { type: 'color', default: '', description: "the header row's band (\\rowcolor); ''" },
      headerText: { type: 'color', default: '', description: "the header text's colour; ''" },
      ruleColor: { type: 'color', default: '', description: "the rules' colour (\\arrayrulecolor); ''" },
      colspec: { type: 'enum', values: ['equal', 'l', 'c', 'r', 'first-left'], default: 'equal', description: "the columns, each a p-column sharing the line so a cell's paragraph wraps: equal (General's), or set ragged right, centred or ragged left for l, c, r, ragged right then centred for first-left (array, which colortbl loads)" },
      vrules: { type: 'boolean', default: false, description: 'vertical rules between columns and at the edges (|)' },
      rules: { type: 'enum', values: ['all', 'header', 'outer', 'none'], default: 'none', description: '\\hline above, between and below every row; above, under the header and below; above and below; or none' },
      fontSize: { type: 'tex', default: '', description: "the table's size inside its float (\\small); ''" },
      stretch: { type: 'number', default: 1, description: 'row height factor (\\renewcommand{\\arraystretch}{…}); 1 leaves it' },
      colsep: { type: 'dimen', default: '', description: "space either side of a column (\\tabcolsep); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'xcolor', options: ['table'] },
    ],
    requires: [
      'env:table',
    ],
    deny: [
      { class: 'class.beamer', reason: 'beamer loads xcolor itself, so \\usepackage[table]{xcolor} clashes; the class option xcolor=table is the way there', evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '92' }, { kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '33' }] },
      // b23: the 'Extra \or' cascade this deny was first made for is gone (the revtex4-2-aps setting relaxes \@endpbox in the class's
      // swapped builder, and the class profile no longer refuses tabularx and array), but colortbl stays refused there (its profile).
      { class: 'class.revtex4-2', reason: "xcolor's table option loads colortbl, and so array, which revtex4-2 replaces at \\begin{document} with its own copies ('colortbl package is loaded. (Proceeding with fingers crossed.)'): their \\@array empties \\everycr and their \\endarray drops colortbl's \\CT@end, so array's row hooks, through which colortbl 2026 resets a \\rowcolor and paints \\rowcolors stripes, never run and the colours are never restored: the zebra presets paint no stripe and a header band runs on into the body, which no log shows. Until b23 every preset's p-columns also stopped at 'Extra \\or' (...\\@endpbox \\do@row@strut \\or) and 'Illegal pream-token'", evidence: [{ kind: 'source', file: 'revtex4-2.cls (revtex 2022/06/05 4.2f, as the engine fetches it)', line: '1358 (\\everycr{} in \\@array@array@new), 1370-1383 (\\endarray@array@new)' }, { kind: 'source', file: 'colortbl.sty (colortbl 2026/05/01 v1.0l, as the engine fetches it)', line: '116-121, 143' }, { kind: 'compile', cell: 'testing-pipeline/out/results/b3e305a51b2b (revtex4-2-aps.A run, before b22: tbl.colortbl@header-band, Extra \\or at l.35)' }] },
    ],
    // A table float, so it needs a place that takes floats: "Not in outer par mode" in a box (2e12e44096, article.A run: General's
    // tcolorbox statement > tbl.colortbl@zebra, l.177, and @shaded-header, l.278).
    needs: { floats: true },
    // The table is itself a float (GENERAL_GIVES table): no float below it.
    gives: { floats: false },
    targetEngine: 'yes',
  }),
);
