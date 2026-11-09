import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.gbt7714',
    node: 'cite/cite',
    description:
      "A citation beside the GB/T 7714 reference list under the ctex classes: \\cite{key} (a superscript number in gbt7714's default mode), or natbib's \\citep{key} and \\citet{key}, which gbt7714 loads.",
    writes: '\\cite{…}',
    ctan: ['gbt7714', 'natbib'],
    features: ['numeric-citations', 'superscript', 'author-year'],
    params: {
      command: { type: 'enum', values: ['cite', 'citep', 'citet'], default: 'cite', description: 'the citation command' },
    },
    presets: PRESETS,
    requires: [
      'pkg:gbt7714',
    ],
    only: ['class.ctexart', 'class.ctexrep', 'class.ctexbook'],
    targetEngine: 'yes',
  }),
);
