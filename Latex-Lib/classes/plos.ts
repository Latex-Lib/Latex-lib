import { defineClass } from '../schema/class.ts';

/**
 * PLOS: plain article [10pt,letterpaper] with the layout lines of PLOS's LaTeX template (plos_latex_template.tex of 2026-04-10)
 * as the plos setting's preamble, and plos2025.bst. PLOS has no class or style file, so every field is read from the setting's
 * preamble, testing-pipeline/settings/classes/plos.json (preamble lines cited as p.N, from 1), which runs right after
 * \documentclass, before General's and the ways' packages. Not measured by the class probe (batch 3, b3p G4).
 * - Preloads, in load order: geometry [top=0.85in,left=2.75in,footskip=0.75in] (p.1), changepage (p.2), textcomp and marvosym
 *   (p.3), nameref (p.4), lineno [right] (p.5), microtype [nopatch=eqnum] (p.6), xcolor [table] (p.7), array (p.8), caption
 *   [aboveskip=1pt,labelfont=bf,labelsep=period,justification=raggedright,singlelinecheck=off] (p.17), lastpage, fancyhdr and
 *   graphicx (p.21). A way that loads one of them with another option stops at "Option clash" (geometry with its own margins,
 *   xcolor with dvipsnames or svgnames, caption with its own format); one with no option, or the same ones, loads nothing.
 * - colortbl is loaded by xcolor's table option but is not listed: arydshln's facts refuse colortbl loaded after arydshln, and here
 *   colortbl always comes first (p.7), the order in which arydshln adapts itself to colortbl, so General's and the library's
 *   arydshln stay fit. A way's own \usepackage{colortbl} loads nothing.
 * - \bibliographystyle{plos2025} (p.19) runs in the preamble, before any way's package, so main.aux always opens with
 *   \bibstyle{plos2025}: every reference-list way that writes its own style (bib.bibtex-bst, bib.natbib, bib.cite-pkg, bib.apacite)
 *   and biblatex with backend=bibtex (bib.biblatex-bibtex, and General's bibliography, which is that biblatex) write a second
 *   one, which BibTeX rejects ('Illegal, another \bibstyle command'), as under ascelike, acl and jmlr. Those keys deny plos;
 *   bib.biblatex-biber (biber reads the .bcf, not \bibstyle) and bib.thebibliography stay. plos2025.bst itself is used by no way.
 *   \@biblabel prints '\quad N.' (p.20).
 * - Names: article's, and the template's \thickcline and \thickhline with the length \savedwidth (p.10-12) and the + column type
 *   (p.9), so a way's \newcommand of one of them stops at "already defined".
 * - Page: \textwidth 5.25in and \textheight 8.75in (p.15-16) after geometry's margins; the left margin is 2.75in with the footer
 *   offset 2.25in into it (p.27-28); \raggedright with a 0.5cm \parindent (p.13-14); 10pt, one column.
 * Its name is "article", the setting's class, as latexLib's check requires; base class.article, so a key's article rule holds.
 */
export default defineClass({
  id: 'class.plos',
  name: "article",
  base: 'class.article',
  zerotex: "untested",
  preloads: [{"pkg": "geometry", "options": ["top=0.85in", "left=2.75in", "footskip=0.75in"]}, {"pkg": "changepage"}, {"pkg": "textcomp"}, {"pkg": "marvosym"}, {"pkg": "nameref"}, {"pkg": "lineno", "options": ["right"]}, {"pkg": "microtype", "options": ["nopatch=eqnum"]}, {"pkg": "xcolor", "options": ["table"]}, {"pkg": "array"}, {"pkg": "caption", "options": ["aboveskip=1pt", "labelfont=bf", "labelsep=period", "justification=raggedright", "singlelinecheck=off"]}, {"pkg": "lastpage"}, {"pkg": "fancyhdr"}, {"pkg": "graphicx"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\thickcline", "cmd:\\thickhline", "cmd:\\savedwidth"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "379.4175pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/plos.json (preamble, from plos_latex_template.tex of 2026-04-10)', line: 'p.1-8 (geometry [top=0.85in,left=2.75in,footskip=0.75in], changepage, textcomp, marvosym, nameref, lineno [right], microtype [nopatch=eqnum], xcolor [table], array)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/plos.json (preamble, from plos_latex_template.tex of 2026-04-10)', line: 'p.9-16 (+ column type, \\savedwidth, \\thickcline, \\thickhline, \\raggedright, \\parindent, \\textwidth 5.25in, \\textheight 8.75in), p.17 (caption), p.19-20 (\\bibliographystyle{plos2025}, \\@biblabel)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/plos.json (preamble, from plos_latex_template.tex of 2026-04-10)', line: 'p.21-29 (lastpage, fancyhdr, graphicx; the fancy footer offset 2.25in into the margin)' },
  ],
});
