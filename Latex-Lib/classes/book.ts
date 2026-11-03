import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * LaTeX's standard book class: chapters, two-sided, the title on a page of its own; no abstract.
 * Read from its requirement document and its source; measured by the class probe
 * (book.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.book',
  name: "book",
  zerotex: "yes",
  preloads: [],
  defines: ["counter:chapter", "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "345.0pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/book.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/Book.md', line: '78' }, { kind: 'requirement', file: 'Template/template-requirement/Book.md', line: '80' }, { kind: 'requirement', file: 'Template/template-requirement/Book.md', line: '96' }, { kind: 'requirement', file: 'Template/template-requirement/Book.md', line: '117' }, ctan('latex-base')],
});
