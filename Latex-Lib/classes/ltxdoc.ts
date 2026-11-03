import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * The LaTeX project's documentation class: article with the doc package (macrocode, macro and environment environments, \DescribeMacro), for .dtx files.
 * Read from its requirement document and source; measured by the class probe (ltxdoc.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.ltxdoc',
  name: "ltxdoc",
  base: 'class.article',
  zerotex: "yes",
  preloads: [{"pkg": "hyperref"}, {"pkg": "multicol"}, {"pkg": "doc"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:macrocode", "env:macro", "env:environment", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "355.0pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/ltxdoc.A.json' }, ctan('ltxdoc'), ctan('doc')],
});
