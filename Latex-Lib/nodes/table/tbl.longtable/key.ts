import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.longtable',
    node: 'table',
    description:
      'longtable: a table that breaks across pages, \\begin{longtable}{…} with its \\caption as the first row, the header row repeated (\\endfirsthead, \\endhead), a "continued" line at each break (\\endfoot); p-columns sharing the line (set left, centred or right with array), a spanning cell a paragraph of its columns\' share; \\hline or booktabs rules; not a float, so not in columns, and in a box only where the box itself breaks across pages (a breakable tcolorbox or mdframed that is not inside another box). 107 templates.',
    writes: '\\begin{longtable}{|p{…}|p{…}|} \\caption{…}\\label{…} \\\\ \\hline … \\\\ \\hline \\endfirsthead \\hline … \\\\ \\hline \\endhead \\hline \\endlastfoot … \\\\ \\end{longtable}',
    ctan: ['longtable'],
    features: ['page-breaking', 'captioned', 'vertical-rules', 'horizontal-rules', 'booktabs-rules'],
    params: {
      colspec: { type: 'enum', values: ['equal', 'l', 'c', 'r', 'first-left'], default: 'equal', description: "the columns, each a p-column sharing the line so a cell's paragraph wraps: equal (General's), or set ragged right, centred or ragged left for l, c, r, ragged right then centred for first-left (array)" },
      vrules: { type: 'boolean', default: true, description: 'vertical rules between columns and at the edges (|)' },
      rules: { type: 'enum', values: ['hline', 'booktabs', 'none'], default: 'hline', description: '\\hline above, between and below, booktabs rules (loads booktabs), or none' },
      repeatHeader: { type: 'boolean', default: true, description: 'the header row repeated at the top of every page' },
      continued: { type: 'boolean', default: false, description: '"continued" lines at the foot and head of broken pages' },
      fontSize: { type: 'tex', default: '', description: "the table's size inside its float (\\small); ''" },
      stretch: { type: 'number', default: 1, description: 'row height factor (\\renewcommand{\\arraystretch}{…}); 1 leaves it' },
      colsep: { type: 'dimen', default: '', description: "space either side of a column (\\tabcolsep); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'longtable' },
      { pkg: 'booktabs', when: { rules: 'booktabs' } },
      // The aligned columns' >{…\arraybackslash} is array's (columnSpec).
      { pkg: 'array', when: { colspec: ['l', 'c', 'r', 'first-left'] } },
    ],
    requires: [
      'env:table',
    ],
    deny: [
      // Round 2 of batch 1 (GitHub run 41584963423) denied it under aastex701, whose \switch@longtable (aastex701.cls l.4909-4931, run
      // from \document@inithook at l.5368-5369) lets \longtable, \endlongtable, \LT@start, \LT@end@hd@ft and \LT@array to the class's own
      // copies (l.4658-4900: its page grid breaks the table in its own output routine, \output@init/prep/post@longtable, l.4949-4960;
      // 'Patching unrecognized longtable package') and builds the preamble with the class's swapped array builder: every p-column
      // stopped at 'Extra \or' (0 of 84 aastex.A branches passed). The aastex setting relaxes \@endpbox in that builder's
      // \@mkpream@relax since b22 (owner item JR2-2), which \LT@array@new calls too (l.4881), and run r2-461ed0e saw no 'Extra \or' in
      // any aastex cell, so b23 lifts the deny (owner item JR2-6). b23's GitHub probe (run 41775212344) compiled 36 longtable branches
      // under aastex.A clean (CLASSPIPE-lt-aastex-new: every sentinel in the text block, two tables broken across pages with their
      // continued foot and head), and the same document without the setting's line raised 1,100 'Extra \or'; a run document with 8 of
      // them (d9c2521eccf56a6fbeb38) kept its old branches but one, whose footnote ran 8.7pt below the text block on the page the added
      // tables now made break (an 11.6pt page overflow), which is aastex's own footnote overflow (16.9% of the not-denied aastex.A footnote branches of run r2-461ed0e fail on page
      // overflow, against 0.9% under article.A), not the table's. revtex4-2 has the same code, but both its settings are two columns
      // (oneColumn below).
      { class: 'class.beamer', reason: 'a frame does not break across slides: a table that does not fit must be split by hand or the frame given allowframebreaks', evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '42' }] },
    ],
    oneColumn: {
      reason: 'longtable does not break across two-column pages ("longtable not in 1-column mode"), under \\twocolumn or a two-column class',
      // Its solo branch under setup B (twocolumn): article.B, acmart-manuscript.B, amsart.B, llncs.B, memoir.B and scrartcl.B all stop there.
      evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/results/89b125795b52 (solo, acmart-manuscript.B)' }, { kind: 'compile', cell: 'testing-pipeline/out/results/016058a47f06 (solo, article.B)' }],
    },
    // b23 (round 3 of batch 1): in a box that breaks across pages (a breakable tcolorbox or mdframed not inside another box), the box
    // carries the table's breaks: longtable runs inside the box's \vbox, where its output routine never fires (no repeated head),
    // and the box splits between its rows.
    // GitHub run r2-461ed0e compiled 2,228 such branches, then denied (below General's tcolorbox statement 1,238, thm.tcolorbox's
    // breakable presets 499, thm.mdframed 491), and 2,149 passed (96.5%); no failure was the table's TeX error (footnote, box, page and
    // sentinel checks, and 6 other branches' 'Not in outer par mode' in their denied documents). A box that does not
    // break gives breakable: false (thm.tcolorbox's and the note boxes' unbreakable presets, the margin notes, fancybox, awesomebox,
    // General's note), and a breakable box inside another box does not break (tcolorbox and mdframed set it whole there): maxBoxDepth 1.
    // b23's GitHub probe (run 41775212344, CLASSPIPE-ltbox-article/-memoir) compiled 36 such longtables under article.A and 33 under
    // memoir.A, below General's tcolorbox statement and thm.mdframed: every one clean but the last two on each first page, which ran
    // off it, as the first page of the probe's article.A document of colortbl tables, with no longtable, does too (those probe
    // documents begin with text their merged preambles set before \begin{document}).
    needs: { breakable: true, columns: false, maxBoxDepth: 1 },
    // Its cells are boxes (a float in one is 'Not in outer par mode'), as GENERAL_GIVES says of General's tables.
    gives: { floats: false },
    targetEngine: 'untested',
  }),
);
