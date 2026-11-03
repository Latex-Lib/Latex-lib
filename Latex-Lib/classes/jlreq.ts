import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * jlreq: Japanese typesetting by the W3C's JLReq, article or book (book option) types; runs under LuaLaTeX, pLaTeX and upLaTeX.
 * Read from the research's Solution files and CTAN, not yet measured by the class probe.
 * It does not run in ZeroTeX-NG, which typesets with XeTeX: its engines are pLaTeX,
 * upLaTeX and LuaLaTeX, and XeLaTeX is not among them (Solution 0529, its Engine line).
 */
export default defineClass({
  id: 'class.jlreq',
  name: "jlreq",
  zerotex: 'no',
  preloads: [],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {"book": {"adds": ["counter:chapter"], "description": "the book type, with chapters"}},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: null,
  vocabulary: {},
  evidence: [{ kind: 'solution', file: 'Solution/0529-jlreq.md', lines: 'class' }, { kind: 'solution', file: 'Solution/0341-jlreq-japanese-book.md', lines: 'class' }, ctan('jlreq')],
});
