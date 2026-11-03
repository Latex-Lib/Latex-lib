import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * Astronomy & Astrophysics' class: \abstract{} as a command, a dozen theorem environments predefined, \newtheorem with two more arguments, no chapter, and \part and \subparagraph errors.
 * Read from its requirement document and source; measured by the class probe (aa.A: loads, preloads, names it already defines, refused packages, layout).
 * enumerate is loaded by the class (aa.cls l.211) but not listed (b22, owner item O-ENUM), as lipics leaves out its own: enumitem's package facts
 * conflict with it, which refused every enumitem branch here (list.enumitem and General's enumitem lists: 0 fit in aa.A), though that conflict's
 * failure needs enumerate to load after enumitem, and a class's own load always comes first. GitHub run 41584963423 shows that order working
 * under lipics, which loads enumerate the same way: 1,292 of 2,649 list.enumitem branches pass in lipics.A, and no log there has
 * '\enit@after' (the conflict's only error in the run is mdpi.A's, where the class loads enumitem and a way loads enumerate after it).
 */
export default defineClass({
  id: 'class.aa',
  name: "aa",
  zerotex: "yes",
  preloads: [{"pkg": "amsmath", "options": ["tbtags", "fleqn"]}, {"pkg": "amssymb"}, {"pkg": "setspace"}, {"pkg": "graphicx"}, {"pkg": "calc"}, {"pkg": "etex"}, {"pkg": "fontenc", "options": ["T1"]}, {"pkg": "inputenc", "options": ["utf8"]}, {"pkg": "geometry"}, {"pkg": "fancyhdr"}, {"pkg": "cuted"}, {"pkg": "url"}, {"pkg": "longtable"}, {"pkg": "natbib", "options": ["nonamebreak"]}, {"pkg": "xspace"}, {"pkg": "babel", "options": ["english"]}, {"pkg": "rotating", "options": ["figuresright"]}, {"pkg": "linenoaa", "options": ["modulo", "mathlines", "switch", "running", "columnwise", "pagewise"]}, {"pkg": "lineno"}, {"pkg": "grffile"}],
  defines: ["counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "cmd:\\abstract", "env:proof", "env:theorem", "env:corollary", "env:definition", "env:example", "env:exercise", "env:lemma", "env:note", "env:problem", "env:proposition", "env:question", "env:remark", "env:solution", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\sidecaption"],
  // \sidecaption: aa's side captions (aa.cls l.1656), read from the source in batch 1 round 2; sidenotes declares it again (its key).
  options: {},
  forbids: {
    technical: [{ pkg: "amsthm", reason: "its load test stops: LaTeX Error: Command \\proof already defined. Or name \\end... illegal, see p.192 of the manual.", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/aa.A.json' }] }],
    policy: [],
  },
  layout: { columns: 2, textwidth: "523.5307pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/aa.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/AandA.md', line: '63' }, { kind: 'requirement', file: 'Template/template-requirement/AandA.md', line: '82' }, { kind: 'requirement', file: 'Template/template-requirement/AandA.md', line: '83' }, { kind: 'requirement', file: 'Template/template-requirement/AandA.md', line: '84' }, { kind: 'requirement', file: 'Template/template-requirement/AandA.md', line: '113' }, { kind: 'requirement', file: 'Template/template-requirement/AandA.md', line: '132' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/aa.cls', line: '108-110, 142, 154, 158, 205, 234, 297, 1755, 2149 (preload options; lineno through linenoaa.sty l.34)' }],
});
