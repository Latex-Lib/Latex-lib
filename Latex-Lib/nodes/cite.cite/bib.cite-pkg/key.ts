import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.cite-pkg',
    node: 'cite/cite',
    description:
      '\\cite{key}, several keys sorted and compressed by the cite package; \\citen for the bare number.',
    // The kernel's \cite as bib.bibtex-bst, bib.cite-pkg and bib.thebibliography print it: the same LaTeX; the list's way (and loads) tells them apart.
    writes: '\\cite{…}',
    ctan: ['cite'],
    features: ['numeric-citations', 'sorted-compressed'],
    params: {
      command: { type: 'enum', values: ['cite', 'citen'], default: 'cite', description: 'the citation command' },
    },
    presets: PRESETS,
    requires: [
      'pkg:cite',
    ],
    targetEngine: 'untested',
  }),
);
