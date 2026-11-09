import { defineClass } from '../schema/class.ts';

/**
 * Journal of Statistical Software: jss.cls v3.6 (2026/04/28, Achim Zeileis) on article, from jss-style.zip
 * (testing-pipeline/settings/classes/files/jss.cls), with the setting's option `article`. Not measured by the class probe
 * (batch 3, b3p): every field is read from the pinned class, whose line numbers are cited.
 * - Preloads: article [11pt,a4paper,twoside] (l.52), graphicx, xcolor, fancyvrb (l.54), fontenc [T1] (l.55), upquote and
 *   lmodern when installed (l.56-57), natbib [authoryear,round,longnamesfirst] (l.60-62; `shortnames` drops longnamesfirst,
 *   the setting does not give it) and hyperref with no option (l.254; its \hypersetup at l.424-447). A way that loads xcolor,
 *   hyperref or natbib with an option the class did not give is an "Option clash" (xcolor [table]; natbib numbers, square,
 *   sort...); natbib also refuses biblatex and apacite through their package facts.
 * - Bibliography: \bibliographystyle{jss} while the class loads (l.64), so main.aux opens with that \bibstyle and a way's own
 *   \bibliographystyle is a second one, which BibTeX rejects: bib.bibtex-bst and bib.natbib deny class.jss. cite is refused
 *   (natbib's two-optional \@citex). natbib is author-year: bib.thebibliography's B2CITE-1 label chooser gives each
 *   \bibitem an Author(Year) label.
 * - Title: \maketitle runs itself at begindocument/end (l.471) and is then \relax (l.325), so \title, \author, \Plainauthor,
 *   \Abstract and \Keywords must be set in the preamble; the profile does not list \maketitle (as achemso), so no title way
 *   that calls \maketitle in the body fits. \Address, \Abstract, \Keywords and the other title-block fields are
 *   \newcommand'd (l.81-116) with placeholder defaults (l.117-140).
 * - Sections: \section, \subsection and \subsubsection are \secdef over \jsssec... (l.375-418), not \@startsection: titlesec
 *   warns "Non standard sectioning command" and formats them anew (no error); sectsty accepts the class (article is loaded)
 *   and replaces them.
 * - Names it \newcommand's that a way or document may define again: \code, \pkg, \email, \doi, \E, \VAR, \COV, \Prob
 *   (l.474-491; \proglang is \let to \textsf), and the fancyvrb environments Sinput, Soutput, Scode, Code, CodeInput,
 *   CodeOutput (l.203-209) and Schunk, CodeChunk (l.206, 210).
 * - Page: one column, \textwidth 6.125in (l.76) = 442.65375pt, 11pt; \parindent 0 (l.79).
 * - \AtEndDocument\makefooter (l.244-248) prints \@Address and, without nojss, the journal footer with \url and \href.
 * - b3p-1 probe (verify-V2) corrects the sections line above: titlesec stops at "No format for this command" on every \section it was not
 *   given a format for, so it is refused.
 */
export default defineClass({
  id: 'class.jss',
  name: "jss",
  base: 'class.article',
  targetEngine: "untested",
  preloads: [
    {"pkg": "graphicx"}, {"pkg": "xcolor"}, {"pkg": "fancyvrb"}, {"pkg": "fontenc", "options": ["T1"]}, {"pkg": "upquote"},
    {"pkg": "lmodern"}, {"pkg": "natbib", "options": ["authoryear", "round", "longnamesfirst"]}, {"pkg": "hyperref"},
  ],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "env:Sinput", "env:Soutput", "env:Scode", "env:Schunk", "env:Code", "env:CodeInput", "env:CodeOutput", "env:CodeChunk", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\Address", "cmd:\\Plaintitle", "cmd:\\Shorttitle", "cmd:\\Plainauthor", "cmd:\\Volume", "cmd:\\Year", "cmd:\\Month", "cmd:\\Issue", "cmd:\\Submitdate", "cmd:\\Acceptdate", "cmd:\\Abstract", "cmd:\\Keywords", "cmd:\\Plainkeywords", "cmd:\\URL", "cmd:\\DOI", "cmd:\\code", "cmd:\\proglang", "cmd:\\pkg", "cmd:\\email", "cmd:\\doi", "cmd:\\E", "cmd:\\VAR", "cmd:\\COV", "cmd:\\Prob", "cmd:\\makefooter"],
  options: {},
  forbids: {
    technical: [
      { pkg: "cite", reason: "jss.cls loads natbib [authoryear,round,longnamesfirst] (l.60-62), whose \\NAT@set@cites at \\begin{document} installs a two-optional \\@citex (natbib.sty 8.31b l.375, l.645-674); cite.sty redefines \\cite to call \\@citex with one optional argument (cite.sty v5.5 l.302-307), so citations scan on to the paragraph's end: 'Paragraph ended before \\@citex was complete' (as achemso, apa7 and oup-authoring-template, b2p probe)", evidence: [{ kind: 'source', file: 'jss.cls (jss 2026/04/28 v3.6, testing-pipeline/settings/classes/files)', line: '60-62' }] },
      { pkg: "titlesec", reason: "jss.cls makes \\section, \\subsection and \\subsubsection \\secdef over its own \\jsssec... (l.375-418), not \\@startsection, so titlesec extracts no format for them: every heading level a way does not \\titleformat itself stops at \"Package titlesec Error: No format for this command\", then \"Missing number\" and \"Illegal unit of measure\"", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/jss.cls', line: '375-418 (\\jsssec, \\section as \\secdef)' }, { kind: 'compile', cell: 'b3p-1 probe (C:/dev/template-ai/probes/b3p-1/probe) G3-jss-hyperref main.log l.790 (18 titlesec errors, 72 cascades, all on \\section)' }] },
    ],
    policy: [],
  },
  layout: { columns: 1, textwidth: "442.65375pt", fontsize: "11pt" },
  files: [
    { path: "jss.cls", sha256: "2be72971ed31651bd67fa1faef9f492b81aec1786bb039689176ed279a66cca7" },
    { path: "jss.bst", sha256: "71cf69fa29ff2f9ad583edc6fca44f51fd75cbae4201fffbdcb7c13b4a728f43" },
    { path: "jsslogo.jpg", sha256: "b9f97c51e25b2fe013c89751788aa71ea6958050b3993993cc2e4fcb0cbcf90c" },
  ],
  vocabulary: {"\\Plainauthor": "the authors without markup (PDF metadata and running head)", "\\Plaintitle": "the title without markup", "\\Shorttitle": "the running-head title", "\\Abstract": "the abstract (a command, printed in the title block at \\begin{document})", "\\Keywords": "keywords, with markup", "\\Plainkeywords": "keywords without markup", "\\Address": "the authors' addresses (printed at the end of the article)"},
  evidence: [
    { kind: 'source', file: 'jss.cls (jss 2026/04/28 v3.6, testing-pipeline/settings/classes/files)', line: '37-52 (options, article [11pt,a4paper,twoside])' },
    { kind: 'source', file: 'jss.cls', line: '54-57 (graphicx, xcolor, fancyvrb, fontenc [T1], upquote, lmodern)' },
    { kind: 'source', file: 'jss.cls', line: '59-64 (natbib [authoryear,round,longnamesfirst], \\bibpunct, \\bibliographystyle{jss})' },
    { kind: 'source', file: 'jss.cls', line: '66-79 (\\textwidth 6.125in, \\parindent 0em)' },
    { kind: 'source', file: 'jss.cls', line: '81-140 (title-block fields and their defaults)' },
    { kind: 'source', file: 'jss.cls', line: '203-210 (Sinput, Soutput, Scode, Schunk, Code, CodeInput, CodeOutput, CodeChunk)' },
    { kind: 'source', file: 'jss.cls', line: '254 (hyperref), 255-359 (\\maketitle; l.325 \\let\\maketitle\\relax)' },
    { kind: 'source', file: 'jss.cls', line: '375-418 (\\section etc. as \\secdef over \\jsssec, not \\@startsection)' },
    { kind: 'source', file: 'jss.cls', line: '421-471 (\\hypersetup; \\maketitle at begindocument/end)' },
    { kind: 'source', file: 'jss.cls', line: '474-489 (\\code, \\proglang, \\pkg, \\email, \\doi, \\E, \\VAR, \\COV, \\Prob)' },
  ],
});
