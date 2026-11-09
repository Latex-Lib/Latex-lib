import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * ctex's beamer: beamer with Chinese typesetting; beamer's rules hold.
 * Read from its requirement document and source; measured by the class probe (ctexbeamer.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.ctexbeamer',
  name: "ctexbeamer",
  base: 'class.beamer',
  targetEngine: "yes",
  preloads: [{"pkg": "fontspec"}, {"pkg": "amsmath"}, {"pkg": "amssymb"}, {"pkg": "amsthm"}, {"pkg": "hyperref"}, {"pkg": "xcolor"}, {"pkg": "graphicx"}, {"pkg": "enumerate"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "env:theorem", "env:corollary", "env:fact", "env:lemma", "env:problem", "env:solution", "env:definition", "env:example", "env:abstract", "cmd:\\note", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\institute", "cmd:\\titlepage", "env:block", "env:frame", "cmd:\\frametitle", "env:columns", "env:column", "cmd:\\zihao", "env:alertblock", "env:exampleblock", "cmd:\\ctexset", "cmd:\\usetheme"],
  options: {},
  forbids: {
    technical: [{ pkg: "tocloft", reason: "its load test stops: LaTeX Error: Command \\l@section undefined.", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/ctexbeamer.A.json' }] }],
    policy: [],
  },
  layout: { columns: 1, textwidth: "307.28987pt", fontsize: "10.95pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/ctexbeamer.A.json' }, ctan('ctex'), ctan('beamer')],
});
