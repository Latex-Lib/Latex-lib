import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'cols.paracol',
    node: 'containerBlock/columns',
    description:
      'paracol: parallel columns side by side, \\begin{paracol}{2} … \\switchcolumn … \\end{paracol}, the blocks (split at blank lines outside every environment and group) shared out across the columns in order; \\columnratio for unequal widths, \\columnseprule and \\colseprulecolor for a rule, all set in the preamble. 14 templates.',
    ctan: ['paracol'],
    features: ['parallel-columns', 'unequal-widths', 'column-rule'],
    params: {
      ratio: { type: 'string', default: '', description: "the first column's share of the width, or several (\\columnratio{0.65}); ''" },
      rule: { type: 'dimen', default: '', description: "a rule between the columns (\\columnseprule); ''" },
      ruleColor: { type: 'color', default: '', description: "the rule's colour (\\colseprulecolor); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'paracol' },
      { pkg: 'xcolor' },
    ],
    gives: { columns: true },
    oneColumn: {
      reason: 'paracol refuses a two-column page ("Environment paracol cannot work with ordinary two-column"), under \\twocolumn or a two-column class',
      // Its solo branch under setup B (twocolumn): article.B, acmart-manuscript.B, amsart.B, llncs.B, memoir.B and scrartcl.B all stop there.
      evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/results/c8aa1715076e (solo, article.B)' }, { kind: 'compile', cell: 'testing-pipeline/out/results/c2c1a0b87b62 (solo, acmart-manuscript.B)' }],
    },
    zerotex: 'untested',
  }),
);
