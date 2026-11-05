import { defineClass } from '../schema/class.ts';

/**
 * CoRL 2026: plain article with corl_2026.sty ('2026/08/15 CORL2026 submission/preprint/camera-ready style file'), loaded by
 * the corl setting as \usepackage[final]{corl_2026}. Not measured by the class probe (batch 3, b3p G4): every field is read from
 * the pinned style file, testing-pipeline/settings/classes/files/corl_2026.sty (sha256 62f38cd8...), whose line numbers are cited.
 * - Preloads: lineno and color (l.73-74, always), natbib [square,numbers] with \bibliographystyle{corlabbrvnat} (l.76-80; only
 *   the nonatbib option, which the setting does not give, leaves both out), hyperref with no option (l.83; its nohyperref option
 *   only skips the \hypersetup block, l.100), geometry [verbose=true,letterpaper] (l.84). natbib makes biblatex (General's
 *   bibliography and the library's biblatex ways) and apacite refused through their package facts, and makes every natbib way
 *   that gives another option (authoryear, super, round, sort, sort&compress, comma, semicolon) an option clash; hyperref with
 *   an option (hidelinks, colorlinks, ...) and geometry with others are option clashes the same way. natbib's numbers and square
 *   alone do fit, so bib.natbib's default preset is kept off by a deny (the second \bibstyle), not by its options.
 * - Refuses cite: natbib's \NAT@set@cites gives \@citex two optional arguments, cite.sty one ('Paragraph ended before \@citex
 *   was complete'), as for cvpr and asmeconf.
 * - Page: \newgeometry at \begin{document} (l.85-97) sets a 5.5in x 9in block on US letter whatever the document set; \normalsize
 *   is 10pt (l.212-218). One column.
 * - Names: \section..\subparagraph are redefined with \@startsection (l.237-273), article's counters stay; table, abstract and
 *   \maketitle are redefined (l.290, l.452, l.342-362; \maketitle then \let's \thanks to \relax); \keywords is \def'd (l.378),
 *   \acknowledgments, \doi and \subsubsubsection are provided (l.130-136, l.193, l.272), so a way's \newcommand of one of them
 *   stops at "already defined".
 * - final: no line numbers (\linenumbers and the linenomath patches of amsmath's environments run only in submission mode,
 *   l.147-191), the notice is the proceedings line (l.142-146).
 * - XeTeX: \rmdefault ptm and \sfdefault phv (l.126-127) have no TU shapes; General's fontspec lines give Latin Modern with font
 *   warnings, no error (as neurips).
 * Its name is "article", the setting's class, as latexLib's check requires; base class.article, so a key's article rule holds.
 */
export default defineClass({
  id: 'class.corl',
  name: "article",
  base: 'class.article',
  zerotex: "untested",
  preloads: [{"pkg": "lineno"}, {"pkg": "color"}, {"pkg": "natbib", "options": ["square", "numbers"]}, {"pkg": "hyperref"}, {"pkg": "geometry", "options": ["verbose=true", "letterpaper"]}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\keywords", "cmd:\\acknowledgments", "cmd:\\doi", "cmd:\\subsubsubsection"],
  options: {},
  forbids: {
    technical: [
      {
        pkg: "cite",
        reason: "corl_2026.sty loads natbib with square and numbers (l.78), whose \\NAT@set@cites at \\begin{document} installs a two-optional \\@citex; cite.sty, which only bib.cite-pkg loads, redefines \\cite to call \\@citex with one optional argument, so every citation scans on to the paragraph's end: 'Paragraph ended before \\@citex was complete' (as cvpr and asmeconf; b2p probe G4-asmeconf-citepkg)",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/corl_2026.sty (2026/08/15)', line: '76-80 (\\if@natbib \\RequirePackage[square,numbers]{natbib} \\bibliographystyle{corlabbrvnat})' }],
      },
    ],
    policy: [],
  },
  layout: { columns: 1, textwidth: "397.48499pt", fontsize: "10pt" },
  vocabulary: {"\\keywords": "the paper's keywords, printed under the abstract and written to the PDF's keywords", "\\acknowledgments": "the acknowledgments, printed only in final and preprint modes"},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/corl_2026.sty (2026/08/15)', line: '40-68 (options final, preprint, nonatbib, nohyperref), 73-84 (lineno, color, natbib [square,numbers], hyperref, geometry [verbose=true,letterpaper])' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/corl_2026.sty (2026/08/15)', line: '85-97 (\\newgeometry 5.5in x 9in at \\begin{document}), 100-120 (\\hypersetup colours), 126-127 (ptm, phv)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/corl_2026.sty (2026/08/15)', line: '130-191 (\\acknowledgments; notice; lineno only in submission mode), 193 (\\doi), 237-273 (headings), 290 (table), 342-362 (\\maketitle), 378 (\\keywords), 452 (abstract)' },
  ],
});
