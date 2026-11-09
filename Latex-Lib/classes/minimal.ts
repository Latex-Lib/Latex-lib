import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * The kernel's minimal class: a page size and \normalsize, nothing else; no sectioning, no title, no floats, no lists of contents, no bibliography.
 * Read from the research's Solution files and CTAN; measured by the class probe (minimal.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.minimal',
  name: "minimal",
  targetEngine: "yes",
  preloads: [],
  defines: [],
  options: {},
  forbids: {
    technical: [{ pkg: "enumitem", reason: "its load test stops: Undefined control sequence.", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/minimal.A.json' }] }, { pkg: "footnotehyper", reason: "its load test stops: Undefined control sequence.\\FNH@check@ ...andafter \\FNH@check@a \\@makefntext  {1.2!3?4,}\\FNH@@@ 1.2!3?4,...", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/minimal.A.json' }] }],
    policy: [],
  },
  layout: { columns: 1, textwidth: "469.75499pt", fontsize: "10pt" },
  vocabulary: {},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/minimal.A.json' }, ctan('latex-base')],
});
