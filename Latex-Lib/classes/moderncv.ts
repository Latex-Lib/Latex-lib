import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * moderncv: a CV class that does not load article; it defines \section, \subsection, its lists and its bibliography itself, prints the header with \makecvtitle (no \maketitle), and has no floats, abstract or chapters.
 * Read from the research's Solution files and CTAN; measured by the class probe (moderncv.A: loads, preloads, names it already defines, refused packages, layout).
 * Its \section takes an icon, not a short title, in brackets (Solution 0196).
 */
export default defineClass({
  id: 'class.moderncv',
  name: "moderncv",
  zerotex: "yes",
  preloads: [{"pkg": "fontspec"}, {"pkg": "hyperref"}, {"pkg": "xcolor"}, {"pkg": "graphicx"}, {"pkg": "colortbl"}],
  defines: ["counter:section", "counter:subsection", "env:thebibliography"],
  options: {},
  forbids: {
    technical: [{ pkg: "footnotehyper", reason: "its load test stops: Undefined control sequence.\\FNH@check@ ...andafter \\FNH@check@a \\@makefntext  {1.2!3?4,}\\FNH@@@ 1.2!3?4,...", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/moderncv.A.json' }] }, { pkg: "tocloft", reason: "its load test stops: LaTeX Error: Command \\l@section undefined.", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/moderncv.A.json' }] }],
    policy: [],
  },
  layout: { columns: 1, textwidth: "360.0pt", fontsize: "10.95pt" },
  vocabulary: {"\\cventry": "one CV entry", "\\makecvtitle": "the CV header", "\\moderncvstyle": "the style"},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/moderncv.A.json' }, { kind: 'solution', file: 'Solution/0196-moderncv.md', lines: 'class' }, { kind: 'solution', file: 'Solution/0410-moderncv-cv-and-cover-letter.md', lines: 'class' }, ctan('moderncv')],
});
