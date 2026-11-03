import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * The AMS book class: chapters, amsmath and amsthm built in, run-in subsection heads, an abstract on the title verso.
 * Read from its requirement document and its source; measured by the class probe
 * (amsbook.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.amsbook',
  name: "amsbook",
  zerotex: "yes",
  preloads: [{"pkg": "amsmath"}, {"pkg": "amsthm"}],
  defines: ["counter:chapter", "counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:proof", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix"],
  options: {},
  forbids: {
    technical: [],
    policy: [{ pkg: "amsmath", reason: "AMS: amsmath is built into the class; \"do not load\" it", evidence: [{ kind: 'requirement', file: 'Template/template-requirement/AMS_Amsbook.md', line: '72' }] }, { pkg: "amsthm", reason: "AMS: amsthm is built into the class; \"do not load\" it", evidence: [{ kind: 'requirement', file: 'Template/template-requirement/AMS_Amsbook.md', line: '72' }] }],
  },
  layout: { columns: 1, textwidth: "360.0pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/amsbook.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/AMS_Amsbook.md', line: '56' }, { kind: 'requirement', file: 'Template/template-requirement/AMS_Amsbook.md', line: '66' }, { kind: 'requirement', file: 'Template/template-requirement/AMS_Amsbook.md', line: '72' }, { kind: 'requirement', file: 'Template/template-requirement/AMS_Amsbook.md', line: '81' }],
});
