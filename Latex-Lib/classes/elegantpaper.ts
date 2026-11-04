import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/** The class source as the engine fetches it (MiKTeX package elegantpaper); line numbers below are this file's. */
const CLS = 'elegantpaper.cls (elegantpaper 2026/2/27 v0.12, MiKTeX snapshot 9766)';
const BIBLATEX = 'biblatex.sty (biblatex, MiKTeX snapshot 9766)';

/**
 * ElegantLaTeX's elegantpaper, read from its source (batch 2, setting elegantpaper.A with lang=en,bibend=bibtex; not yet measured
 * by the class probe). It loads article, passing unknown options on (l.40-42), and then most of a paper's packages itself, several
 * with options, so a way that loads one of those with another option stops at "Option clash" (the host reads that from `preloads`):
 * hyperref (l.44, set with \hypersetup l.45-53), geometry with 1in margins (l.55-61), amsthm, amsmath, amssymb (l.64-66), abstract
 * (l.75), caption with labelfont=bf (l.82), enumitem with shortlabels and inline (l.87), xcolor (l.72, 92), fontspec with no-math
 * under XeTeX (l.106-125, TeX Gyre Termes and Heros by file name), biblatex with the setting's backend=bibtex and the class's
 * numeric-comp and numeric styles (l.195-198), appendix (l.200), listings (l.343) with \lstset defaults (l.352-366).
 * Under lang=en it defines its theorem environments with amsthm (l.234-247) and \keywords, \figref, \tabref, \ebibname (l.254-257);
 * \email (l.101), and \version and \institute are token registers (l.276-277) that its \maketitle prints (l.279-334).
 * At \begin{document} it loads footmisc with flushmargin (l.266-270): a way that loaded footmisc in the preamble without flushmargin
 * makes that request clash, so footmisc is refused outright. biblatex refuses natbib, cite, mcite and apacite (biblatex.sty
 * l.166-180).
 */
export default defineClass({
  id: 'class.elegantpaper',
  name: "elegantpaper",
  base: 'class.article',
  zerotex: "untested",
  preloads: [
    {"pkg": "kvoptions"}, {"pkg": "etoolbox"}, {"pkg": "calc"}, {"pkg": "hyperref"},
    {"pkg": "geometry", "options": ["left=1in", "right=1in", "top=1in", "bottom=1in", "headheight=0pt", "headsep=0pt"]},
    {"pkg": "amsthm"}, {"pkg": "amsmath"}, {"pkg": "amssymb"}, {"pkg": "indentfirst"}, {"pkg": "booktabs"}, {"pkg": "multicol"},
    {"pkg": "multirow"}, {"pkg": "xcolor"}, {"pkg": "graphicx"}, {"pkg": "fancyvrb"}, {"pkg": "abstract"}, {"pkg": "hologo"},
    {"pkg": "caption", "options": ["labelfont={bf}"]}, {"pkg": "enumitem", "options": ["shortlabels", "inline"]}, {"pkg": "iftex"},
    {"pkg": "fontspec", "options": ["no-math", "quiet"]},
    {"pkg": "biblatex", "options": ["backend=bibtex", "citestyle=numeric-comp", "bibstyle=numeric"]},
    {"pkg": "appendix"}, {"pkg": "footmisc", "options": ["flushmargin"]}, {"pkg": "listings"},
  ],
  defines: [
    "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph",
    "env:figure", "env:table", "env:thebibliography", "env:abstract", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix",
    "env:theorem", "env:lemma", "env:proposition", "env:corollary", "env:definition", "env:conjecture", "env:example", "env:remark",
    "env:note", "env:case", "env:proof",
    "cmd:\\email", "cmd:\\keywords", "cmd:\\figref", "cmd:\\tabref", "cmd:\\versiontext", "cmd:\\updatetext", "cmd:\\ebibname",
    "cmd:\\version", "cmd:\\institute", "cmd:\\IfEmpty", "cmd:\\citshape", "cmd:\\cnormal", "cmd:\\cfs",
  ],
  options: {},
  forbids: {
    technical: [
      { pkg: "footmisc", reason: "elegantpaper loads footmisc with flushmargin at \\begin{document} (\\AtBeginDocument{... \\RequirePackage[flushmargin]{footmisc} ...}, l.266-270), after the preamble's packages: a way that loads footmisc without flushmargin (with no option or another one) makes that request ask for an option the loaded package was not given, and LaTeX stops at 'Option clash for package footmisc' at \\begin{document}", evidence: [{ kind: 'source', file: CLS, line: '266-270' }] },
      { pkg: "natbib", reason: "elegantpaper loads biblatex itself (l.195-198), and biblatex stops at \"Incompatible package 'natbib'\" (its \\blx@packageincompatibility list, run when it loads and again at the end of the preamble)", evidence: [{ kind: 'source', file: CLS, line: '195-198' }, { kind: 'source', file: BIBLATEX, line: '166-180' }] },
      { pkg: "cite", reason: "elegantpaper loads biblatex itself (l.195-198), and biblatex stops at \"Incompatible package 'cite'\" (its \\blx@packageincompatibility list)", evidence: [{ kind: 'source', file: CLS, line: '195-198' }, { kind: 'source', file: BIBLATEX, line: '166-180' }] },
      { pkg: "mcite", reason: "elegantpaper loads biblatex itself (l.195-198), and biblatex stops at \"Incompatible package 'mcite'\" (its \\blx@packageincompatibility list)", evidence: [{ kind: 'source', file: CLS, line: '195-198' }, { kind: 'source', file: BIBLATEX, line: '166-180' }] },
      { pkg: "apacite", reason: "elegantpaper loads biblatex itself (l.195-198), and biblatex stops at \"Incompatible package 'apacite'\" (its \\blx@packageincompatibility list)", evidence: [{ kind: 'source', file: CLS, line: '195-198' }, { kind: 'source', file: BIBLATEX, line: '166-180' }] },
    ],
    policy: [],
  },
  // Letter paper (article's default) less the 1in left and right margins of l.55-61: 6.5in = 469.75pt.
  layout: { columns: 1, textwidth: "469.75pt", fontsize: "10pt" },
  vocabulary: {"\\keywords": "keywords, printed in place", "\\email": "an e-mail address as a mailto link", "\\version": "the version line under the title (a token register: \\version={...})", "\\institute": "the affiliation under the authors (a token register: \\institute={...})"},
  evidence: [
    { kind: 'source', file: CLS, line: '40-92' },
    { kind: 'source', file: CLS, line: '106-125' },
    { kind: 'source', file: CLS, line: '195-200' },
    { kind: 'source', file: CLS, line: '234-277' },
    { kind: 'source', file: CLS, line: '279-343' },
    ctan('elegantpaper'),
  ],
});
