import { defineClass } from '../schema/class.ts';

/**
 * oup-authoring-template (Oxford University Press journals, v1.5 2026/07/14), read from the class source (MiKTeX snapshot
 * 9766, package oup-authoring-template) for batch 2 (b2p), not yet measured by a class probe, with the setting's options
 * webpdf, contemporary and large. It is a standalone class, not built on article: it makes its own counters section to
 * subparagraph, figure and table (l.1076-1082), with no part and no chapter, and no \tableofcontents, \part, \appendix or
 * description environment. Preloads: crop, graphicx, caption, amsmath, array, color, xcolor, amssymb, flushend, stfloats,
 * rotating [figuresright], chngpage, totcount, fix-cm, footmisc [bottom] (l.136-150); arydshln under contemporary
 * (l.1977-1978), whose facts refuse colortbl; natbib with no options (l.2424; numbers are forced through
 * \NAT@force@numbers, l.2435, so a way's natbib with any option stops at "Option clash"); wrapfig (l.2558), amsthm
 * (l.2592), subfloat [countmax], multirow, footnote, url, mathrsfs, algorithm, algorithmicx, algpseudocode, listings
 * (l.2705-2715), hyperref [hidelinks] (l.2991), tikz (l.2993), and anyfontsize at \begin{document} (l.2706). algorithm.sty loads
 * float, so float is a preload too (as for icml): floatrow's facts then refuse floatrow ("Do not use float package with
 * floatrow", 1,462 branches in GitHub run b12-5bdc624).
 *
 * Refused from run b12-5bdc624 (b27): tabularx, which hangs after the arydshln that contemporary loads (l.1977-1978): 316 of
 * 528 documents with a General tabularx way hung (no log after 122 s, so the hang took its whole cell: 13,001 branches),
 * against 0 of 347 without one, and the 102 that finished stopped at \end{tabularx} in arydshln's code ("Misplaced \noalign",
 * \adl@rowsL); the same documents finish under apa7 and emulateapj (which also loads arydshln), so the rule is this class's,
 * not arydshln's facts. The class's chngpage (l.147) defines \cplabel, and changepage defines it again ("Command \cplabel
 * already defined"); the library has no changepage facts, so no `forbids.technical` entry can name it: note.sidenotes, which
 * loads changepage itself, is denied in its key (all the cells with the error hold it).
 *
 * \abstract is a one-argument, non-\long storing command (l.1205), with no environment: `defines` lists no env:abstract.
 * proof is \relax'd at load (l.2596-2597) and made with \newenvironment at \begin{document} (l.2621), so a way that
 * declares proof stops there. appendix.sty's code is embedded (\newcounter{@pps}, l.2725; appendices and subappendices,
 * l.2887-2948), so loading appendix stops at "already defined". \tableofcontents is never defined: it is listed in
 * `forbids.names` so General's contents (which prints it) is kept off this class. Under large it calls \twocolumn itself
 * (l.2515-2524) and has no twocolumn option. Layout (contemporary, large): \textwidth 185mm = 526.3757pt (l.743), body
 * 8bp = 8.03pt (l.233-236).
 */
export default defineClass({
  id: 'class.oup-authoring-template',
  name: "oup-authoring-template",
  targetEngine: "untested",
  preloads: [
    {"pkg": "crop"}, {"pkg": "graphicx"}, {"pkg": "caption"}, {"pkg": "amsmath"}, {"pkg": "array"}, {"pkg": "color"},
    {"pkg": "xcolor"}, {"pkg": "amssymb"}, {"pkg": "flushend"}, {"pkg": "stfloats"},
    {"pkg": "rotating", "options": ["figuresright"]}, {"pkg": "chngpage"}, {"pkg": "totcount"}, {"pkg": "fix-cm"},
    {"pkg": "footmisc", "options": ["bottom"]}, {"pkg": "arydshln"}, {"pkg": "natbib"}, {"pkg": "wrapfig"}, {"pkg": "amsthm"},
    {"pkg": "subfloat", "options": ["countmax"]}, {"pkg": "multirow"}, {"pkg": "footnote"}, {"pkg": "url"}, {"pkg": "mathrsfs"},
    {"pkg": "algorithm"}, {"pkg": "float"}, {"pkg": "algorithmicx"}, {"pkg": "algpseudocode"}, {"pkg": "listings"},
    {"pkg": "hyperref", "options": ["hidelinks"]}, {"pkg": "tikz"}, {"pkg": "anyfontsize"},
  ],
  defines: ["counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "counter:figure", "counter:table", "env:figure", "env:table", "env:thebibliography", "env:proof", "env:tablenotes", "env:processtable", "env:unlist", "env:epigraph", "env:methods", "env:biography", "env:appendices", "env:subappendices", "env:Figure", "env:Table", "env:boxtext", "cmd:\\maketitle", "cmd:\\abstract", "cmd:\\otherabstract", "cmd:\\frontmatter", "cmd:\\mainmatter", "cmd:\\backmatter", "cmd:\\journaltitle", "cmd:\\pubyear", "cmd:\\copyrightyear", "cmd:\\vol", "cmd:\\issue", "cmd:\\address", "cmd:\\corresp", "cmd:\\keywords", "cmd:\\botrule", "cmd:\\DOI", "cmd:\\access", "cmd:\\appnotes", "style:thmstyleone", "style:thmstyletwo", "style:thmstylethree"],
  options: {},
  forbids: {
    technical: [
      { pkg: "cite", reason: "the class (l.2424) loads natbib, whose \\NAT@set@cites at \\begin{document} installs a two-optional \\@citex (natbib.sty 8.31b l.375, l.645-674); cite.sty redefines \\cite to call \\@citex with one optional argument (cite.sty v5.5 l.302-307), so citations scan on to the paragraph's end: 'Paragraph ended before \\@citex was complete' and 'Argument of \\@citex has an extra }' (as elsarticle; b2p probe: G2-apa7-cite and G2-oup-authoring-template-cite, 48 and 53 \\@citex errors, no PDF)", evidence: [{ kind: 'source', file: "oup-authoring-template.cls (v1.5 2026/07/14, MiKTeX snapshot 9766)", line: "2424" }] },
      // batch 4 round 1.
      { pkg: "titling", reason: "titling.sty tests \\if@titlepage while it loads (titling 2009/09/04 v2.1d, l.35), which the class never defines (it is not built on article): 'Undefined control sequence' at \\if@titlepage, then 'Extra \\else'", evidence: [{ kind: 'compile', cell: 'batch 4 round 1 (testing-pipeline/out/fetched/batch4-round1): oup-authoring-template.A, 18 cells whose first error is \\if@titlepage at titling.sty l.35, each holding front.titling (document d514a7853637ea09307ae, result 5a5355040d)' }] },
      { pkg: "sectsty", reason: "oup-authoring-template is a standalone class whose sectioning sectsty does not recognise: 'Package sectsty Error: The sectsty package doesn't work with this document class' (b2p probe G2-oup-authoring-template-cite)", evidence: [{ kind: 'source', file: "oup-authoring-template.cls (v1.5 2026/07/14, MiKTeX snapshot 9766)", line: "1076-1082 (own sectioning)" }] },
      { pkg: "biblatex", reason: "the class loads natbib (l.2424), and biblatex stops at \"Incompatible package 'natbib'\" (biblatex.sty l.168-179)", evidence: [{ kind: 'source', file: 'oup-authoring-template.cls (v1.5 2026/07/14, MiKTeX snapshot 9766)', line: '2424' }, { kind: 'source', file: 'biblatex.sty (MiKTeX snapshot 9766)', line: '168-179' }] },
      { pkg: "appendix", reason: "the class embeds appendix.sty's code (\\newcounter{@pps} at l.2725, \\newenvironment{appendices} and {subappendices} at l.2887 and l.2948), so loading appendix.sty defines them again: 'Command \\c@@pps already defined'", evidence: [{ kind: 'source', file: 'oup-authoring-template.cls (v1.5 2026/07/14, MiKTeX snapshot 9766)', line: '2719-2960' }] },
      { pkg: "tabularx", reason: "under contemporary the class loads arydshln (l.1977-1978) before the preamble's tabularx, and a tabularx table then hangs the compile or stops at \\end{tabularx} in arydshln's row code ('Misplaced \\noalign', \\adl@rowsL): GitHub run b12-5bdc624, 316 of 528 documents with a General tabularx way hung with no log (13,001 branches), 0 of 347 without one; the same documents finish under apa7 and emulateapj", evidence: [{ kind: 'source', file: 'oup-authoring-template.cls (v1.5 2026/07/14, MiKTeX snapshot 9766)', line: '1977-1978 (\\usepackage{arydshln} under contemporary)' }, { kind: 'compile', cell: 'GitHub run b12-5bdc624, oup-authoring-template.A: document dd386ad946c65b730256c (no log after 122 s), d2e29f2180addd8fec18c l.256 (arydshln errors at \\end{tabularx})' }] },
    ],
    policy: [],
    names: [{ name: "cmd:\\tableofcontents", reason: "the class never defines \\tableofcontents (nor \\listoffigures, \\part or \\appendix): General's contents, which prints \\tableofcontents, stops at 'Undefined control sequence'", evidence: [{ kind: 'source', file: 'oup-authoring-template.cls (v1.5 2026/07/14, MiKTeX snapshot 9766)', line: '1-3234 (no \\tableofcontents anywhere; sectioning at 1076-1080)' }] }],
  },
  layout: { columns: 2, textwidth: "526.3757pt", fontsize: "8.03pt" },
  vocabulary: {"\\journaltitle": "the journal's name", "\\pubyear": "the publication year", "\\copyrightyear": "the copyright year", "\\vol": "the volume", "\\issue": "the issue", "\\address": "an affiliation, with its mark", "\\corresp": "the corresponding author", "\\abstract": "the abstract, stored for \\maketitle", "\\keywords": "keywords", "\\authormark": "the running-head author line"},
  evidence: [
    { kind: 'source', file: 'oup-authoring-template.cls (v1.5 2026/07/14, MiKTeX snapshot 9766)', line: '136-150 (preloads), 233-236 (contemporary large size), 743 (textwidth), 1076-1082 (counters), 1205 (\\abstract), 1339 (\\maketitle), 1977-1978 (arydshln)' },
    { kind: 'source', file: 'oup-authoring-template.cls (v1.5 2026/07/14, MiKTeX snapshot 9766)', line: '2424-2435 (natbib), 2515-2524 (\\twocolumn), 2558-2621 (wrapfig, amsthm, proof), 2705-2715, 2991-2997 (preloads)' },
  ],
});
