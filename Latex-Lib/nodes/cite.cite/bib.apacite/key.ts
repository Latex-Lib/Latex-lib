import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.apacite',
    node: 'cite/cite',
    description:
      "apacite's citation commands: \\cite{key} (Knuth, 1984), \\citeA{key} Knuth (1984), \\citeNP without parentheses.",
    ctan: ['apacite'],
    features: ['author-year'],
    params: {
      command: { type: 'enum', values: ['cite', 'citeA', 'citeNP'], default: 'cite', description: 'the citation command' },
    },
    presets: PRESETS,
    requires: [
      'pkg:apacite',
    ],
    zerotex: 'untested',
  }),
);
