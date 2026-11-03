import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.thebibliography',
    node: 'cite/cite',
    description:
      "The kernel's \\cite{key} against the hand-written list.",
    ctan: ['latex-base'],
    features: ['numeric-citations', 'hand-written'],
    params: {
      command: { type: 'enum', values: ['cite'], default: 'cite', description: 'the citation command' },
    },
    presets: PRESETS,
    zerotex: 'untested',
  }),
);
