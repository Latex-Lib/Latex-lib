import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.biblatex-biber',
    node: 'cite/cite',
    description:
      "biblatex's citation commands: \\autocite{key} as the style formats it, \\parencite, \\textcite, \\footcite, \\supercite.",
    ctan: ['biblatex'],
    features: ['numeric-citations', 'author-year'],
    params: {
      command: { type: 'enum', values: ['autocite', 'parencite', 'textcite', 'footcite', 'supercite', 'cite'], default: 'autocite', description: 'the citation command' },
    },
    presets: PRESETS,
    requires: [
      'pkg:biblatex',
    ],
    zerotex: 'untested',
  }),
);
