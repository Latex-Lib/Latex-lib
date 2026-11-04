import { defineClass } from '../schema/class.ts';

/**
 * ICLR 2027: plain article with iclr2027_conference.sty (Master-Template commit 46ed6f4), loaded by the iclr setting as
 * \usepackage{iclr2027_conference} then \iclrfinalcopy. Not measured by the class probe (batch 2, b2p): every field is read
 * from the pinned style file, testing-pipeline/settings/classes/files/iclr2027_conference.sty (sha256 797deef4...).
 * - Preloads: eso-pic (l.18), fancyhdr (l.19, again l.78), natbib with no options (l.20, then \setcitestyle{authoryear,
 *   round,...}, l.23). natbib makes biblatex and apacite refused through their package facts, and every natbib way that
 *   gives an option an option clash.
 * - Page: \textwidth 5.5 true in, \textheight 9 true in on 8.5in x 11in (l.36-49), set with plain lengths (no geometry);
 *   \normalsize 10pt on 11pt (l.173). One column.
 * - Names: \section..\subparagraph redefined with \@startsection (l.108-121), article's counters stay; \maketitle and
 *   \@maketitle replaced (l.60-102; it relaxes itself after use, as article's does), abstract redefined (l.104).
 *   \addcontentsline is emptied (l.57), so \tableofcontents prints an empty list (no error).
 * - XeTeX: the template's `times` is left to the document; \font\iclrtenhv = phvb (l.32) is a TFM XeTeX loads.
 * Its name is "article", the setting's class, as latexLib's check requires; base class.article.
 */
export default defineClass({
  id: 'class.iclr',
  name: "article",
  base: 'class.article',
  zerotex: "untested",
  preloads: [{"pkg": "eso-pic"}, {"pkg": "fancyhdr"}, {"pkg": "natbib"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\iclrfinalcopy", "cmd:\\subsubsubsection", "cmd:\\toptitlebar", "cmd:\\bottomtitlebar", "cmd:\\iclrruler"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "397.48499pt", fontsize: "10pt" },
  vocabulary: {"\\iclrfinalcopy": "camera-ready / arXiv mode: authors shown", "\\And": "author separator on one line", "\\AND": "author separator starting a new line"},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/iclr2027_conference.sty', line: '18-23 (eso-pic, fancyhdr, natbib, \\setcitestyle)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/iclr2027_conference.sty', line: '28-49 (\\iclrfinalcopy, \\iclrtenhv, page lengths)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/iclr2027_conference.sty', line: '57-104 (\\addcontentsline emptied, \\maketitle, abstract)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/iclr2027_conference.sty', line: '108-121, 173 (headings, \\normalsize)' },
  ],
});
