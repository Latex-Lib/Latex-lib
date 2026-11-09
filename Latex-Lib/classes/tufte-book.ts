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
  targetEngine: "yes",
  preloads: [{"pkg": "fontspec"}, {"pkg": "titlesec"}, {"pkg": "setspace"}, {"pkg": "hyperref"}, {"pkg": "multicol"}, {"pkg": "xcolor"}, {"pkg": "graphicx"}, {"pkg": "geometry"}, {"pkg": "fancyhdr"}, {"pkg": "natbib"}, {"pkg": "bibentry"}],
  defines: ["counter:chapter", "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "cmd:\\sidenote", "cmd:\\marginnote", "env:marginfigure", "env:margintable", "env:fullwidth", "cmd:\\newthought", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\publisher", "cmd:\\maketitlepage", "cmd:\\backmatter", "cmd:\\frontmatter", "cmd:\\mainmatter", "cmd:\\setsidenotefont"],
  options: {},
  setup: {
    options: ['nols'],
    reason: "without nols, tufte-common.def (v3.5.2 l.701-737) gives XeTeX soul's letter-spaced \\textsc, which takes its argument apart token by token: \\smallcaps of any text with a space fails ('Argument of \\MakeTextUppercase has an extra }', soul's 'Reconstruction failed'), and the class's own even-page running head is \\smallcaps of the title, so nearly every document stops (tufte-handout.ts documents the same option)",
    evidence: [
      { kind: 'compile', reproducer: "\\documentclass{tufte-book} with a two-word \\title, \\maketitle, a \\chapter and \\smallcaps{small caps text} over three pages: 'Argument of \\MakeTextUppercase has an extra }'; with \\documentclass[nols]{tufte-book} it compiles (class-examples' probe (Latex Related Research/Latex-Template-Examples, 2026-11-06), through Flouest's headless ZeroTeX-NG runner)" },
      { kind: 'compile', cell: 'class-examples: _results/class.tufte-book.log (2026-11-06)' },
    ],
  },
  forbids: {
    technical: [{ pkg: "marginnote", reason: "its load test stops: LaTeX Error: Command \\marginnote already defined. Or name \\end... illegal, see p.192 of the manual.", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/tufte-book.A.json' }] }],
    policy: [],
  },
  layout: { columns: 1, textwidth: "312.0pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/tufte-book.A.json' }, { kind: 'solution', file: 'Solution/0087-xtufte.md', lines: 'class' }, ctan('tufte-latex')],
});
