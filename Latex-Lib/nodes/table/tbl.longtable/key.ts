import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.longtable',
    node: 'table',
    description:
      'longtable: a table that breaks across pages, \\begin{longtable}{…} with its \\caption as the first row, the header row repeated (\\endfirsthead, \\endhead), a "continued" line at each break (\\endfoot); p-columns sharing the line (set left, centred or right with array), a spanning cell a paragraph of its columns\' share; \\hline or booktabs rules; not a float, so not in columns or boxes. 107 templates.',
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
      // Round 2 of batch 1 (GitHub run 41584963423). aastex701 lets \LT@array to its own copy (\switch@longtable, aastex701.cls l.4909-4931, run from
      // \document@inithook at l.5368-5369), which builds the preamble with the class's swapped \@mkpream (\switch@array, l.883-955), a copy that does
      // not match array v2.7b. The class loads longtable itself, so a profile refusal cannot express this: a class deny. A plain tabular's p-columns
      // in a table float work under the same swap (no table error at d8abbbe5b3fcbb554cd8b l.171 or dc3443cefbb7ea6e2e4c2 l.210, aastex.A).
      // Since b22 the aastex setting relaxes \@endpbox in the class's \@mkpream@relax (owner item JR2-2), which \LT@array@new calls as well
      // (l.4881), so that cascade should not recur. The deny stays (JR2-6): \switch@longtable also swaps five of longtable 4.27's macros
      // for older copies ('Patching unrecognized longtable package'), which no run has seen past the preamble, and a fault there (the
      // output routine) is document-wide. To be re-examined once the next run shows the setting line working.
      { class: 'class.aastex', reason: "aastex701 (which loads array and longtable itself) lets longtable's \\LT@array to its own copy at \\begin{document}, which builds the preamble with the class's swapped \\@mkpream; that copy did not match array v2.7b, so every preset's p-columns (and >{...}p-columns) stopped at 'Extra \\or' (...\\@endpbox \\do@row@strut \\or) and flooded the document. tbl.longtable passed 0 of 84 not-denied aastex.A branches of the GitHub run (20 with their own Extra \\or); in db43dbba46560ba00d8f6, which loads neither tabularx nor colortbl, its longtable alone raised 33 Extra \\or, and the same document is clean under article.A, amsart.A and report.A. Since b22 the aastex setting relaxes \\@endpbox in the class's \\@mkpream@relax, which the class's \\LT@array calls too, so the cascade should not recur; the deny stays because \\switch@longtable also swaps five of longtable 4.27's macros (\\longtable, \\endlongtable, \\LT@start, \\LT@end@hd@ft, \\LT@array) for older copies, which no run has seen past the preamble, and a fault in its output routine is document-wide. Two-column aastex settings already keep it out (oneColumn)", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '4909-4931 (\\switch@longtable: \\let\\LT@array\\LT@array@new), 5368-5369 (run in \\document@inithook), 883-955 (\\switch@array: \\let\\@mkpream\\@mkpream@array@new)' }, { kind: 'compile', cell: 'GitHub run 41584963423, aastex.A d29581cdead2f10529add, d5517f571d6535656dc2c, db76c3d7b09a0788ce503 (tbl.longtable@booktabs: own Extra \\or); db43dbba46560ba00d8f6 (longtable@repeat-header in a footnote, no tabularx or colortbl: 33 Extra \\or; article.A, amsart.A, report.A ok)' }] },
      { class: 'class.beamer', reason: 'a frame does not break across slides: a table that does not fit must be split by hand or the frame given allowframebreaks', evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '42' }] },
    ],
    oneColumn: {
      reason: 'longtable does not break across two-column pages ("longtable not in 1-column mode"), under \\twocolumn or a two-column class',
      // Its solo branch under setup B (twocolumn): article.B, acmart-manuscript.B, amsart.B, llncs.B, memoir.B and scrartcl.B all stop there.
      evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/results/89b125795b52 (solo, acmart-manuscript.B)' }, { kind: 'compile', cell: 'testing-pipeline/out/results/016058a47f06 (solo, article.B)' }],
    },
    needs: { breakable: true, columns: false, maxBoxDepth: 0 },
    // Its cells are boxes (a float in one is 'Not in outer par mode'), as GENERAL_GIVES says of General's tables.
    gives: { floats: false },
    zerotex: 'untested',
  }),
);
