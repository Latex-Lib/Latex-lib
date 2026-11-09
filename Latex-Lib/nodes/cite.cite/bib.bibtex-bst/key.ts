import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.bibtex-bst',
    node: 'cite/cite',
    description:
      "The kernel's \\cite{key}, its label from the .bst style, tied to the word before it when asked.",
    // The kernel's \cite as bib.bibtex-bst, bib.cite-pkg and bib.thebibliography print it: the same LaTeX; the list's way (and loads) tells them apart.
    writes: '\\cite{…}',
    ctan: ['latex-base'],
    features: ['numeric-citations'],
    params: {
      command: { type: 'enum', values: ['cite'], default: 'cite', description: 'the citation command' },
      tie: { type: 'boolean', default: false, description: 'a tie before the citation (~\\cite)' },
    },
    presets: PRESETS,
    targetEngine: 'untested',
  }),
);
