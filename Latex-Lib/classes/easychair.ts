import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * The EasyChair class: article underneath (report with the thesis option), listings, amsthm and empheq loaded.
 * Read from its requirement document and source; measured by the class probe (easychair.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.easychair',
  name: "easychair",
  base: 'class.article',
  zerotex: "yes",
  preloads: [{"pkg": "amsmath"}, {"pkg": "mathtools"}, {"pkg": "amsthm"}, {"pkg": "hyperref"}, {"pkg": "xcolor"}, {"pkg": "graphicx"}, {"pkg": "listings"}, {"pkg": "empheq"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:proof", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {"thesis": {"adds": ["counter:chapter"], "description": "the class loads report instead of article, so chapters exist"}},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "412.56496pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/easychair.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/EasyChair.md', line: '20' }, { kind: 'requirement', file: 'Template/template-requirement/EasyChair.md', line: '23' }, { kind: 'requirement', file: 'Template/template-requirement/EasyChair.md', line: '35' }],
});
