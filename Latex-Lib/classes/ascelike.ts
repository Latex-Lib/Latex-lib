import { defineClass } from '../schema/class.ts';

/**
 * ascelike v3.0 (2025/03/17, Matthew Kuhn, CTAN/MiKTeX package ascelike: ascelike.cls, .bst, .bbx, .cbx), the ASCE manuscript
 * format, under the ascelike setting (option Journal, XeTeX). Not measured by the class probe (batch 2, b2p). The class is
 * in no local tree: fields are read from CTAN's ascelike.cls v3.0 (macros/latex/contrib/ascelike, read 2026-11-04) and from
 * the setting's description (the CI session's reading, whose line numbers l.652 and l.777-781 are cited); other lines are
 * named by construct, as their numbers were not counted locally.
 * - Base: \LoadClass[oneside,onecolumn,letterpaper,final,\ptsize]{article}, \ptsize 12pt by default (\ExecuteOptions{12pt,
 *   Journal}).
 * - Preloads: ifthen; babel [american]; newtxtext (on XeTeX it sets TeX Gyre Termes X through fontspec); newtxmath, which
 *   loads amsmath with no options; microtype [final,nopatch=footnote]; authblk; caption (no options). Journal turns on
 *   DoubleSpace and LineNumbers, and an \AtBeginDocument block then loads setspace and lineno (\linenumbers); both are
 *   preloads, since the class loads them before any body text. So amsmath with fleqn or leqno (math.amsmath@flush-left)
 *   clashes with newtxmath's amsmath.
 * - Citations: with biblatex, the class passes backend=biber,uniquename=init,style=ascelike (l.652; the branch's own options
 *   come later and win) and makes \cite one argument (\renewcommand\cite[1]{\parencite{#1}}); without it, at
 *   \begin{document} it saves \cite as \@internalcite, re-makes \cite, \citeN, \citeNP, \citeA, \citeyear and \@citex
 *   (kernel style) and empties \@biblabel, with no test for natbib or cite (l.777-781 writes only a log note). natbib
 *   re-sets \@citex in its own \AtBeginDocument hook, which runs later; cite.sty's \@citex is overwritten. Neither is a TeX
 *   error, so neither is refused: the probe cases show what they print. Under BibTeX's biblatex (bib.biblatex-bibtex, denied
 *   in its key, and General's bibliography, which the host refuses for that denial: latexLib.ts `latexLibClasses`) the class's
 *   \bibstyle{ascelike} comes first in main.aux and BibTeX makes no .bbl biblatex can read (no-bbl in 236 of 299 such cells in
 *   GitHub run b12-5bdc624; probe b27-1 B2PROF-ascelike-old); biblatex is not in `forbids.technical`, as bib.biblatex-biber
 *   (biber writes no \bibstyle) passes (213 of 230 branches).
 * - Page: \textwidth 6.5in (469.75499pt), \textheight 9in, plain lengths (no geometry), 12pt, one column.
 * - Names: \section, \subsection, \subsubsection, abstract, thebibliography, \appendix (with \Appendix and \sAppendix),
 *   enumerate and itemize are redefined; \KeyWords is new; authblk gives \author[..] and \affil. No theorem environments.
 */
export default defineClass({
  id: 'class.ascelike',
  name: "ascelike",
  base: 'class.article',
  targetEngine: "untested",
  preloads: [{"pkg": "ifthen"}, {"pkg": "babel", "options": ["american"]}, {"pkg": "newtxtext"}, {"pkg": "fontspec"}, {"pkg": "newtxmath"}, {"pkg": "amsmath"}, {"pkg": "microtype", "options": ["final", "nopatch=footnote"]}, {"pkg": "authblk"}, {"pkg": "caption"}, {"pkg": "setspace"}, {"pkg": "lineno"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\Appendix", "cmd:\\sAppendix", "cmd:\\KeyWords", "cmd:\\affil", "cmd:\\citeN", "cmd:\\citeNP", "cmd:\\citeA", "cmd:\\citedata", "cmd:\\NameTag", "cmd:\\citeyear"],
  // A title with no \author (Flouest's title before an author is typed; every title of batch 4's matrix has none) stops at
  // ascelike's \maketitle: authblk's \maketitle runs the class's \@maketitle, which writes {\AB@authlist \\[3mm]} in a centre
  // environment (read from the engine's log: \meaning\@maketitle), and with no author \AB@authlist is empty, so the \\ ends no
  // line. The hook gives authblk an empty author only then; a document with authors is unchanged (same PDF after its header,
  // compat cases 2026-11-10).
  setup: {
    after: ['\\makeatletter\\AddToHook{cmd/maketitle/before}{\\ifx\\AB@authlist\\@empty\\author{}\\fi}\\makeatother'],
    reason:
      "with no \\author, ascelike's \\maketitle (authblk's, around the class's \\@maketitle: {\\AB@authlist \\\\[3mm]}) stops at \"There's no line here to end\", whichever title way prints it (front.maketitle, front.class-native, front.author-blocks, front.authblk, General's title), and front.titling's \\maketitle at \"Argument of \\renew@command has an extra }\" or, in titlingpage, an Emergency stop at \"Unbalanced write command\"; the line gives authblk an empty author before \\maketitle only when none was given. The testing pipeline's ascelike setting carries it too",
    evidence: [
      { kind: 'compile', cell: "batch 4 round 2, ascelike.A: 103 cells stop at \"There's no line here to end\" at \\maketitle (document d2454d55735fa3ec257ed, result f5f65ad2b9ce, l.26), 0 of 17 to 35 branches pass for each of front.maketitle, front.class-native, front.author-blocks, front.authblk and front.titling (\\renew@command: document d2533ad3d86cbba7a8003, result 650c9ad16563, l.27; Emergency stop: document d8bf6cc8547aa5edcebf2, result 517c7a24f66b, l.34 \\end{titlingpage}); no title branch of the run has an author" },
      { kind: 'compile', reproducer: "\\documentclass[Journal]{ascelike} \\begin{document} \\title{A title} \\maketitle Text. \\end{document}: \"There's no line here to end\"; with \\author{} or \\author{Ann Author}, or with this line, none. titling's \\maketitle (front.titling's hooks, with and without titlingpage) with no author: \\renew@command, Emergency stop; with the line, none. \\author[1]{…}\\author[2]{…}\\affil[1]{…}\\affil[2]{…}: the same PDF with and without the line (ZeroTeX-NG through compat cases, 2026-11-10)" },
    ],
  },
  options: {
    Proceedings: { unloads: ["setspace", "lineno"], description: "single spaced, no line numbers: DoubleSpace and LineNumbers stay off, so the \\AtBeginDocument block loads neither setspace nor lineno (the bundle's example uses it; the setting gives Journal)" },
  },
  forbids: {
    technical: [
    ],
    policy: [],
  },
  layout: { columns: 1, textwidth: "469.75499pt", fontsize: "12pt" },
  vocabulary: {"\\KeyWords": "keywords", "\\affil": "an affiliation (authblk)"},
  evidence: [
    { kind: 'manual', of: 'ascelike', section: 'ascelike.cls v3.0 (2025/03/17): options, package loads, \\AtBeginDocument blocks', url: 'https://ctan.org/pkg/ascelike' },
    { kind: 'source', file: 'ascelike.cls (ascelike 2025/03/17 v3.0, MiKTeX 9766)', line: '652 (\\PassOptionsToPackage{backend=biber,...,style=ascelike}{biblatex}), 777-781 (no biblatex: log note, BibTeX \\cite code), as testing-pipeline/settings/classes/ascelike.json cites' },
    { kind: 'source', file: 'ascelike.cls (ascelike 2025/03/17 v3.0, CTAN)', line: '\\LoadClass[oneside,onecolumn,letterpaper,final,\\ptsize]{article}; \\RequirePackage of babel, newtxtext, newtxmath, microtype, authblk, caption; \\AtBeginDocument setspace/lineno; \\setlength{\\textwidth}{6.50in}' },
  ],
});
