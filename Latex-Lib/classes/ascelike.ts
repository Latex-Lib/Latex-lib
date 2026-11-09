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
