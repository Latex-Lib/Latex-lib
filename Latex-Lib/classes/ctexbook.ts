import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * ctex's book: the standard book with Chinese typesetting; no abstract.
 * Read from its requirement document and source; measured by the class probe (ctexbook.A: loads, preloads, names it already defines, refused packages, layout).
 * ctex.sty is not a preload: the class disables it (\ctex_disable_package:n, i.e. \disable@package@load), so a later \usepackage{ctex} is ignored with a ctexhook warning and \ver@ctex.sty stays undefined.
 */
export default defineClass({
  id: 'class.ctexbook',
  name: "ctexbook",
  base: 'class.book',
  zerotex: "yes",
  preloads: [{"pkg": "fontspec"}],
  defines: ["counter:chapter", "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "345.0pt", fontsize: "10.53937pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/ctexbook.A.json' }, ctan('ctex')],
});
