import { defineClass } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * LaTeX's standard letter class: letter environments, \opening and \closing; no sectioning, no abstract, no floats, no \maketitle, no bibliography.
 * Read from its requirement document and its source; measured by the class probe
 * (letter.A: loads, preloads, names it already defines, refused packages, layout).
 */
export default defineClass({
  id: 'class.letter',
  name: "letter",
  zerotex: "yes",
  preloads: [],
  defines: [],
  options: {},
  forbids: {
    technical: [],
    policy: [],
  },
  layout: { columns: 1, textwidth: "345.0pt", fontsize: "10pt" },
  vocabulary: {"\\opening": "the salutation", "\\closing": "the closing line", "\\signature": "the sender's name"},
  evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/letter.A.json' }, { kind: 'requirement', file: 'Template/template-requirement/Letter.md', line: '45' }, { kind: 'requirement', file: 'Template/template-requirement/Letter.md', line: '56' }, { kind: 'requirement', file: 'Template/template-requirement/Letter.md', line: '81' }, { kind: 'requirement', file: 'Template/template-requirement/Letter.md', line: '89' }, { kind: 'requirement', file: 'Template/template-requirement/Letter.md', line: '112' }, { kind: 'requirement', file: 'Template/template-requirement/Letter.md', line: '120' }, { kind: 'requirement', file: 'Template/template-requirement/Letter.md', line: '139' }],
});
