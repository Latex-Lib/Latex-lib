import { defineClass } from '../schema/class.ts';

/**
 * TMLR: tmlr.sty on plain article, as the tmlr setting loads it
 * (`\usepackage[preprint]{tmlr}`). Read from the pinned tmlr.sty
 * (testing-pipeline/settings/classes/files; b2p, not yet measured by the class
 * probe). It loads eso-pic, fancyhdr, natbib, fontenc with T1 and lmodern
 * (l.13-18; only fontenc has an option): a way that loads natbib with an
 * option stops at "Option clash", biblatex stops at "Incompatible package
 * 'natbib'" (biblatex.sty l.179), and cite breaks natbib's `\cite` (as under
 * acmart and colm). One column, 6.5in on US letter (l.46, l.57-58). It empties
 * `\addcontentsline` (l.68), so a table of contents prints no entries,
 * replaces `\maketitle` (l.71) and defines, globally and with `\def`, the
 * author-block commands `\addr`, `\email`, `\name` and `\AND` (l.98-102): a
 * way that defines `\email` or `\name` again stops at "already defined" (and
 * one that only redefines them changes every author block). Its four lengths
 * (l.86-87) and `\subsubsubsection` (l.153) are its own too.
 */
export default defineClass({
  id: 'class.tmlr',
  name: "article",
  base: 'class.article',
  targetEngine: "yes",
  preloads: [{"pkg": "eso-pic"}, {"pkg": "fancyhdr"}, {"pkg": "natbib"}, {"pkg": "fontenc", "options": ["T1"]}, {"pkg": "lmodern"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\addr", "cmd:\\email", "cmd:\\name", "cmd:\\AND", "cmd:\\subsubsubsection", "cmd:\\toptitlebar", "cmd:\\bottomtitlebar", "length:\\aftertitskip", "length:\\beforetitskip", "length:\\interauthorskip", "length:\\aftermaketitskip"],
  options: {},
  forbids: {
    technical: [
      { pkg: "biblatex", reason: "tmlr.sty loads natbib (l.15), and biblatex stops at Incompatible package 'natbib'", evidence: [{ kind: 'source', file: 'tmlr.sty', line: '15' }, { kind: 'source', file: 'biblatex.sty (\\blx@packageincompatibility)', line: '177-179' }] },
      { pkg: "cite", reason: "tmlr.sty loads natbib (l.15); cite.sty redefines \\cite to call \\@citex with one optional argument while natbib installs its own two-optional \\@citex, so citations scan on to the paragraph's end (acmart's same refusal, from a compile); natbib itself warns that cite should not be used with it", evidence: [{ kind: 'source', file: 'tmlr.sty', line: '15' }, { kind: 'source', file: 'natbib.sty', line: '275-277' }, { kind: 'source', file: 'cite.sty', line: '303-307' }] },
    ],
    policy: [],
  },
  layout: { columns: 1, textwidth: "469.75499pt", fontsize: "10pt" },
  files: [{ path: "tmlr.sty", sha256: "816214ff5919aa457b6b443bee52b15d9561421417b7f8a50cc84651519f0002" }],
  vocabulary: {"\\name": "an author's name in the author block", "\\addr": "an author's affiliation and address", "\\email": "an author's email", "\\AND": "starts the next author"},
  evidence: [
    { kind: 'source', file: 'tmlr.sty (commit 7bf90ef, testing-pipeline/settings/classes/files)', line: '13-18 (eso-pic, fancyhdr, natbib, [T1]{fontenc}, lmodern), 106-107 (\\pagestyle{fancy})' },
    { kind: 'source', file: 'tmlr.sty', line: '26-41 (accepted, preprint, unknown options warned), 46, 57-58 (\\paperwidth 8.5in, \\textheight 9in, \\textwidth 6.5in)' },
    { kind: 'source', file: 'tmlr.sty', line: '68 (\\def\\addcontentsline#1#2#3{}), 71 (\\maketitle), 86-87 (lengths), 98-102 (\\addr, \\email, \\name, \\AND), 121 (\\@maketitle)' },
    { kind: 'source', file: 'tmlr.sty', line: '136 (abstract), 140-153 (sectioning, \\subsubsubsection), 203-205 (title bars)' },
  ],
});
