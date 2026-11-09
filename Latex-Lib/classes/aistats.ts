import { defineClass } from '../schema/class.ts';

/**
 * AISTATS 2027: aistats2027.sty on article with twoside, as the aistats
 * setting loads it (`\usepackage[preprint]{aistats2027}`). Read from the
 * pinned aistats2027.sty (testing-pipeline/settings/classes/files; b2p, not
 * yet measured by the class probe). It loads amsmath (l.64) and fancyhdr
 * (l.156), both with no option, so a way that loads either with an option
 * (amsmath's fleqn or leqno) stops at "Option clash". It sets two columns
 * itself (l.146 `\twocolumn`, no class option) and empties
 * `\addcontentsline` (l.148), so a table of contents prints no entries. It
 * provides `\acknowledgments` (l.67) and defines its own front matter
 * (`\aistatstitle`, `\aistatsauthor`, `\aistatsaddress`, `\runningtitle`,
 * `\runningauthor`), `abstract` (l.406), `thebibliography` (l.489) and the
 * sectioning commands with `\def` (l.411-421). The camera-ready natbib check
 * (l.512-523) is skipped under preprint, which the setting gives.
 */
export default defineClass({
  id: 'class.aistats',
  name: "article",
  base: 'class.article',
  targetEngine: "yes",
  preloads: [{"pkg": "amsmath"}, {"pkg": "fancyhdr"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\acknowledgments", "cmd:\\ackaccepted", "cmd:\\aistatstitle", "cmd:\\aistatsauthor", "cmd:\\aistatsaddress", "cmd:\\runningtitle", "cmd:\\runningauthor", "cmd:\\subsubsubsection", "cmd:\\toptitlebar", "cmd:\\bottomtitlebar", "length:\\titlebox", "cmd:\\onecolumn"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 2, textwidth: "487.8225pt", fontsize: "10pt" },
  files: [{ path: "aistats2027.sty", sha256: "33ab38f8aac4b2f1df9fe67e354928598200584e9568385f32deb889e1b81d42" }],
  vocabulary: {"\\aistatstitle": "the title block (title and rules)", "\\aistatsauthor": "the authors", "\\aistatsaddress": "affiliations", "\\runningtitle": "a short title for the running head", "\\runningauthor": "short authors for the running head"},
  evidence: [
    { kind: 'source', file: 'aistats2027.sty (2026/09/02, testing-pipeline/settings/classes/files)', line: '64 (\\RequirePackage{amsmath}), 156 (\\RequirePackage{fancyhdr})' },
    { kind: 'source', file: 'aistats2027.sty', line: '67-68 (\\providecommand\\acknowledgments, \\ackaccepted), 86-92 (preprint)' },
    { kind: 'source', file: 'aistats2027.sty', line: '96-98 (\\textheight 9.25in, \\textwidth 6.75in, \\titlebox)' },
    { kind: 'source', file: 'aistats2027.sty', line: '146 (\\twocolumn), 148 (\\renewcommand{\\addcontentsline}[3]{})' },
    { kind: 'source', file: 'aistats2027.sty', line: '170-171, 173, 248, 355 (\\runningtitle, \\runningauthor, \\aistatstitle, \\aistatsauthor, \\aistatsaddress)' },
    { kind: 'source', file: 'aistats2027.sty', line: '406-421 (abstract, \\section to \\subparagraph, \\subsubsubsection), 489 (thebibliography)' },
    { kind: 'source', file: 'aistats2027.sty', line: '512-523 (natbib numbers check, camera-ready only)' },
  ],
});
