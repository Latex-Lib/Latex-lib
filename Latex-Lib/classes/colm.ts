import { defineClass } from '../schema/class.ts';

/**
 * COLM 2026: colm2026_conference.sty on plain article, as the colm setting
 * loads it (`\usepackage[preprint]{colm2026_conference}`). Read from the
 * pinned style (testing-pipeline/settings/classes/files; b2p, not yet measured
 * by the class probe). It loads tgpagella, mathpazo, inconsolata, eso-pic,
 * fancyhdr and natbib (l.32-42), all with no option: a way that loads natbib
 * with an option (numbers, square, sort&compress...) stops at "Option clash",
 * biblatex stops at "Incompatible package 'natbib'" (biblatex.sty l.179), and
 * cite breaks natbib's `\cite` (natbib.sty l.275-277 warns against it; acmart,
 * which also loads natbib, refuses cite for the same reason). The mirror's
 * inconsolata.sty (MiKTeX 9766) has no fontspec branch, so nothing loads
 * fontspec. One column, 5.5in on US letter (l.54, l.65-66). It empties
 * `\addcontentsline` (l.75), so a table of contents prints no entries, and
 * replaces `\maketitle` (l.78), `abstract` (l.129), the size commands with
 * `\@setsize` (l.135ff) and the sectioning commands (l.149ff); `\And` and
 * `\AND` (l.114-116) separate authors.
 */
export default defineClass({
  id: 'class.colm',
  name: "article",
  base: 'class.article',
  zerotex: "yes",
  preloads: [{"pkg": "tgpagella"}, {"pkg": "mathpazo"}, {"pkg": "inconsolata"}, {"pkg": "eso-pic"}, {"pkg": "fancyhdr"}, {"pkg": "natbib"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\And", "cmd:\\AND", "cmd:\\subsubsubsection", "cmd:\\toptitlebar", "cmd:\\bottomtitlebar"],
  options: {},
  forbids: {
    technical: [
      { pkg: "biblatex", reason: "colm2026_conference.sty loads natbib (l.42), and biblatex stops at Incompatible package 'natbib'", evidence: [{ kind: 'source', file: 'colm2026_conference.sty', line: '42' }, { kind: 'source', file: 'biblatex.sty (\\blx@packageincompatibility)', line: '177-179' }] },
      { pkg: "cite", reason: "colm2026_conference.sty loads natbib (l.42); cite.sty redefines \\cite to call \\@citex with one optional argument while natbib installs its own two-optional \\@citex, so citations scan on to the paragraph's end (acmart's same refusal, from a compile); natbib itself warns that cite should not be used with it", evidence: [{ kind: 'source', file: 'colm2026_conference.sty', line: '42' }, { kind: 'source', file: 'natbib.sty', line: '275-277' }, { kind: 'source', file: 'cite.sty', line: '303-307' }] },
    ],
    policy: [],
  },
  layout: { columns: 1, textwidth: "397.48499pt", fontsize: "10pt" },
  files: [{ path: "colm2026_conference.sty", sha256: "55962ae80c25a50335825c85d23eb5f1cd9015aa8e77f7af32b483b646c7483e" }],
  vocabulary: {"\\And": "separates authors on one line", "\\AND": "starts a new line of authors"},
  evidence: [
    { kind: 'source', file: 'colm2026_conference.sty (commit 963ddd1, testing-pipeline/settings/classes/files)', line: '32-42 (tgpagella, mathpazo, inconsolata, eso-pic, fancyhdr, natbib), 95-97 (\\pagestyle{fancy})' },
    { kind: 'source', file: 'colm2026_conference.sty', line: '54, 65-66 (\\paperwidth 8.5in, \\textheight 9in, \\textwidth 5.5in)' },
    { kind: 'source', file: 'colm2026_conference.sty', line: '75 (\\def\\addcontentsline#1#2#3{}), 78 (\\maketitle), 101 (\\@maketitle), 114-116 (\\And, \\AND)' },
    { kind: 'source', file: 'colm2026_conference.sty', line: '129 (abstract), 135 (\\normalsize with \\@setsize), 149-162 (sectioning, \\subsubsubsection), 212-214 (title bars)' },
    { kind: 'source', file: 'inconsolata.sty (MiKTeX snapshot 9766)', line: '11-12 (textcomp, xkeyval; no fontspec branch)' },
  ],
});
