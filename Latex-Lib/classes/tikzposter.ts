import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * tikzposter: a poster of \block{title}{content} in columns, drawn with TikZ; \maketitle draws the title box; content sits in macro arguments, so no floats and no verbatim.
 * Read from the research's Solution files and CTAN; measured by the class probe (tikzposter.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.tikzposter',
  name: "tikzposter",
  zerotex: "yes",
  preloads: [{"pkg": "xcolor"}, {"pkg": "graphicx"}, {"pkg": "tikz"}],
  defines: ["cmd:\\maketitle", "env:thebibliography"],
  options: {},
  forbids: {
    technical: [{ pkg: "mathtools", reason: "its load test stops: LaTeX Error: Loading a class or package in a group.", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/tikzposter.A.json' }] }],
    policy: [],
  },
  layout: { columns: 1, textwidth: "2392.87677pt", fontsize: "24.88pt" },
  vocabulary: {"\\block": "a titled block", "\\column": "a column of blocks", "\\usetheme": "the poster theme"},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/tikzposter.A.json' }, { kind: 'solution', file: 'Solution/0436-jacobs-landscape-poster.md', lines: 'class' }, { kind: 'solution', file: 'Solution/0707-tu-delft-poster.md', lines: 'class' }, ctan('tikzposter')],
});
