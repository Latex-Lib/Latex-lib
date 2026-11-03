import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * a0poster: article at A0 to A3 poster sizes, with font sizes up to \VERYHuge.
 * Read from the research's Solution files and CTAN; measured by the class probe (a0poster.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.a0poster',
  name: "a0poster",
  base: 'class.article',
  zerotex: "yes",
  preloads: [],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "3243.61417pt", fontsize: "24.88pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/a0poster.A.json' }, { kind: 'solution', file: 'Solution/0526-a0poster.md', lines: 'class' }, ctan('a0poster')],
});
