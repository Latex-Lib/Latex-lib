import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * LaTeX's standard report class: chapters, one-sided, an abstract on its own page.
 * Read from its requirement document and its source; measured by the class probe
 * (report.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.report',
  name: "report",
  targetEngine: "yes",
  preloads: [],
  defines: ["counter:chapter", "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "345.0pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/report.A.json' }, ctan('latex-base')],
});
