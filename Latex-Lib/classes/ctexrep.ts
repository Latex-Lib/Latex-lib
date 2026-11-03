import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * ctex's report: the standard report with Chinese typesetting.
 * Read from its requirement document and source; measured by the class probe (ctexrep.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.ctexrep',
  name: "ctexrep",
  base: 'class.report',
  zerotex: "yes",
  preloads: [{"pkg": "fontspec"}],
  defines: ["counter:chapter", "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "345.0pt", fontsize: "10.53937pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/ctexrep.A.json' }, ctan('ctex')],
});
