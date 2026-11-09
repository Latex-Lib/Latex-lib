import { defineKey } from '../../../schema/key.ts';
import { NUMBERING, STATEMENT_DEFINES } from '../statement.ts';
import { PRESETS } from './presets.ts';

const solution = (file: string, lines: string) => ({ kind: 'solution', file: `Solution/${file}.md`, lines }) as const;
const profile = (setting: string) => ({ kind: 'compile', cell: `testing-pipeline/out/profiles/${setting}.json` }) as const;

export default defineKey({
  id: 'thm.thmtools',
  node: 'containerBlock/mathElement',
  description:
    'thmtools over amsthm: a key-value style (\\declaretheoremstyle: spaces, fonts, punctuation, the QED mark) and key-value environments (\\declaretheorem: name, numberwithin, sibling). Unboxed statements, as amsthm prints them.',
  writes: '\\begin{theorem}[{…}] … \\end{theorem}; \\declaretheoremstyle[…]{libthm} \\declaretheorem[style=libthm, name=Theorem, numberwithin=section]{theorem}',
  features: ['numbered', 'numbered-within', 'shared-counter', 'bold-head', 'italic-body', 'upright-body', 'qed-mark', 'custom-head'],
  params: {
    spaceAbove: { type: 'dimen', default: '\\topsep', description: 'space above' },
    spaceBelow: { type: 'dimen', default: '\\topsep', description: 'space below' },
    headFont: { type: 'tex', default: '\\bfseries', description: 'head font' },
    bodyFont: { type: 'tex', default: '\\itshape', description: 'body font of theorem-like kinds' },
    uprightKinds: { type: 'boolean', default: true, description: 'definitions, examples and remarks get an upright body' },
    headPunct: { type: 'string', default: '.', description: 'punctuation after the head' },
    postHeadSpace: { type: 'string', default: '.5em', description: 'space after the head' },
    qed: { type: 'tex', default: '', description: "an end mark for every statement; '' for none" },
    ...NUMBERING,
  },
  presets: PRESETS,
  targetEngine: 'untested',
  // The beauty preset's qed is coloured, so the handler prints xcolor for it: a document where no other way loads xcolor stops at
  // \color (copy batch-3b revtex4-2-aps.A, log f7144c401546: no xcolor.sty, 'Undefined control sequence' at \color in
  // \thmt@*@postheadhook and \thmt@*@prefoothook, all in document d80e0356e8ac5b1c6bd38). `when` matches exact values, so it names the beauty value.
  loads: [{ pkg: 'amsthm' }, { pkg: 'thmtools' }, { pkg: 'xcolor', when: { qed: '\\color{cyan!40!black}$\\blacksquare$' } }],
  defines: [...STATEMENT_DEFINES],
  claims: ['theorem-engine'],
  requires: ['counter:{numberWithin}'],
  classes: {
    deny: [
      {
        class: 'class.llncs',
        reason: 'thmtools loads amsthm, which llncs refuses ("Command \\proof already defined")',
        evidence: [profile('llncs.A')],
      },
      {
        class: 'class.acmart',
        reason: 'acmart already defines theorem, lemma, corollary, definition',
        evidence: [profile('acmart-manuscript.A')],
        unless: { rename: 'yes' },
      },
      {
        class: 'class.mdpi',
        reason: 'mdpi.cls creates the counters theorem, lemma, corollary, proposition, property, example, remark, definition (and six more) and loads amsthm, whose \\newtheorem makes a numbered statement\'s counter with \\newcounter: "Command \\c@theorem already defined"',
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '230, 255-307' }],
        unless: { rename: 'yes' },
      },
    ],
  },
  packages: { conflicts: [
      {
        pkg: 'ntheorem',
        reason: 'two theorem engines: amsthm cannot go with ntheorem, which siamart loads itself',
        evidence: [{ kind: 'requirement', file: 'Template/template-requirement/SIAM_Siamart.md', line: '52' }],
      },{ way: 'thm.ntheorem', reason: 'two theorem engines', evidence: [] }] },
  context: { gives: {}, needs: { paragraph: true } },
  parents: {},
  fallback: { way: 'thm.kernel' },
  evidence: [solution('0068-kaobook', '107'), solution('0164-coursework-term-paper', '57')],
  status: 'draft',
});
