import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/** The class and its utilities package as the engine fetches them (MiKTeX package jmlr); line numbers below are these files'. */
const CLS = 'jmlr.cls (jmlr 2022/02/09 v1.30, MiKTeX snapshot 9766)';
const UTILS = 'jmlrutils.sty (jmlr 2022/02/09 v1.30, MiKTeX snapshot 9766)';
const AMSTHM = 'amsthm.sty (amscls 2020/05/29 v2.20.6, MiKTeX snapshot 9766)';

/**
 * Nicola Talbot's jmlr class under its pmlr option (batch 2, setting jmlr-pmlr.A; not yet measured by the class probe), read from
 * its source. It loads article at 11pt (\pt@size, l.88-91, l.124), twoside, letter paper, and sets a 6in text block by hand
 * (l.137-145, not geometry). Then it loads placeins, amsmath, amssymb, natbib (no options), graphicx, url, xcolor with x11names,
 * algorithm2e with algo2e and ruled (l.147-156), its jmlrutils package (l.158) and hyperref with nameref (l.161-169), so a way that
 * loads one of these with another option stops at "Option clash" (natbib's numbers, xcolor's table, amsmath's fleqn or leqno; the
 * host reads that from `preloads`).
 * jmlrutils (theorems, maths and subfloats on by default, l.44-61) defines the algorithm environment over algorithm2e's algocf
 * (l.187-200), enumerate* (l.408, unconditionally, so enumitem's inline option would clash), altdescription (l.425), a proof
 * environment with \newenvironment (l.445) and the theorem, example, lemma, proposition, remark, corollary, definition, conjecture
 * and axiom environments (l.551-607), and a subfigure counter for its own \subfigure (l.233-234; subcaption and subfig stop at
 * "Command \c@subfigure already defined", but no library key loads either). The class defines the keywords environment (l.235),
 * \author with an optional short form (l.257), \Name and \Email (l.376, 447) and makes \name and \email errors inside the author
 * block (l.338-339).
 */
export default defineClass({
  id: 'class.jmlr-pmlr',
  name: "jmlr",
  base: 'class.article',
  zerotex: "untested",
  preloads: [
    {"pkg": "xkeyval"}, {"pkg": "calc"}, {"pkg": "etoolbox"}, {"pkg": "placeins"}, {"pkg": "amsmath"}, {"pkg": "amssymb"},
    {"pkg": "natbib"}, {"pkg": "graphicx"}, {"pkg": "url"}, {"pkg": "xcolor", "options": ["x11names"]},
    {"pkg": "algorithm2e", "options": ["algo2e", "ruled"]}, {"pkg": "jmlrutils"}, {"pkg": "hyperref"}, {"pkg": "nameref"},
  ],
  defines: [
    "counter:chapter", "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph",
    "env:figure", "env:table", "env:thebibliography", "env:abstract", "env:keywords", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix",
    "env:algorithm", "env:enumerate*", "env:altdescription", "env:proof",
    "env:theorem", "env:example", "env:lemma", "env:proposition", "env:remark", "env:corollary", "env:definition", "env:conjecture", "env:axiom",
    "cmd:\\keywords", "cmd:\\Name", "cmd:\\Email", "cmd:\\editor", "cmd:\\editors", "cmd:\\firstpageno", "cmd:\\jmlrproceedings",
    "cmd:\\set", "cmd:\\mailto", "cmd:\\BlackBox", "cmd:\\jmlrBlackBox", "cmd:\\jmlrQED", "cmd:\\subfigref",
  ],
  options: {},
  forbids: {
    technical: [
      { pkg: "cite", reason: "jmlr.cls (l.150, natbib with no options) loads natbib, whose \\NAT@set@cites at \\begin{document} installs a two-optional \\@citex (natbib.sty 8.31b l.375, l.645-674); cite.sty redefines \\cite to call \\@citex with one optional argument (cite.sty v5.5 l.302-307), so citations scan on to the paragraph's end: 'Paragraph ended before \\@citex was complete' and 'Argument of \\@citex has an extra }' (as elsarticle; b2p probe: G2-apa7-cite and G2-oup-authoring-template-cite, 48 and 53 \\@citex errors, no PDF)", evidence: [{ kind: 'source', file: "G3/jmlr-pmlr.ts", line: "150" }] },
      { pkg: "amsthm", reason: "jmlrutils, which jmlr loads itself (l.158), defines the proof environment with \\newenvironment under its default theorems option (jmlrutils.sty l.440-447); amsthm defines proof with \\newenvironment too (amsthm.sty l.431), so loading it after the class stops at 'Command \\proof already defined'", evidence: [{ kind: 'source', file: UTILS, line: '440-447' }, { kind: 'source', file: AMSTHM, line: '431' }, { kind: 'source', file: CLS, line: '158' }] },
    ],
    policy: [],
    names: [{ name: "cmd:\\chapter", reason: "jmlr.cls makes its own chapter counter (l.732) and, outside its book mode, lets chapter to artchapter, a class error (l.743-745, 959): a chapter heading stops at 'Chapters not permitted in articles', and General's \\newcounter{chapter} at 'Command c@chapter already defined' (b2p probe G3-jmlr-pmlr-sections)", evidence: [{ kind: 'source', file: "G3/jmlr-pmlr.ts", line: "732-745, 952-959" }] }],
  },
  // Not 7x10: \textwidth 6.0 true in (l.144) = 433.62pt, 11pt by default (l.88).
  layout: { columns: 1, textwidth: "433.62pt", fontsize: "11pt" },
  vocabulary: {"\\Name": "an author's name inside \\author (\\name is an error there)", "\\Email": "an author's e-mail inside \\author (\\email is an error there)", "\\addr": "an author's address inside \\author", "\\editor": "the volume's editor, printed on the first page", "\\jmlrvolume": "the PMLR volume", "\\jmlryear": "the year", "\\jmlrworkshop": "the workshop or conference"},
  evidence: [
    { kind: 'source', file: CLS, line: '88-124' },
    { kind: 'source', file: CLS, line: '137-169' },
    { kind: 'source', file: CLS, line: '235-339' },
    { kind: 'source', file: UTILS, line: '44-61' },
    { kind: 'source', file: UTILS, line: '187-234' },
    { kind: 'source', file: UTILS, line: '408-607' },
    ctan('jmlr'),
  ],
});
