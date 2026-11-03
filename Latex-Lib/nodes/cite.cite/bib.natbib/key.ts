import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.natbib',
    node: 'cite/cite',
    description:
      "natbib's citation commands: \\citep{key} in brackets, \\citet{key} in the sentence, \\citealp without brackets.",
    ctan: ['natbib'],
    features: ['author-year', 'numeric-citations'],
    params: {
      command: { type: 'enum', values: ['citep', 'citet', 'citealp', 'cite'], default: 'citep', description: 'the citation command' },
    },
    presets: PRESETS,
    requires: [
      'pkg:natbib',
    ],
    zerotex: 'untested',
  }),
);
