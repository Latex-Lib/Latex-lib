import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * extsizes' report: the standard report at 8pt to 20pt; chapters and an abstract.
 * Read from the research's Solution files and CTAN; measured by the class probe (extreport.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.extreport',
  name: "extreport",
  zerotex: "yes",
  preloads: [],
  defines: ["counter:chapter", "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "345.0pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/extreport.A.json' }, ctan('extsizes'), { kind: 'solution', file: 'Solution/0064-korogodin-nslreport.md', lines: 'class' }],
});
