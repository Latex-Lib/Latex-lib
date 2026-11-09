import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * extsizes' book: the standard book at 8pt to 20pt; chapters, no abstract.
 * Read from the research's Solution files and CTAN; measured by the class probe (extbook.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.extbook',
  name: "extbook",
  targetEngine: "yes",
  preloads: [],
  defines: ["counter:chapter", "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\frontmatter", "cmd:\\mainmatter", "cmd:\\backmatter"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "345.0pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/extbook.A.json' }, ctan('extsizes')],
});
