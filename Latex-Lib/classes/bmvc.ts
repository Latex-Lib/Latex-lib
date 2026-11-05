import { defineClass } from '../schema/class.ts';

/**
 * BMVC: bmvc2k.cls v0.22 (2026/04/02) with its renamed natbib copy bmvc2k_natbib.sty, from the BMVA's BMVCTemplate. Not measured
 * by the class probe (batch 3, b3p G4): every field is read from the pinned files in testing-pipeline/settings/classes/files/
 * (bmvc2k.cls sha256 a4a9eb5c..., bmvc2k_natbib.sty 7351a465...), whose line numbers are cited.
 * - Base: \LoadClass[10pt,twoside]{article} (l.145; the extendedabs option, which the setting does not give, loads it on A5 in
 *   two columns instead, l.128-142), so article's counters, environments, \tableofcontents and \appendix stay.
 * - Preloads, in load order: xcolor, graphicx, subfigure, xspace, eso-pic (l.150-153), url (l.156), hyperref
 *   [colorlinks,urlcolor=blue,citecolor=red,bookmarks=false] (l.158), amsmath (l.164), geometry [twoside,headsep=3mm,
 *   papersize={410pt,620pt},inner=9mm,outer=6mm,top=3mm,includehead,bottom=5mm,heightrounded] (l.246), fontenc [T1], mathptmx,
 *   helvet, courier (l.255-257), and natbib [sort,numbers] as bmvc2k_natbib (l.714). The setting's second preamble line records
 *   natbib.sty as loaded with sort,numbers (\@namedef{ver@natbib.sty}, \@namedef{opt@natbib.sty}), so a way's \usepackage{natbib}
 *   with numbers or sort does nothing and one with any other option (square, round, authoryear, super, sort&compress, ...) stops
 *   at "Option clash for package natbib", which this preload's options give. natbib makes biblatex and apacite refused through
 *   their package facts; hyperref with any other option, amsmath with fleqn or leqno, and geometry with other options are option
 *   clashes the same way. \bibliographystyle{plainnat} is set while the class loads (l.775), so the reference-list ways that write
 *   their own style are denied in their keys (bib.bibtex-bst, bib.natbib: a second \bibstyle).
 * - Refuses cite: natbib's two-optional \@citex against cite.sty's one ('Paragraph ended before \@citex was complete'), as for
 *   cvpr and corl.
 * - Page: a 410pt x 620pt page with inner 9mm and outer 6mm margins (l.246), so the text is 410pt - 15mm = 367.32pt wide; 10pt,
 *   one column (\maketitle is \bmv@maketitle, l.548; only extendedabs makes it \twocolumn[...], l.546).
 * - Names: \section, \subsection and \subsubsection are redefined with \@startsection (l.608-619); \maketitle is \bmv@maketitle,
 *   and a second \maketitle only prints a message (l.525-548); \addauthor, \addinstitution (l.380, l.407), \runninghead (l.554),
 *   \bmvaOneDot (l.171), \bmvaUrl (l.162) and \bmvcreviewcopy (l.123) are its own; subfigure brings \subfigure, \subtable and
 *   their counters. The page heads from page 2 print \BMVA@author and \BMVA@title, which only \runninghead defines (l.554-597):
 *   the setting's first preamble line gives it.
 * - XeTeX: the pdfTeX code (\pdfcatalog, the citation annotations with \pdfxform and \pdfannot) runs only when \pdfoutput is
 *   positive (\ifbmv@pdf, l.88-100, l.752-770); \Hy@StartlinkName (l.719-750) is called only by hyperref's pdfTeX and LuaTeX
 *   drivers. mathptmx keeps Times maths; General's fontspec lines give Latin Modern text.
 * - b3p-1 probe (verify-V2): titlesec stops at "Entered in horizontal mode" on any level whose class style it keeps (\textcolor,
 *   l.608-619): refused.
 */
export default defineClass({
  id: 'class.bmvc',
  name: "bmvc2k",
  base: 'class.article',
  zerotex: "untested",
  preloads: [{"pkg": "xcolor"}, {"pkg": "graphicx"}, {"pkg": "subfigure"}, {"pkg": "xspace"}, {"pkg": "eso-pic"}, {"pkg": "url"}, {"pkg": "hyperref", "options": ["colorlinks", "urlcolor=blue", "citecolor=red", "bookmarks=false"]}, {"pkg": "amsmath"}, {"pkg": "geometry", "options": ["twoside", "headsep=3mm", "papersize={410pt,620pt}", "inner=9mm", "outer=6mm", "top=3mm", "includehead", "bottom=5mm", "heightrounded"]}, {"pkg": "fontenc", "options": ["T1"]}, {"pkg": "mathptmx"}, {"pkg": "helvet"}, {"pkg": "courier"}, {"pkg": "natbib", "options": ["sort", "numbers"]}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "counter:subfigure", "counter:subtable", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\addauthor", "cmd:\\addinstitution", "cmd:\\runninghead", "cmd:\\bmvaOneDot", "cmd:\\bmvaUrl", "cmd:\\bmvcreviewcopy", "cmd:\\subfigure", "cmd:\\subtable"],
  options: {},
  forbids: {
    technical: [
      {
        pkg: "cite",
        reason: "bmvc2k.cls loads its natbib copy bmvc2k_natbib.sty with sort and numbers (l.714), whose \\NAT@set@cites at \\begin{document} installs a two-optional \\@citex; cite.sty, which only bib.cite-pkg loads, redefines \\cite to call \\@citex with one optional argument, so every citation scans on to the paragraph's end: 'Paragraph ended before \\@citex was complete' (as cvpr and asmeconf; b2p probe G4-asmeconf-citepkg)",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/bmvc2k.cls (v0.22, 2026/04/02)', line: '714 (\\usepackage[sort,numbers]{bmvc2k_natbib}), 775 (\\bibliographystyle{plainnat})' }],
      },
      { pkg: "titlesec", reason: "bmvc2k.cls redefines \\section, \\subsection and \\subsubsection with heading styles that end in \\flushleft\\textcolor{bmv@sectioncolor} (l.608-619); \\textcolor starts a paragraph (\\leavevmode), so titlesec, which runs the extracted style of each level a way does not \\titleformat, stops at \"Package titlesec Error: Entered in horizontal mode\"", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/bmvc2k.cls (v0.22, 2026/04/02)', line: '608-619 (\\section... styles with \\textcolor)' }, { kind: 'compile', cell: 'b3p-1 probe (C:/dev/template-ai/probes/b3p-1/probe) G4-bmvc-cite main.log l.1276, 1347 (\\subsection in a doc that reformats only section, subsubsection, paragraph and part)' }] },
    ],
    policy: [],
  },
  layout: { columns: 1, textwidth: "367.32087pt", fontsize: "10pt" },
  vocabulary: {"\\addauthor": "an author: \\addauthor{name}{email}{institution number}", "\\addinstitution": "an institution, numbered in order of use", "\\runninghead": "the page heads' short author and title: \\runninghead{authors}{title}", "\\bmvcreviewcopy": "the anonymous review copy with the paper number"},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/bmvc2k.cls (v0.22, 2026/04/02)', line: '88-100 (\\ifbmv@pdf), 117-145 (extendedabs, \\bmvcreviewcopy, \\LoadClass[10pt,twoside]{article}), 150-164 (xcolor, graphicx, subfigure, xspace, eso-pic, url, hyperref [colorlinks,urlcolor=blue,citecolor=red,bookmarks=false], amsmath)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/bmvc2k.cls (v0.22, 2026/04/02)', line: '246 (geometry, 410pt x 620pt), 255-257 (fontenc T1, mathptmx, helvet, courier), 380-407 (\\addauthor, \\addinstitution), 525-548 (\\maketitle), 554-597 (\\runninghead and the page heads), 608-619 (headings)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/bmvc2k.cls (v0.22, 2026/04/02)', line: '714 (bmvc2k_natbib [sort,numbers]), 719-770 (\\Hy@StartlinkName, pdfTeX citation annotations), 775 (\\bibliographystyle{plainnat})' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/bmvc2k_natbib.sty', line: '553-555 (\\newlength\\bibhang, \\bibsep: a second natbib stops at "already defined", which the setting\'s ver@natbib.sty line prevents)' },
  ],
});
