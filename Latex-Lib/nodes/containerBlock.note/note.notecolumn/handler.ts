/**
 * note.notecolumn: KOMA's scrlayer-notecolumn. \makenote*[column]{text}
 * (starred: the text kept detokenized for the column) into the marginpar
 * column, or a column of its own declared with
 * \DeclareNewNoteColumn[font=…,width=…]{name}; reversemarginpar puts it in
 * the other margin. Note columns are cleared only on the page's own vertical
 * list (`CLEAR_ON_THE_PAGE_ONLY`).
 * CTAN: https://ctan.org/pkg/koma-script
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { titled } from '../node.ts';
import key from './key.ts';

/**
 * scrlayer-notecolumn has every \clearpage clear the note columns first (scrlayer-notecolumn.sty 2025/12/31 v0.4.4254
 * l.1398-1402), and \clearnotecolumns repeats `\clearpage … \null` until no note waits for a page that has gone
 * (l.1134-1153). In internal vertical mode \clearpage ships no page, so there the loop never ends: "TeX capacity exceeded,
 * sorry [main memory size=5000000]" at \null, \clearpage or \slnc@marginpar@unprocessed stopped the document. All 199 of
 * GitHub run 41584963423's main-memory stops load this package; the 914 cells with the same overfull tcolorbox parts that do
 * not load it never stop. Two places run \clearpage in internal vertical mode:
 * - a box being built: a breakable tcolorbox follows a last part taller than the page's room with \clearpage
 *   (tcbbreakable.code.tex 6.10.0 l.666-669, \tcb@split@force@last), 163 cells, the box being box.tcolorbox@left-bar (68),
 *   @sharp-breakable (43) or General's tcolorbox statement (52), in thm.mdframed's body or a General footnote's text (e.g. aa.A
 *   db76c3d7b09a0788ce503 result 4188056999, l.684 after three "upper box part has become overfull"; amsart.A
 *   d5f8a8c9efa1cbffde91f result 306cead8a6, l.488 \end{tcolorbox});
 * - the output routine: LaTeX's \@doclearpage calls \clearpage again there, for a two-column page's second column, deferred
 *   floats or held-over footnotes (latex.ltx l.20909-20916), after the outer \clearpage's own clearing has ended. That is the
 *   reading of the other 36 cells, all in two columns, stopped at \twocolumn, \onecolumn, \end{document} or a page-level box
 *   (e.g. ctexart.B db161613854e2e11c1c24 result b94661b946 l.375 \end{document}, the package's "box of at least one note
 *   column not empty" just before); inferred from the sources, not compiled.
 * In internal vertical mode (\ifinner) \clearnotecolumns now does nothing, an optional argument read and dropped; on the
 * page's own list it is the package's, and the \clearpage that follows is unchanged either way. No note is dropped: the
 * next \clearpage on the page's own list, \end{document}'s at the latest, clears the columns as before, and a column still
 * full after the last page is cleared there on the next run, from its label (l.1064-1076, 1116-1120). Written once
 * (\LatexLibClearNoteColumns).
 */
const CLEAR_ON_THE_PAGE_ONLY = String.raw`\ifdefined\LatexLibClearNoteColumns\else\ifdefined\clearnotecolumns\let\LatexLibClearNoteColumns\clearnotecolumns\newcommand*\LatexLibNoClearNoteColumns[1][]{}\protected\def\clearnotecolumns{\ifinner\expandafter\LatexLibNoClearNoteColumns\else\expandafter\LatexLibClearNoteColumns\fi}\fi\fi`;

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const column = param(p, 'column', 'marginpar');
  // scrlayer-notecolumn turns a page style that is not a layer page style into one when it is used (v0.4.4254, 2025/12/31):
  // \thispagestyle{X} adds the conversion to X's command hook (`cmd/ps@X/after`, l.1377-1391), and the conversion declares
  // X.oddhead, X.evenhead, X.oddfoot and X.evenfoot with \DeclareNewLayer (l.1305-1349). Each \thispagestyle{X} before the page
  // ships adds it once more, so two on one page (tocloft's \thispagestyle{plain} for every contents title, tocloft.sty l.86-88;
  // two \chapter* heads, memoir's contents and lists) convert X twice, and the second stops at "Package scrlayer Error: layer
  // `plain.oddhead' already defined" (run 41584963423: d578655a9f1da7b5da1e0, three \tableofcontents on a page, 1,031 branches
  // charged at \end{document} in 20 pairs, article.B result 2eab44a1b2 l.554; 49 more in 33 pairs; memoir.A d87ad4f1d4f7ea2b6eaab
  // result 599a764308 l.240 with `chapter.oddhead'). The conversion runs once per style: a style already of layers is left as
  // it is, so no page looks different.
  const layerizeOnce = String.raw`\makeatletter\ifdefined\slnc@LayerizePageStyle\ifdefined\LatexLibLayerizePageStyle\else\let\LatexLibLayerizePageStyle\slnc@LayerizePageStyle\renewcommand*{\slnc@LayerizePageStyle}[1]{\IfLayerPageStyleExists{#1}{}{\LatexLibLayerizePageStyle{#1}}}\fi\fi\makeatother`;
  const options = [
    ...(param(p, 'font') === '' ? [] : [`font=${param(p, 'font')}`]),
    ...(param(p, 'width') === '' ? [] : [`width=${param(p, 'width')}`]),
    ...(param(p, 'side', 'normal') === 'reverse' ? ['reversemarginpar'] : []),
  ];
  // A note reaches its column only through the .slnc file, which \makenote writes with \addtocontents, a write done at shipout
  // (scrlayer-notecolumn.sty l.609-616), and \clearnotecolumns reads how many pages to ship from a label written the same way
  // (l.1050-1090). A body of notes alone puts no box on the page, so no page ever shipped, nothing was written, and every run
  // ended "No pages of output." (run 41584963423: d7f1d4153e60aee6e0ba2, 64 notes, and d2deb108e197508840cf5, 21 notes, in all
  // 46 pairs, 3,801 branches; article.A result 1759171ce3, no error). So when nothing has shipped and the page is empty at
  // \end{document}, one empty box goes first. The hook runs before the kernel's own \clearpage there (latex.ltx l.15472-15476),
  // which clears the columns as before (l.1398-1402): the page it ships writes the notes and the label, and the next run prints
  // them. A document that has shipped a page, or holds a box on it, is untouched.
  const shipFirst = '\\AddToHook{enddocument}{\\ifvmode\\ifnum\\ReadonlyShipoutCounter=0 \\ifdim\\pagetotal=0pt \\null\\fi\\fi\\fi}';
  const declare = [...(column === 'marginpar' ? (options.length === 0 ? [] : [`\\DeclareNoteColumn[${options.join(',')}]{marginpar}`]) : [`\\DeclareNewNoteColumn${options.length === 0 ? '' : `[${options.join(',')}]`}{${column}}`]), shipFirst];
  return {
    // Declarations: the column (where declared) and FC2's empty box at \end{document} (`declare`), then M1-NC's clearing on the
    // page's own list only, then LP3's one conversion per page style (b21; none of the three touches what the others change).
    preamble: () => ({ packages: ['\\usepackage{scrlayer-notecolumn}'], declarations: [...declare, CLEAR_ON_THE_PAGE_ONLY, layerizeOnce] }),
    // The starred form writes the body to the .slnc file detokenized. Unstarred, it expands the body in \protected@write,
    // where a list's \item breaks ("Use of \slnc@makenote doesn't match its definition", then Incomplete \iffalse and no page:
    // 0 of 280 list children passed, article.A, e.g. d77bcaaf762a result e65157ea7c). Probed under batch 4 (the branches of
    // d77bcaaf762a9afbed394 and daeb8339e6261ec3b3860, refiled): both documents build with no error and every note's sentinel
    // ships, lists included; their notes fail only on the @margin column's overfull boxes (deferred L-d4).
    emit: (node, content) => `\n\\makenote*${column === 'marginpar' ? '' : `[${column}]`}{${titled(node, content)}}\n`,
  };
};

export default realize;
