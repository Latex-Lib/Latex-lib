import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * SIAM's article class: no \part (its counters start at section); amsmath, ntheorem and hyperref loaded; theorem, lemma, corollary, proposition, definition and proof predefined, and declaring them again errors.
 * Read from its requirement document and source; measured by the class probe (siamart.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.siamart',
  name: "siamart251216",
  zerotex: "yes",
  preloads: [{"pkg": "amsmath", "options": ["leqno"]}, {"pkg": "ntheorem", "options": ["amsmath", "thmmarks", "hyperref"]}, {"pkg": "xr-hyper"}, {"pkg": "ifpdf"}, {"pkg": "hyperref"}, {"pkg": "graphics"}, {"pkg": "graphicx"}, {"pkg": "breakurl"}, {"pkg": "xcolor"}, {"pkg": "hypcap", "options": ["all"]}, {"pkg": "algorithm"}, {"pkg": "float"}, {"pkg": "cleveref", "options": ["capitalize", "nameinlink"]}],
  defines: ["counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:theorem", "env:lemma", "env:corollary", "env:proposition", "env:definition", "env:proof", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [{ pkg: "amsthm", reason: "its load test stops: LaTeX Error: Command \\theoremstyle already defined. Or name \\end... illegal, see p.192 of the manual.", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/siamart.A.json' }] }, { pkg: "tocloft", reason: "its load test stops: LaTeX Error: Command \\l@section undefined.", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/siamart.A.json' }] }],
    policy: [],
    names: [{ name: "cmd:\\tableofcontents", reason: "siamart251216.cls defines \\tableofcontents, \\listoffigures and \\listoftables as empty and has no \\l@section to \\l@table (tocloft's load test: Command \\l@section undefined), so a contents way prints nothing, or reads the .toc through undefined line commands (etoc)", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/siamart251216.cls', line: '1637-1639' }, { kind: 'compile', cell: 'testing-pipeline/out/profiles/siamart.A.json (tocloft: Command \\l@section undefined)' }] }],
  },
  layout: { columns: 1, textwidth: "370.38374pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/siamart.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/SIAM_Siamart.md', line: '52' }, { kind: 'requirement', file: 'Template/template-requirement/SIAM_Siamart.md', line: '100' }, { kind: 'requirement', file: 'Template/template-requirement/SIAM_Siamart.md', line: '114' }, { kind: 'requirement', file: 'Template/template-requirement/SIAM_Siamart.md', line: '123' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/siamart251216.cls', line: '622-626 (no part counter), 1141' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/siamart251216.cls', line: '72, 333, 1296, 1302, 1313-1336, 1342, 1383, 1391, 1401' }],
});
