import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/** The class source as the engine fetches it (MiKTeX package ut-thesis); line numbers below are this file's. */
const CLS = 'ut-thesis.cls (ut-thesis 2024/07/26 v3.1.8, MiKTeX snapshot 9766)';

/**
 * ut-thesis, the University of Toronto thesis class, read from its source (batch 2, setting ut-thesis.A; not yet measured by the
 * class probe). It loads book with oneside and passes every other option on (l.94-97), then loads geometry and setspace without
 * options (l.98-99) and sets the page with \geometry at the end of the class (l.60-77): 1in top and bottom, 1.25in inner and outer
 * under the default equalmargins and normalmargins (l.78-95), so a 6in text block on book's letter paper, onehalfspacing (l.95).
 * Both packages are loaded without options, so a way that loads either with an option stops at "Option clash" (the host reads that
 * from `preloads`); a way that only calls \geometry{...} or \doublespacing runs.
 * Book has no abstract; this class defines one (l.138-152: a centred block with the title, author, degree and department, then
 * \section*{Abstract} and double spacing, ending with \cleardoublepage), so ways that need env:abstract fit it. \maketitle is a whole
 * SGS title page (l.115-137) printing \@degree, \@deptname and \@gradyear, which the setting's preamble fills. \cleardoublepage is
 * redefined (l.169-170) and the headings page style prints the chapter and section marks (l.173-192).
 */
export default defineClass({
  id: 'class.ut-thesis',
  name: "ut-thesis",
  base: 'class.book',
  zerotex: "untested",
  preloads: [{"pkg": "geometry"}, {"pkg": "setspace"}],
  defines: ["counter:chapter", "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:figure", "env:table", "env:thebibliography", "env:abstract", "env:dedication", "env:acknowledgements", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\degree", "cmd:\\gradyear", "cmd:\\department", "cmd:\\copyrighttext", "cmd:\\headerstyle"],
  options: {},
  forbids: {
    technical: [
      { pkg: "abstract", reason: "abstract.sty's environment prints abstractname, which book.cls never defines (ut-thesis makes its own abstract with a literal section*{Abstract}, l.138-152): every \\begin{abstract} stops at 'Undefined control sequence' (b2p probe G3-ut-thesis-abstract (63 errors))", evidence: [{ kind: 'source', file: "G3/ut-thesis.ts", line: "138-152" }] },
    ],
    policy: [],
  },
  // 8.5in paper less 2 x 1.25in (inner and outer, equalmargins: \margin@base 1in + half of the 0.5in offset, l.60-64) = 6in = 433.62pt.
  layout: { columns: 1, textwidth: "433.62pt", fontsize: "10pt" },
  vocabulary: {"\\degree": "the degree sought (title page, abstract)", "\\department": "the graduate unit, with an optional prefix (default 'Department of')", "\\gradyear": "the year of graduation", "\\copyrighttext": "the title page's copyright line"},
  evidence: [
    { kind: 'source', file: CLS, line: '94-99' },
    { kind: 'source', file: CLS, line: '60-77' },
    { kind: 'source', file: CLS, line: '100-106' },
    { kind: 'source', file: CLS, line: '115-170' },
    ctan('ut-thesis'),
  ],
});
