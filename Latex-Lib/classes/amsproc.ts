import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * The AMS proceedings class: amsart's family (amsmath and amsfonts loaded, amsthm built in), no chapter, the abstract before \maketitle.
 * Read from the research's Solution files and CTAN; measured by the class probe (amsproc.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.amsproc',
  name: "amsproc",
  targetEngine: "yes",
  preloads: [{"pkg": "amsmath"}, {"pkg": "amsthm"}, {"pkg": "amsfonts"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:proof", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\address", "cmd:\\email", "cmd:\\subjclass", "cmd:\\keywords", "cmd:\\copyrightinfo"],
  heldByMaketitle: [{ resource: 'env:abstract', reason: "amsproc's abstract environment stores its text for \\maketitle: written with no \\maketitle after it, the abstract is on no page", evidence: [{ kind: 'compile', reproducer: "\\documentclass{amsproc} \\begin{document} \\begin{abstract}Abstract text.\\label{absmark}\\end{abstract} \\section{One}Body. \\end{document}: absmark is not in main.aux; with \\title, \\author and \\maketitle after the abstract it is (ZeroTeX-NG, the studio's measurement, 2026-10-31; found as Lab Report 2's missing abstract under revtex4-2)" }] }],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "360.0pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/amsproc.A.json' }, { kind: 'solution', file: 'Solution/0260-amsproc.md', lines: '30' }, { kind: 'solution', file: 'Solution/0260-amsproc.md', lines: '49-51' }, ctan('amscls')],
});
