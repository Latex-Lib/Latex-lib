import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * Tufte-LaTeX's book: book with Tufte's margin notes and figures, chapters, no abstract.
 * Read from the research's Solution files and CTAN; measured by the class probe (tufte-book.A: loads, preloads, names it already defines, refused packages, layout).
 * The research's two templates use xtufte-book, a variant; its preloads are the Tufte-LaTeX packages it is known to load.
 */
export default defineClass({
  id: 'class.tufte-book',
  name: "tufte-book",
  base: 'class.book',
  zerotex: "yes",
  preloads: [{"pkg": "fontspec"}, {"pkg": "titlesec"}, {"pkg": "setspace"}, {"pkg": "hyperref"}, {"pkg": "multicol"}, {"pkg": "xcolor"}, {"pkg": "graphicx"}, {"pkg": "geometry"}, {"pkg": "fancyhdr"}, {"pkg": "natbib"}, {"pkg": "bibentry"}],
  defines: ["counter:chapter", "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "cmd:\\sidenote", "cmd:\\marginnote", "env:marginfigure", "env:margintable", "env:fullwidth", "cmd:\\newthought", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [{ pkg: "marginnote", reason: "its load test stops: LaTeX Error: Command \\marginnote already defined. Or name \\end... illegal, see p.192 of the manual.", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/tufte-book.A.json' }] }],
    policy: [],
  },
  layout: { columns: 1, textwidth: "312.0pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/tufte-book.A.json' }, { kind: 'solution', file: 'Solution/0087-xtufte.md', lines: 'class' }, ctan('tufte-latex')],
});
