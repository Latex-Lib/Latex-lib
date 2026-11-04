import { defineClass } from '../schema/class.ts';

/**
 * achemso (ACS submissions, achemso.cls 2025-09-22 v3.14), read from the class source (MiKTeX snapshot 9766, package
 * achemso) for batch 2 (b2p), not yet measured by a class probe. It loads \LoadClass[12pt,letter]{article} (l.25), one
 * column, and with journal=jacsat, manuscript=article (the setting) its jacsat file only turns section numbers off
 * (achemso-jacsat.cfg l.25-28, then \endinput for every manuscript but communication). Preloads: xkeyval (l.35), geometry
 * [margin=2.54cm] (l.308), caption, float, graphicx, setspace, url (l.309-315), natbib [sort&compress,numbers,super]
 * (l.1396: super is the default, l.129-131 and 296-305), natmove (l.1412), and mciteplus where the file exists (l.1413-1414;
 * left out, as the mirror may not fetch it). hyperref comes only with the class's hyperref option (l.316-321), which the
 * setting does not give. Every \bibliographystyle is replaced by achemso (l.1427-1435).
 *
 * \maketitle is appended to \document (l.1021), so the title block is set at \begin{document} from the preamble's \title,
 * and article's \maketitle then lets itself to \relax: a \maketitle in the body prints nothing. `defines` therefore lists
 * the class's commands but not cmd:\maketitle, which keeps General's title (whose \maketitle is in the body) off this class,
 * as for mdpi (host.ts, CA23). It defines the float environments scheme, chart and graph (float's \newfloat, l.1022-1026),
 * acknowledgement and suppinfo (l.1112-1117) and tocentry (l.1270): a way declaring any of them stops at "already defined".
 * Layout: letter paper less 2.54cm margins = 6.5in = 469.755pt, 12pt.
 */
export default defineClass({
  id: 'class.achemso',
  name: "achemso",
  base: 'class.article',
  zerotex: "untested",
  preloads: [
    {"pkg": "xkeyval"}, {"pkg": "geometry", "options": ["margin=2.54cm"]}, {"pkg": "caption"}, {"pkg": "float"},
    {"pkg": "graphicx"}, {"pkg": "setspace"}, {"pkg": "url"},
    {"pkg": "natbib", "options": ["sort&compress", "numbers", "super"]}, {"pkg": "natmove"},
  ],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "counter:scheme", "counter:chart", "counter:graph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "env:scheme", "env:chart", "env:graph", "env:acknowledgement", "env:suppinfo", "env:tocentry", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\affiliation", "cmd:\\alsoaffiliation", "cmd:\\altaffiliation", "cmd:\\email", "cmd:\\phone", "cmd:\\fax", "cmd:\\abbreviations", "cmd:\\keywords", "cmd:\\SectionNumbersOff", "cmd:\\SectionNumbersOn", "cmd:\\bibnote", "cmd:\\latin", "cmd:\\schemename", "cmd:\\chartname", "cmd:\\graphname", "cmd:\\acknowledgementname", "cmd:\\suppinfoname"],
  options: {},
  forbids: {
    technical: [
      { pkg: "scrextend", reason: "achemso.cls defines \\titlefont (\\newcommand*, l.588), and scrextend's KOMA kernel defines them again with \\newcommand (scrextend.sty: sectfont l.143, \\titlefont l.1528 in the probe log): 'Command \\titlefont already defined' (b2p probe: G2-spie-cite, G2-spie-natbib, G2-achemso-natbib)", evidence: [{ kind: 'source', file: "achemso.cls (achemso 2025-09-22 v3.14, MiKTeX snapshot 9766)", line: "588" }] },
      { pkg: "cite", reason: "achemso.cls (natbib with sort&compress,numbers,super) loads natbib, whose \\NAT@set@cites at \\begin{document} installs a two-optional \\@citex (natbib.sty 8.31b l.375, l.645-674); cite.sty redefines \\cite to call \\@citex with one optional argument (cite.sty v5.5 l.302-307), so citations scan on to the paragraph's end: 'Paragraph ended before \\@citex was complete' and 'Argument of \\@citex has an extra }' (as elsarticle; b2p probe: G2-apa7-cite and G2-oup-authoring-template-cite, 48 and 53 \\@citex errors, no PDF)", evidence: [{ kind: 'source', file: "achemso.cls (achemso 2025-09-22 v3.14, MiKTeX snapshot 9766)", line: "natbib load" }] },
      { pkg: "biblatex", reason: "achemso.cls loads natbib (l.1396), and biblatex stops at \"Incompatible package 'natbib'\" (biblatex.sty l.168-179)", evidence: [{ kind: 'source', file: 'achemso.cls (achemso 2025-09-22 v3.14, MiKTeX snapshot 9766)', line: '1396' }, { kind: 'source', file: 'biblatex.sty (MiKTeX snapshot 9766)', line: '168-179' }] },
    ],
    policy: [],
  },
  layout: { columns: 1, textwidth: "469.755pt", fontsize: "12pt" },
  vocabulary: {"\\affiliation": "an author's affiliation (given after each \\author)", "\\alsoaffiliation": "a further affiliation", "\\altaffiliation": "a footnoted alternative address", "\\email": "the corresponding author's e-mail", "\\phone": "a telephone number", "\\fax": "a fax number", "\\abbreviations": "abbreviations", "\\keywords": "keywords"},
  evidence: [
    { kind: 'source', file: 'achemso.cls (achemso 2025-09-22 v3.14, MiKTeX snapshot 9766)', line: '25 (article), 35, 129-131, 296-321 (preloads, super), 1021-1026 (\\maketitle at \\document, floats), 1112-1117, 1270 (environments), 1396-1435 (natbib, natmove, bibliography style)' },
    { kind: 'source', file: 'achemso-jacsat.cfg (achemso 2025-09-22 v3.14, MiKTeX snapshot 9766)', line: '25-28' },
  ],
});
