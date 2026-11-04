import { defineKey } from '../../../schema/key.ts';
import { NUMBERING, STATEMENT_DEFINES } from '../statement.ts';
import { PRESETS } from './presets.ts';

const solution = (file: string, lines: string) => ({ kind: 'solution', file: `Solution/${file}.md`, lines }) as const;
const profile = (setting: string) => ({ kind: 'compile', cell: `testing-pipeline/out/profiles/${setting}.json` }) as const;

export default defineKey({
  id: 'thm.kernel',
  node: 'containerBlock/mathElement',
  description:
    "LaTeX's own \\newtheorem, with no package: bold head, italic body, an optional note in parentheses (set after the label as text of the paragraph, so a long note wraps: b26 MB-LO5), no styles and no proof environment. A list-based environment, so it sits wherever a list can.",
  features: ['numbered', 'numbered-within', 'shared-counter', 'bold-head', 'italic-body'],
  params: { ...NUMBERING },
  presets: PRESETS,
  zerotex: 'yes',
  loads: [],
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
      {
        class: 'class.acmart',
        reason: 'acmart already defines theorem, lemma, corollary, definition',
        evidence: [profile('acmart-manuscript.A'), { kind: 'requirement', file: 'Template/template-requirement/ACM.md', line: '85' }],
        unless: { rename: 'yes' },
      },
      {
        class: 'class.aa',
        reason: 'aa redefines \\newtheorem to take two more arguments (the title and body fonts), so the standard form misreads what follows',
        evidence: [{ kind: 'requirement', file: 'Template/template-requirement/AandA.md', line: '83' }],
      },
      {
        class: 'class.mdpi',
        reason: 'mdpi.cls creates the counters theorem, lemma, corollary, proposition, property, example, remark, definition (and six more) and loads amsthm, whose \\newtheorem makes a numbered statement\'s counter with \\newcounter: "Command \\c@theorem already defined"',
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '230, 255-307' }],
        unless: { rename: 'yes' },
      },
    ],
  },
  packages: { conflicts: [] },
  context: { gives: {}, needs: { paragraph: true } },
  parents: {},
  evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Article.md', line: '98' }, solution('0771-smf-mathematics-article', '37')],
  status: 'draft',
});
