import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'cols.multicol',
    node: 'containerBlock/columns',
    description:
      'multicol: balanced columns in the text, \\begin{multicols}{2} … \\end{multicols} (multicols* unbalanced), the gap from the node in \\columnsep; \\columnseprule and \\columnseprulecolor for a rule, \\raggedcolumns for ragged bottoms. 131 templates.',
    writes: '{\\setlength{\\columnsep}{…} \\begin{multicols}{…} … \\end{multicols}}',
    ctan: ['multicol'],
    features: ['balanced-columns', 'column-rule'],
    params: {
      balance: { type: 'boolean', default: true, description: 'balanced at the end (multicols), or filled in turn (multicols*)' },
      ragged: { type: 'boolean', default: false, description: 'ragged column bottoms (\\raggedcolumns)' },
      rule: { type: 'dimen', default: '', description: "a rule between the columns (\\columnseprule); ''" },
      ruleColor: { type: 'color', default: '', description: "the rule's colour (\\columnseprulecolor); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'multicol' },
      { pkg: 'xcolor' },
    ],
    // multicol drops floats in its columns: "Package multicol Warning: Floats and marginpars not allowed inside `multicols' environment!"
    // (297c68343f, article.A run); library tables directly below it lose their content in 207 of 240 branches (250 of 2,430 elsewhere).
    gives: { floats: false, columns: true },
    targetEngine: 'yes',
  }),
);
