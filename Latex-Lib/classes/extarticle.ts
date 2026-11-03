import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * extsizes' article: the standard article at 8pt to 20pt (option 8pt, 9pt, 14pt, 17pt, 20pt).
 * Read from its requirement document and its source; measured by the class probe
 * (extarticle.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.extarticle',
  name: "extarticle",
  zerotex: "yes",
  preloads: [],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "345.0pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/extarticle.A.json' }, ctan('extsizes')],
});
