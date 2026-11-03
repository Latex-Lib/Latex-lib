import { defineKey } from '../../../schema/key.ts';
import { NUMBERING, STATEMENT_DEFINES } from '../statement.ts';
import { PRESETS } from './presets.ts';

const solution = (file: string, lines: string) => ({ kind: 'solution', file: `Solution/${file}.md`, lines }) as const;
const profile = (setting: string) => ({ kind: 'compile', cell: `testing-pipeline/out/profiles/${setting}.json` }) as const;

export default defineKey({
  id: 'thm.mdframed',
  node: 'containerBlock/mathElement',
  description:
    "mdframed's \\newmdtheoremenv: a kernel-style statement in a frame drawn with TeX rules (the default frame method), a line colour, background and width of its own; the frame splits across pages.",
  features: ['framed', 'background', 'colored', 'left-rule', 'breakable', 'numbered', 'numbered-within', 'shared-counter'],
  params: {
    linecolor: { type: 'color', default: 'black', description: 'frame colour' },
    backgroundcolor: { type: 'color', default: 'white', description: 'background' },
    linewidth: { type: 'dimen', default: '0.4pt', description: 'frame width' },
    leftLineOnly: { type: 'boolean', default: false, description: 'a bar on the left, no other line' },
    extra: { type: 'tex', default: '', description: 'further mdframed keys (inner margins)' },
    ...NUMBERING,
  },
  presets: PRESETS,
  zerotex: 'untested',
  loads: [{ pkg: 'xcolor' }, { pkg: 'mdframed' }],
  defines: [...STATEMENT_DEFINES],
  claims: [],
  requires: ['counter:{numberWithin}'],
  classes: {
    deny: [
      {
        class: 'class.llncs',
        reason: 'llncs already defines theorem, lemma, corollary, definition, remark; and LNCS numbers statements consecutively, never within the section ("Theorem 1", not "1.1")',
        evidence: [profile('llncs.A'), { kind: 'requirement', file: 'Template/template-requirement/Springer_LNCS.md', line: '79' }],
        unless: { rename: 'yes', numberWithin: 'none' },
      },
      { class: 'class.acmart', reason: 'acmart already defines theorem, lemma, corollary, definition', evidence: [profile('acmart-manuscript.A')], unless: { rename: 'yes' } },
      { class: 'class.aa', reason: 'aa redefines \\newtheorem to take two more arguments (the title and body fonts), and \\newmdtheoremenv defines its environment with \\newtheorem, so what follows is misread and \\begin{mdframed} runs in the preamble', evidence: [{ kind: 'requirement', file: 'Template/template-requirement/AandA.md', line: '83' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/aa.cls', line: '1524-1593' }] },
      {
        class: 'class.mdpi',
        reason: 'mdpi.cls creates the counters theorem, lemma, corollary, proposition, property, example, remark, definition (and six more) and loads amsthm, whose \\newtheorem makes a numbered statement\'s counter with \\newcounter: "Command \\c@theorem already defined"',
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '230, 255-307' }],
        unless: { rename: 'yes' },
      },
    ],
  },
  packages: { conflicts: [] },
  context: { gives: { floats: false, boxDepth: 1 }, needs: { paragraph: true } },
  parents: {},
  fallback: { way: 'thm.kernel' },
  evidence: [solution('0315-valentjn-uni-stuttgart-phdthesis-templat', '101'), solution('0720-dev-aditya-course-notes-core', '50')],
  status: 'draft',
});
