import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.cite-pkg',
    node: 'cite/cite',
    description:
      '\\cite{key}, several keys sorted and compressed by the cite package; \\citen for the bare number.',
    ctan: ['cite'],
    features: ['numeric-citations', 'sorted-compressed'],
    params: {
      command: { type: 'enum', values: ['cite', 'citen'], default: 'cite', description: 'the citation command' },
    },
    presets: PRESETS,
    requires: [
      'pkg:cite',
    ],
    zerotex: 'untested',
  }),
);
