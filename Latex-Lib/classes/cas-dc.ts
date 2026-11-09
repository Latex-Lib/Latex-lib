import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * Elsevier's CAS double-column class: as cas-sc, set in two columns.
 * Read from its requirement document and source; measured by the class probe (cas-dc.A: loads, preloads, names it already defines, refused packages, layout).
 * Its preloads' options and the further packages (array, footmisc, wrapfig, geometry, fontenc, balance) and names are read from cas-dc.cls and cas-common.sty (batch 6): footmisc is preloaded bare, so fn.footmisc's optioned presets would clash ("Option clash for package footmisc") once footnoteAnchor is plugged.
 */
export default defineClass({
  id: 'class.cas-dc',
  name: "cas-dc",
  base: 'class.article',
  targetEngine: "yes",
  preloads: [{"pkg": "amsmath"}, {"pkg": "amssymb"}, {"pkg": "hyperref", "options": ["colorlinks"]}, {"pkg": "xcolor", "options": ["svgnames", "dvipsnames"]}, {"pkg": "graphicx"}, {"pkg": "booktabs"}, {"pkg": "colortbl"}, {"pkg": "amsfonts"}, {"pkg": "makecell"}, {"pkg": "multirow"}, {"pkg": "array"}, {"pkg": "footmisc"}, {"pkg": "wrapfig"}, {"pkg": "geometry"}, {"pkg": "fontenc", "options": ["T1"]}, {"pkg": "balance"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "env:keywords", "env:Abstract", "env:graphicalabstract", "env:highlights", "cmd:\\newdefinition", "cmd:\\newproof", "cmd:\\qed", "cmd:\\shorttitle", "cmd:\\shortauthors", "cmd:\\cormark", "cmd:\\ead", "cmd:\\affiliation", "cmd:\\cortext", "cmd:\\credit", "cmd:\\tnotemark", "cmd:\\tnotetext", "cmd:\\nonumnote", "cmd:\\MSC", "cmd:\\JEL", "cmd:\\PACS", "cmd:\\tblwidth"],
  heldByMaketitle: [{ resource: 'env:abstract', reason: "cas-dc's abstract environment stores its text for \\maketitle: written with no \\maketitle after it, the abstract is on no page", evidence: [{ kind: 'compile', reproducer: "\\documentclass{cas-dc} \\begin{document} \\begin{abstract}Abstract text.\\label{absmark}\\end{abstract} \\section{One}Body. \\end{document}: absmark is not in main.aux; with \\title, \\author and \\maketitle after the abstract it is (ZeroTeX-NG, the studio's measurement, 2026-10-31; found as Lab Report 2's missing abstract under revtex4-2)" }] }],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "494.50888pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/cas-dc.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/Elsevier_CAS_DC.md', line: '64' }, { kind: 'requirement', file: 'Template/template-requirement/Elsevier_CAS_DC.md', line: '81' }, { kind: 'requirement', file: 'Template/template-requirement/Elsevier_CAS_DC.md', line: '86' }, { kind: 'source', file: 'cas-common.sty (els-cas-templates, as the engine fetches it)', line: '1500, 1612, 2264, 2541-2627' }, { kind: 'source', file: 'cas-dc.cls (els-cas-templates, as the engine fetches it)', line: '55-90' }],
});
