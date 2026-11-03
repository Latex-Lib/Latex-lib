import { defineKey } from '../../../schema/key.ts';
import { NUMBERING, STATEMENT_DEFINES } from '../statement.ts';
import { PRESETS } from './presets.ts';

const solution = (file: string, lines: string) => ({ kind: 'solution', file: `Solution/${file}.md`, lines }) as const;
const profile = (setting: string) => ({ kind: 'compile', cell: `testing-pipeline/out/profiles/${setting}.json` }) as const;

export default defineKey({
  id: 'thm.ntheorem',
  node: 'containerBlock/mathElement',
  description:
    'ntheorem: \\theoremstyle (plain, break, change, margin), \\theoremheaderfont, \\theorembodyfont, \\theoremseparator and an end mark (\\theoremsymbol, with thmmarks) set before each \\newtheorem. Unboxed statements; loaded with amsmath and thmmarks, as every template using it does.',
  features: ['numbered', 'numbered-within', 'shared-counter', 'bold-head', 'italic-body', 'upright-body', 'break-after-head', 'qed-mark'],
  params: {
    style: { type: 'enum', values: ['plain', 'break', 'change', 'margin'], default: 'plain', description: "ntheorem's head layout" },
    headFont: { type: 'tex', default: '\\normalfont\\bfseries', description: 'head font' },
    bodyFont: { type: 'tex', default: '\\itshape', description: 'body font' },
    separator: { type: 'string', default: '', description: 'what follows the head' },
    symbol: { type: 'tex', default: '', description: "end-of-statement mark; '' for none" },
    ...NUMBERING,
  },
  presets: PRESETS,
  zerotex: 'untested',
  loads: [{ pkg: 'ntheorem', options: ['amsmath', 'thmmarks'] }],
  defines: [...STATEMENT_DEFINES],
  claims: ['theorem-engine'],
  requires: ['counter:{numberWithin}'],
  classes: {
    deny: [
      {
        class: 'class.llncs',
        reason: 'llncs already defines theorem, lemma, corollary, definition, remark; and LNCS numbers statements consecutively, never within the section ("Theorem 1", not "1.1")',
        evidence: [profile('llncs.A'), { kind: 'requirement', file: 'Template/template-requirement/Springer_LNCS.md', line: '79' }],
        unless: { rename: 'yes', numberWithin: 'none' },
      },
    ],
  },
  packages: {
    conflicts: [
      { pkg: 'amsthm', reason: 'two theorem engines: ntheorem cannot be loaded with amsthm, which amsart and acmart load themselves', evidence: [] },
      { way: 'thm.amsthm', reason: 'two theorem engines', evidence: [] },
    ],
  },
  context: { gives: {}, needs: { paragraph: true } },
  parents: {},
  fallback: { way: 'thm.kernel' },
  evidence: [solution('0421-albertopessia-latex-book-template', '51'), solution('0832-cai4cai-xclthesistemplate', '65')],
  status: 'draft',
});
