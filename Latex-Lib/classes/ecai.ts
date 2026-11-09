import { defineClass } from '../schema/class.ts';

/**
 * ECAI: ecai.cls ('2023/12/10 v04 ECAI document class', file of 2024-01-03), from ecai-template.zip on ecai2025.org (README
 * 'Latest revision: 2025-04-01'). Not measured by the class probe (batch 3, b3p G4): every field is read from the pinned class,
 * testing-pipeline/settings/classes/files/ecai.cls (sha256 607a1587...), whose line numbers are cited.
 * - A class of its own (no \LoadClass): it copies article's code, so it has article's sectioning counters (l.854-859), \part,
 *   \section..\subparagraph with \@startsection (l.898-917), \tableofcontents (l.1083), \appendix (l.1012), figure, table,
 *   thebibliography, abstract, description, quote, quotation, verse, titlepage and theindex; no chapter, no theorem
 *   environments (its \newtheorem lines are comments, l.1353-1356), no \ps@headings or \ps@myheadings (only its own ecai and
 *   ecaifirst styles, with empty and plain \let to ecaifirst, l.1331-1352).
 * - Preloads: comment (l.44), lineno [switch] (l.45), times and fontenc [T1] (l.159-160), etoolbox, forloop, url (l.393-395),
 *   environ (l.775), natbib [numbers] at the class's end with \bibliographystyle{abbrvnat} (l.1325-1327). natbib makes biblatex
 *   (General's bibliography and the library's biblatex ways) and apacite refused through their package facts, and every natbib
 *   way that gives another option an option clash; numbers alone fits, so bib.natbib's default preset is kept off by a deny (the
 *   second \bibstyle), as bib.bibtex-bst is.
 * - Refuses cite: natbib's two-optional \@citex against cite.sty's one ('Paragraph ended before \@citex was complete').
 * - Page: A4, twoside, two columns and final by default (\ExecuteOptions, l.115); \textwidth 42.5pc in two columns (l.177-181),
 *   so 510pt; \normalsize is 9pt on 11pt (l.121-127).
 * - Names: \author takes an optional address key and redefines \footnote, \thanks and \orcid only inside it (l.405-437), and \address[key]{text} is its own (l.535);
 *   \maketitle (l.613-665) then \let's \maketitle, \title and \thanks to \relax or \@gobble; the frontmatter environment
 *   (\NewEnviron, l.776-810) calls \maketitle itself; abstract (l.767), ack (l.1249, removed by doubleblind), table and table* take
 *   an optional placement as their one argument (l.1043-1054).
 * - The README lists hyperref, subfig and subcaption as not compatible with the class; none is refused here without a test, since
 *   General loads hyperref with its links (the probe case G4-ecai-links shows whether hyperref stops in this class).
 * - XeTeX: times' ptm has no TU shape; General's fontspec lines give Latin Modern with font warnings, no error.
 */
export default defineClass({
  id: 'class.ecai',
  name: "ecai",
  targetEngine: "untested",
  preloads: [{"pkg": "comment"}, {"pkg": "lineno", "options": ["switch"]}, {"pkg": "times"}, {"pkg": "fontenc", "options": ["T1"]}, {"pkg": "etoolbox"}, {"pkg": "forloop"}, {"pkg": "url"}, {"pkg": "environ"}, {"pkg": "natbib", "options": ["numbers"]}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "env:ack", "env:frontmatter", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\orcid", "cmd:\\address"],
  options: {
    doubleblind: { removes: ["env:ack"], description: "hides the authors for review; the ack environment becomes a comment (\\excludecomment{ack}, l.1246-1250)" },
  },
  forbids: {
    technical: [
      {
        pkg: "cite",
        reason: "ecai.cls loads natbib with numbers at its end (l.1325), whose \\NAT@set@cites at \\begin{document} installs a two-optional \\@citex; cite.sty, which only bib.cite-pkg loads, redefines \\cite to call \\@citex with one optional argument, so every citation scans on to the paragraph's end: 'Paragraph ended before \\@citex was complete' (as cvpr and asmeconf; b2p probe G4-asmeconf-citepkg)",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/ecai.cls (2023/12/10 v04)', line: '1325-1327 (\\usepackage[numbers]{natbib}, \\bibfont, \\bibliographystyle{abbrvnat})' }],
      },
      // b29 (B3B-10): as frontiers and agu.
      { pkg: "sectsty", reason: "ecai.cls is a class of its own (\\ProvidesClass{ecai}, l.38, no \\LoadClass), and sectsty stops at 'The sectsty package doesn't work with this document class' for any class other than article, report, book or a KOMA class (sectsty.sty l.278-295)", evidence: [{ kind: 'source', file: 'sectsty.sty (MiKTeX snapshot 9766)', line: '278-295' }, { kind: 'compile', cell: 'GitHub run b28-e9f730a, ecai.A: 98 branches fail with this error (e.g. document d8b6d117ea11127dfff5f)' }] },
    ],
    policy: [],
  },
  layout: { columns: 2, textwidth: "510.0pt", fontsize: "9pt" },
  vocabulary: {"\\author": "an author, with an optional address key: \\author[A]{name}", "\\address": "an address for a key, in the frontmatter environment", "\\orcid": "an author's ORCID, inside \\author"},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/ecai.cls (2023/12/10 v04)', line: '44-45 (comment, lineno [switch]), 52-116 (options; \\ExecuteOptions{a4paper,twoside,twocolumn,final}), 121-127 (9pt), 159-160 (times, fontenc T1), 177-181 (\\textwidth 42.5pc)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/ecai.cls (2023/12/10 v04)', line: '393-395 (etoolbox, forloop, url), 405-437 (\\author), 535 (\\address), 613-665 (\\maketitle), 767-810 (abstract, frontmatter), 854-917 (counters, headings), 1012 (\\appendix), 1043-1054 (table), 1083 (\\tableofcontents)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/ecai.cls (2023/12/10 v04)', line: '1246-1250 (ack, doubleblind), 1325-1327 (natbib [numbers], abbrvnat), 1331-1352 (page styles ecaifirst and ecai only)' },
  ],
});
