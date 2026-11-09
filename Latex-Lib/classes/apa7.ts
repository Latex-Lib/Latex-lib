import { defineClass } from '../schema/class.ts';

/**
 * apa7 (APA 7th edition, apa7.cls 2022/07/25 v2.16), read from the class source (MiKTeX snapshot 9766, package apa7) for
 * batch 2 (b2p), not yet measured by a class probe, with the setting's options man, natbib, floatsintext and nofontenc.
 * man mode loads \LoadClass[12pt,twoside]{article} (l.173): one column. Preloads under those options:
 * - apacite [natbibapa,bibnewpage] (l.208), which loads natbib [longnamesfirst,sort] (apacite.sty l.998);
 * - lmodern (l.221; nofontenc skips T1 fontenc, l.225), geometry [top=1in,bottom=1in,left=1in,right=1in] (l.304),
 *   graphicx (l.309), scalerel, tikz and hyperref with no options (l.311), booktabs (l.328), threeparttable
 *   [para,flushleft] (l.332), caption [singlelinecheck=off] (l.706), bm where it exists (l.989), fancyhdr (l.1102),
 *   endfloat [notablist,figlist,notabhead,nofighead,tablesfirst,nomarkers] (l.1126, loaded even with floatsintext) and
 *   float (floatsintext, l.1185). etoolbox comes from the setting's preamble.
 * apacite is left out of `preloads` on purpose: its facts' conflict with hyperref (and natbib) would make the host refuse
 * hyperref, and every General way that links, under a class that loads both itself. bib.apacite stays off this class
 * anyway, through that same conflict read from the way's side against the preloaded hyperref.
 *
 * No abstract environment: \abstract is a storing command (\long\def\abstract#1, l.785) printed by \maketitle, so
 * \begin{abstract} would keep one token and set the rest as text; `defines` lists no env:abstract, which keeps the
 * abstract ways that require one off this class. \maketitle is defined per mode (l.1245, 1409, 1579). secnumdepth is 0
 * (l.668): headings are unnumbered, article's counters stay. \subparagraph takes its title as a plain argument (l.695-698),
 * so a starred or short-titled \subparagraph prints its title as body text (cosmetic, no TeX error). Layout: letter paper
 * less 1in margins = 6.5in = 469.755pt, 12pt.
 */
export default defineClass({
  id: 'class.apa7',
  name: "apa7",
  base: 'class.article',
  targetEngine: "untested",
  preloads: [
    {"pkg": "natbib", "options": ["longnamesfirst", "sort"]}, {"pkg": "lmodern"},
    {"pkg": "geometry", "options": ["top=1in", "bottom=1in", "left=1in", "right=1in"]},
    {"pkg": "graphicx"}, {"pkg": "scalerel"}, {"pkg": "tikz"}, {"pkg": "hyperref"}, {"pkg": "booktabs"},
    {"pkg": "threeparttable", "options": ["para", "flushleft"]}, {"pkg": "caption", "options": ["singlelinecheck=off"]},
    {"pkg": "bm"}, {"pkg": "fancyhdr"},
    {"pkg": "endfloat", "options": ["notablist", "figlist", "notabhead", "nofighead", "tablesfirst", "nomarkers"]},
    {"pkg": "float"},
  ],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "counter:appendix", "counter:APAenum", "env:figure", "env:table", "env:thebibliography", "env:APAenumerate", "env:APAitemize", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\abstract", "cmd:\\keywords", "cmd:\\shorttitle", "cmd:\\authorsnames", "cmd:\\authorsaffiliations", "cmd:\\authornote", "cmd:\\leftheader", "cmd:\\figurenote", "cmd:\\tablenote", "cmd:\\fitfigure", "cmd:\\seriate", "cmd:\\addORCIDlink"],
  options: {},
  forbids: {
    technical: [
      { pkg: "cite", reason: "apa7.cls with its natbib option, through apacite (apacite.sty l.998), loads natbib, whose \\NAT@set@cites at \\begin{document} installs a two-optional \\@citex (natbib.sty 8.31b l.375, l.645-674); cite.sty redefines \\cite to call \\@citex with one optional argument (cite.sty v5.5 l.302-307), so citations scan on to the paragraph's end: 'Paragraph ended before \\@citex was complete' and 'Argument of \\@citex has an extra }' (as elsarticle; b2p probe: G2-apa7-cite and G2-oup-authoring-template-cite, 48 and 53 \\@citex errors, no PDF)", evidence: [{ kind: 'source', file: "apa7.cls (apa7 2022/07/25 v2.16, MiKTeX snapshot 9766)", line: "natbib option; apacite.sty 998" }] },
      { pkg: "titlesec", reason: "titlesec reads every sectioning command as it loads (\\ttl@extract, titlesec.sty l.1635 for \\subparagraph), and apa7's own \\subparagraph is not the kernel's \\@startsection form: 'Argument of \\subparagraph has an extra }' while the preamble loads (GitHub run b12-5bdc624, apa7.A: 965 of 965 branches with a titlesec way fail, 1,155 branches in their cells)", evidence: [{ kind: 'compile', cell: 'GitHub run b12-5bdc624, apa7.A (document de310fe8fa6938c79d8e5)' }] },
      { pkg: "biblatex", reason: "apa7.cls loads apacite with natbibapa (l.208), which loads natbib (apacite.sty l.998), and biblatex stops at \"Incompatible package\" for both (biblatex.sty l.168-179)", evidence: [{ kind: 'source', file: 'apa7.cls (apa7 2022/07/25 v2.16, MiKTeX snapshot 9766)', line: '204-208' }, { kind: 'source', file: 'biblatex.sty (MiKTeX snapshot 9766)', line: '168-179' }] },
      { pkg: "parskip", reason: "apa7 loads apacite and hyperref itself (l.208, l.311); apacite's facts record that every apacite document that also loaded hyperref and parskip overflowed TeX's input stack at \\begin{document}, while apacite with parskip and no hyperref got past it 4 of 4 (packages/apacite.ts). Refused defensively, since this class cannot drop hyperref or apacite", evidence: [{ kind: 'source', file: 'apa7.cls (apa7 2022/07/25 v2.16, MiKTeX snapshot 9766)', line: '208, 311' }, { kind: 'compile', cell: 'copy batch-3b article.A run: dfad84dff4c247fb83103 (result bf8fab2e33, l.62 \\begin{document}); batch-4 staging probe f174fe9f3f91 (as cited in packages/apacite.ts)' }] },
    ],
    policy: [],
  },
  layout: { columns: 1, textwidth: "469.755pt", fontsize: "12pt" },
  vocabulary: {"\\shorttitle": "the running head", "\\authorsnames": "the authors, with affiliation numbers", "\\authorsaffiliations": "the affiliations", "\\authornote": "the author note", "\\abstract": "the abstract, stored for \\maketitle", "\\keywords": "keywords", "\\leftheader": "the left running head (jou mode)"},
  evidence: [
    { kind: 'source', file: 'apa7.cls (apa7 2022/07/25 v2.16, MiKTeX snapshot 9766)', line: '173 (article), 204-225 (apacite, lmodern, nofontenc), 304-332 (geometry, graphicx, tikz, hyperref, booktabs, threeparttable), 668-706 (headings, caption)' },
    { kind: 'source', file: 'apa7.cls (apa7 2022/07/25 v2.16, MiKTeX snapshot 9766)', line: '739-785 (APAenumerate, APAitemize, \\abstract), 989, 1026-1041 (appendix), 1102-1185 (fancyhdr, endfloat, float), 1245, 1409, 1579 (\\maketitle, one per mode)' },
    { kind: 'source', file: 'apacite.sty (MiKTeX snapshot 9766)', line: '998' },
  ],
});
