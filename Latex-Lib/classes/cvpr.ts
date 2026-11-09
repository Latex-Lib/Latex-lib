import { defineClass } from '../schema/class.ts';

/**
 * The CVPR/ICCV/3DV author kit's style (class setting cvpr): article with 10pt, twocolumn and letterpaper and
 * `\usepackage{cvpr}`, cvpr.sty release CVPR2027-v1 (2026-10-28) from github.com/cvpr-org/author-kit, camera-ready mode (no
 * option). Not measured by the class probe: every field is read from the pinned cvpr.sty (b2p, batch 2).
 * Preloads, in load order (l.30-50, 71, 181, 504): times, xspace, xcolor with dvipsnames, graphicx, amsmath (no option: a way that
 * gives fleqn or leqno meets "Option clash"), amssymb, booktabs, natbib with numbers and sort&compress (bib.natbib's authoryear
 * and other presets clash; numbers and sort&compress fit), silence, etoolbox, caption and subcaption with the options below, url
 * with hyphens, keyval and enumitem with shortlabels and inline (whose facts refuse enumerate and paralist). color loads at
 * \begin{document} (l.188).
 * cleveref loads with capitalize in \AtEndPreamble (l.493-499), after every package of the document's preamble. A way's own
 * \usepackage{cleveref} therefore comes first, and the style's later load with capitalize, an option the first did not give (no
 * xref.cleveref preset gives `capitalize`; capitalise is another option name), stops at "Option clash for package cleveref".
 * Preloads model a class package loaded before the document's, so the clash is written as a refusal (`forbids.technical`).
 * Its numbered \section, \subsection and \subsubsection print \texorpdfstring (l.326-342), which only hyperref defines: the
 * setting must load hyperref or provide \texorpdfstring (notes for the CI session, b2p G5), or every numbered heading stops.
 * The same \section, \subsection and \subsubsection are \@ifstar wrappers (l.326-342), not \@startsection, so titlesec
 * extracts no format for them, and a heading at a level the document gives no \titleformat stops at "Package titlesec Error:
 * No format for this command" (run b28-e9f730a: 488 branches); the setting gives titlesec the style's formats in a
 * package/titlesec/after hook (b29 B2A, as asmeconf's), so titlesec stays allowed.
 * Text block 6.875in by 8.875in (l.232-234); two columns from the class option.
 * The names after article's are the style's own: eso-pic and everyshi inlined (l.72-180: a later \usepackage{eso-pic} or
 * {everyshi} meets "already defined"), \thetitle (made by its \title, l.476), \maketitlesupplementary and the Latin abbreviations.
 */
export default defineClass({
  id: 'class.cvpr',
  name: "article",
  base: 'class.article',
  targetEngine: "untested",
  preloads: [{"pkg": "times"}, {"pkg": "xspace"}, {"pkg": "xcolor", "options": ["dvipsnames"]}, {"pkg": "graphicx"}, {"pkg": "amsmath"}, {"pkg": "amssymb"}, {"pkg": "booktabs"}, {"pkg": "natbib", "options": ["numbers", "sort&compress"]}, {"pkg": "silence"}, {"pkg": "etoolbox"}, {"pkg": "caption", "options": ["format=plain", "labelformat=simple", "labelsep=period", "font=small", "compatibility=false"]}, {"pkg": "subcaption", "options": ["font=footnotesize", "skip=3pt", "subrefformat=parens"]}, {"pkg": "url", "options": ["hyphens"]}, {"pkg": "keyval"}, {"pkg": "enumitem", "options": ["shortlabels", "inline"]}, {"pkg": "cleveref", "options": ["capitalize"]}, {"pkg": "color"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\EveryShipout", "cmd:\\AtNextShipout", "cmd:\\LenToUnit", "cmd:\\AtPageUpperLeft", "cmd:\\AtPageLowerLeft", "cmd:\\AtPageCenter", "cmd:\\AtTextUpperLeft", "cmd:\\onedot", "cmd:\\eg", "cmd:\\ie", "cmd:\\cf", "cmd:\\etc", "cmd:\\vs", "cmd:\\wrt", "cmd:\\etal", "cmd:\\maketitlesupplementary"],
  options: {},
  forbids: {
    technical: [
      {
        pkg: "cite",
        reason: "cvpr.sty loads natbib with numbers and sort&compress (l.37), whose \\NAT@set@cites at \\begin{document} installs a two-optional \\@citex (natbib.sty 8.31b l.375, l.645-674); cite.sty, which only bib.cite-pkg loads, redefines \\cite to call \\@citex with one optional argument (cite.sty v5.5 l.302-307), so every citation scans on to the paragraph's end: 'Paragraph ended before \\@citex was complete' (as elsarticle and aa; b2p probe: G2-apa7-cite, G2-oup-authoring-template-cite and G4-asmeconf-citepkg, the same natbib-then-cite order; added at the b2p merge, as the G4 and G5 natbib styles have it)",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/cvpr.sty (CVPR2027-v1)', line: '37 (\\RequirePackage[numbers,sort&compress]{natbib})' }],
      },
      {
        pkg: "cleveref",
        reason: "cvpr.sty loads cleveref with capitalize in \\AtEndPreamble (l.493-499), after the document's preamble: a way's own \\usepackage{cleveref}, with no option or with capitalise, nameinlink or noabbrev, comes first, and the style's later \\usepackage[capitalize]{cleveref} asks for an option the first load did not give, so LaTeX stops at 'Option clash for package cleveref'",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/cvpr.sty (CVPR2027-v1)', line: '491-499 (\\AtEndPreamble{\\usepackage[capitalize]{cleveref} ...})' }],
      },
    ],
    policy: [],
  },
  layout: { columns: 2, textwidth: "496.85625pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/cvpr.sty (CVPR2027-v1)', line: '30-50 (times, xspace, xcolor dvipsnames, graphicx, amsmath, amssymb, booktabs, natbib numbers sort&compress, silence, etoolbox, caption, subcaption), 71 (url hyphens), 181 (keyval), 188 (color at \\begin{document}), 504 (enumitem shortlabels inline)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/cvpr.sty (CVPR2027-v1)', line: '72-180 (eso-pic and everyshi inlined: \\EveryShipout l.79, \\LenToUnit l.112), 232-234 (\\textheight 8.875in, \\textwidth 6.875in, \\columnsep 0.3125in), 248-262 (article and twocolumn checks)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/cvpr.sty (CVPR2027-v1)', line: '326-342 (\\section, \\subsection, \\subsubsection print \\texorpdfstring), 459-470 (\\onedot, \\eg ... \\etal), 475-487 (\\title makes \\thetitle; \\maketitlesupplementary), 491-499 (cleveref in \\AtEndPreamble)' },
  ],
});
