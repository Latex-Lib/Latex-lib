import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * Springer Nature's journal class: article underneath, no chapter, \abstract{} as a command, amsthm with four styles and no theorem environments, tables in threeparttable.
 * Read from its requirement document and source; measured by the class probe (sn-jnl.A: loads, preloads, names it already defines, refused packages, layout). Its setting loads amsmath, as the template does (the class calls \allowdisplaybreaks), so amsmath is not listed as a preload.
 * Each bibliography option loads natbib (or apacite) and sets its .bst (cls l.1647-1735; requirement line 37). The setting gives sn-mathphys-num, so natbib with numbers,sort&compress is among the preloads (cls l.1661-1662), read from the source because the probe asks only for General's packages; with it biblatex, General's or a library way's, is refused. The other preloads are read from the source too (l.260-271, 773, 1323, 1368, 1497, 1536). Some Springer journals ask that files compile with pdfLaTeX (line 39).
 */
export default defineClass({
  id: 'class.sn-jnl',
  name: "sn-jnl",
  base: 'class.article',
  zerotex: "yes",
  preloads: [{"pkg": "geometry"}, {"pkg": "cuted"}, {"pkg": "rotating", "options": ["figuresright"]}, {"pkg": "graphicx"}, {"pkg": "threeparttable"}, {"pkg": "appendix", "options": ["title"]}, {"pkg": "hyperref"}, {"pkg": "wrapfig"}, {"pkg": "amsthm"}, {"pkg": "fix-cm"}, {"pkg": "natbib", "options": ["numbers", "sort&compress"]}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "cmd:\\abstract", "env:proof", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "372.0pt", fontsize: "10.03749pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/sn-jnl.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/Springer_Nature_SN_Jnl.md', line: '37' }, { kind: 'requirement', file: 'Template/template-requirement/Springer_Nature_SN_Jnl.md', line: '39' }, { kind: 'requirement', file: 'Template/template-requirement/Springer_Nature_SN_Jnl.md', line: '53' }, { kind: 'requirement', file: 'Template/template-requirement/Springer_Nature_SN_Jnl.md', line: '60' }, { kind: 'requirement', file: 'Template/template-requirement/Springer_Nature_SN_Jnl.md', line: '75' }, { kind: 'requirement', file: 'Template/template-requirement/Springer_Nature_SN_Jnl.md', line: '91' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/sn-jnl.cls', line: '1661-1664 (CR line ends)' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/sn-jnl.cls', line: '260-271, 773, 1323, 1368, 1497, 1536 (CR line ends)' }],
});
