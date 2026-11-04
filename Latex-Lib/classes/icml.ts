import { defineClass } from '../schema/class.ts';

/**
 * ICML 2026: plain article with icml2026.sty ('version of 2025-10-29'), loaded by the icml setting as
 * \usepackage[preprint]{icml2026}. Not measured by the class probe (batch 2, b2p): every field is read from the pinned style
 * file, testing-pipeline/settings/classes/files/icml2026.sty (sha256 7cdcf90f...), and from algorithm.sty and algorithmic.sty
 * (the algorithms bundle, as in icml2026.zip: Latex Related Research/Latex-lib-main/Source/0461-icml/).
 * - Preloads (l.116-127): times, fancyhdr, xcolor (no options), algorithm (which loads float and ifthen, algorithm.sty
 *   l.9-10), algorithmic (ifthen, calc, algorithmic.sty l.13-14), natbib (no options), eso-pic, forloop, url, caption (no
 *   options). natbib makes biblatex and apacite refused through their facts, and every natbib way giving an option an option
 *   clash; float makes floatrow refused (floatrow's facts); xcolor without options makes xcolor[table] (tbl.colortbl's
 *   zebra rows) an option clash.
 * - Page: \textwidth 6.75in (487.8225pt), \textheight 9in, \columnsep 0.25in (l.261-263) by plain lengths, and the style
 *   calls \twocolumn itself in the preamble (l.333): two columns, so a key with a one-column rule fits no ICML cell.
 * - geometry is refused: at \begin{document} the style compares thirteen layout lengths with its own (l.274-300) and, when
 *   any differs, typesets a warning paragraph ("The page layout violates the ICML style") into the first page instead of
 *   stopping. geometry recomputes the layout as soon as it loads, so any branch loading it gets that paragraph and a layout
 *   that is not ICML's. No library way loads geometry today; the rule keeps a future one out.
 * - Names: \@startsection, \@sect and \section..\subparagraph are redefined (l.564-622; counters stay article's); abstract
 *   redefined (l.556); \addcontentsline is emptied (l.337), so \tableofcontents prints an empty list (no error). It defines
 *   the icmlauthorlist environment (l.426), the algorithm float (float's \newfloat, algorithm.sty l.62-74) and algorithmic
 *   environment (algorithmic.sty l.85). \maketitle stays article's: the ICML title block is \twocolumn[\icmltitle...].
 * - XeTeX: times' ptm has no TU shapes (Latin Modern with font warnings); the \pdfpagewidth block (l.239-254) is skipped and
 *   the xetex driver sets letter paper (article's default, which l.290's paperwidth check expects).
 * Its name is "article", the setting's class, as latexLib's check requires; base class.article.
 */
export default defineClass({
  id: 'class.icml',
  name: "article",
  base: 'class.article',
  zerotex: "untested",
  preloads: [{"pkg": "times"}, {"pkg": "fancyhdr"}, {"pkg": "xcolor"}, {"pkg": "algorithm"}, {"pkg": "float"}, {"pkg": "ifthen"}, {"pkg": "algorithmic"}, {"pkg": "calc"}, {"pkg": "natbib"}, {"pkg": "eso-pic"}, {"pkg": "forloop"}, {"pkg": "url"}, {"pkg": "caption"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "env:algorithm", "env:algorithmic", "env:icmlauthorlist", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\icmltitle", "cmd:\\icmltitlerunning", "cmd:\\icmlauthor", "cmd:\\icmlaffiliation", "cmd:\\icmlcorrespondingauthor", "cmd:\\icmlkeywords", "cmd:\\printAffiliationsAndNotice", "cmd:\\icmlEqualContribution", "cmd:\\listofalgorithms"],
  options: {},
  forbids: {
    technical: [
      { pkg: "geometry", reason: "icml2026.sty checks thirteen layout lengths at \\begin{document} (l.274-300) and, when one differs from ICML's, typesets 'The page layout violates the ICML style' and a list of the altered lengths into the first page; geometry recomputes the layout on loading, so every branch loading it prints that paragraph and leaves the ICML page", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/icml2026.sty', line: '274-300' }] },
    ],
    policy: [],
  },
  layout: { columns: 2, textwidth: "487.8225pt", fontsize: "10pt" },
  vocabulary: {"\\icmltitle": "the paper title (inside \\twocolumn[...])", "\\icmlauthor": "an author with affiliation keys", "\\icmlaffiliation": "an affiliation by key", "\\icmlcorrespondingauthor": "corresponding author and email", "\\icmlkeywords": "keywords (PDF metadata)", "\\printAffiliationsAndNotice": "prints the affiliation footnote and the notice"},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/icml2026.sty', line: '116-127 (times, fancyhdr, xcolor, algorithm, algorithmic, natbib, eso-pic, forloop, url, caption)' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0461-icml/algorithm.sty', line: '9-10 (float, ifthen), 62-74 (\\newfloat{algorithm})' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/icml2026.sty', line: '239-263, 333 (page size, lengths, \\twocolumn)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/icml2026.sty', line: '274-300 (layout check)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/icml2026.sty', line: '337, 426, 556, 564-622 (\\addcontentsline, icmlauthorlist, abstract, headings)' },
  ],
});
