import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * The kernel's proceedings class: article in two columns.
 * Read from the research's Solution files and CTAN; measured by the class probe (proc.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.proc',
  name: "proc",
  base: 'class.article',
  targetEngine: "yes",
  preloads: [],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\copyrightspace"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 2, textwidth: "488.0pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/proc.A.json' }, ctan('latex-base')],
});
