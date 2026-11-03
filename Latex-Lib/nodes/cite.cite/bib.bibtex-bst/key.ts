import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.bibtex-bst',
    node: 'cite/cite',
    description:
      "The kernel's \\cite{key}, its label from the .bst style, tied to the word before it when asked.",
    ctan: ['latex-base'],
    features: ['numeric-citations'],
    params: {
      command: { type: 'enum', values: ['cite'], default: 'cite', description: 'the citation command' },
      tie: { type: 'boolean', default: false, description: 'a tie before the citation (~\\cite)' },
    },
    presets: PRESETS,
    zerotex: 'untested',
  }),
);
