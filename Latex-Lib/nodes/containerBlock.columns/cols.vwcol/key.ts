import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'cols.vwcol',
    node: 'containerBlock/columns',
    description:
      'vwcol: columns of chosen widths that paragraph text flows through, \\begin{vwcol}[widths={0.5,0.5}, sep=1.5em, rule=0pt] … \\end{vwcol} (a 0.4pt rule when the node asks for one); equal, wide-first or wide-last widths; paragraphs only, no lists, statements, verbatim, footnotes or headings in it. 2 templates.',
    ctan: ['vwcol'],
    features: ['balanced-columns', 'unequal-widths'],
    params: {
      widths: { type: 'enum', values: ['equal', 'wide-first', 'wide-last'], default: 'equal', description: "the columns' widths: equal, the first wide, or the last wide" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'vwcol' },
    ],
    // The columns are cut from a box: a float in them is "Not in outer par mode" (b9890eec60, article.A run: branch baf725189b6a0f4176467,
    // l.312) or lost ("Float(s) lost", 7579d95d14, article.A run: the only box of document dfdb99af9814efaa96ee3, l.1043 \end{document}).
    // vwcol fits only paragraph lines to its columns: what sets its own width takes \linewidth, the full text width, so lists
    // and statements come out 172.7 or 345.4pt over (article.A: 821 and 529 of 1,873 vwcol boxes, 43769b446a l.217; thm.*
    // below it pass 4 of 387). It reads its body as an argument, so verbatim breaks ("Paragraph ended before \lst@next was
    // complete", 43769b446a l.290; General code below it 0 of 36). A footnote in it loses its text (0 of 31 footnote
    // containers below it pass, 7 documents, e.g. d427fbe58a7a4d3dc128c result 4ed4a7dc95). General's code, footnote anchors,
    // footnote containers, headings, tables and (since b21) tcolorbox statements are denied below it through GENERAL_NEEDS
    // (contexts.ts), and since b22 General's plain statements and list items too (owner item O7: a trivlist's \@item and
    // \@setpar replace vwcol's \everypar and \par, so their lines take the full \linewidth; General's list with no item prints
    // only its child and is not denied).
    // The library's \linewidth boxes need paragraph too (thm.tcolorbox, box.tcolorbox, box.mdframed, box.awesomebox: 1 of
    // 328 fit article.A branches with one of them below vwcol pass), so they are denied below it as well.
    // Headings need paragraph too (0 of 827 heading branch-cells below vwcol pass over 5 pairs; the 55 head.sectsty@smallcaps \subparagraph passes are run-in titles that never print).
    // So do the five list ways since batch 6 (list.kernel, list.enumitem, list.enumerate-pkg, list.paralist, list.scrextend: 26 of 222 item-bearing branches below vwcol passed).
    gives: { columns: true, floats: false, paragraph: false, verbatim: false, footnotes: false },
    zerotex: 'untested',
  }),
);
