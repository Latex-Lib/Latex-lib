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
 * (l.2705-2715), hyperref [hidelinks] (l.2991), tikz (l.2993), and anyfontsize at \begin{document} (l.2706).
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
  zerotex: "untested",
  preloads: [
    {"pkg": "crop"}, {"pkg": "graphicx"}, {"pkg": "caption"}, {"pkg": "amsmath"}, {"pkg": "array"}, {"pkg": "color"},
    {"pkg": "xcolor"}, {"pkg": "amssymb"}, {"pkg": "flushend"}, {"pkg": "stfloats"},
    {"pkg": "rotating", "options": ["figuresright"]}, {"pkg": "chngpage"}, {"pkg": "totcount"}, {"pkg": "fix-cm"},
    {"pkg": "footmisc", "options": ["bottom"]}, {"pkg": "arydshln"}, {"pkg": "natbib"}, {"pkg": "wrapfig"}, {"pkg": "amsthm"},
    {"pkg": "subfloat", "options": ["countmax"]}, {"pkg": "multirow"}, {"pkg": "footnote"}, {"pkg": "url"}, {"pkg": "mathrsfs"},
    {"pkg": "algorithm"}, {"pkg": "algorithmicx"}, {"pkg": "algpseudocode"}, {"pkg": "listings"},
    {"pkg": "hyperref", "options": ["hidelinks"]}, {"pkg": "tikz"}, {"pkg": "anyfontsize"},
  ],
  defines: ["counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "counter:figure", "counter:table", "env:figure", "env:table", "env:thebibliography", "env:proof", "env:tablenotes", "env:processtable", "env:unlist", "env:epigraph", "env:methods", "env:biography", "env:appendices", "env:subappendices", "env:Figure", "env:Table", "env:boxtext", "cmd:\\maketitle", "cmd:\\abstract", "cmd:\\otherabstract", "cmd:\\frontmatter", "cmd:\\mainmatter", "cmd:\\backmatter", "cmd:\\journaltitle", "cmd:\\pubyear", "cmd:\\copyrightyear", "cmd:\\vol", "cmd:\\issue", "cmd:\\address", "cmd:\\corresp", "cmd:\\keywords"],
  options: {},
  forbids: {
    technical: [
      { pkg: "cite", reason: "the class (l.2424) loads natbib, whose \\NAT@set@cites at \\begin{document} installs a two-optional \\@citex (natbib.sty 8.31b l.375, l.645-674); cite.sty redefines \\cite to call \\@citex with one optional argument (cite.sty v5.5 l.302-307), so citations scan on to the paragraph's end: 'Paragraph ended before \\@citex was complete' and 'Argument of \\@citex has an extra }' (as elsarticle; b2p probe: G2-apa7-cite and G2-oup-authoring-template-cite, 48 and 53 \\@citex errors, no PDF)", evidence: [{ kind: 'source', file: "oup-authoring-template.cls (v1.5 2026/07/14, MiKTeX snapshot 9766)", line: "2424" }] },
      { pkg: "sectsty", reason: "oup-authoring-template is a standalone class whose sectioning sectsty does not recognise: 'Package sectsty Error: The sectsty package doesn't work with this document class' (b2p probe G2-oup-authoring-template-cite)", evidence: [{ kind: 'source', file: "oup-authoring-template.cls (v1.5 2026/07/14, MiKTeX snapshot 9766)", line: "1076-1082 (own sectioning)" }] },
      { pkg: "biblatex", reason: "the class loads natbib (l.2424), and biblatex stops at \"Incompatible package 'natbib'\" (biblatex.sty l.168-179)", evidence: [{ kind: 'source', file: 'oup-authoring-template.cls (v1.5 2026/07/14, MiKTeX snapshot 9766)', line: '2424' }, { kind: 'source', file: 'biblatex.sty (MiKTeX snapshot 9766)', line: '168-179' }] },
      { pkg: "appendix", reason: "the class embeds appendix.sty's code (\\newcounter{@pps} at l.2725, \\newenvironment{appendices} and {subappendices} at l.2887 and l.2948), so loading appendix.sty defines them again: 'Command \\c@@pps already defined'", evidence: [{ kind: 'source', file: 'oup-authoring-template.cls (v1.5 2026/07/14, MiKTeX snapshot 9766)', line: '2719-2960' }] },
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
