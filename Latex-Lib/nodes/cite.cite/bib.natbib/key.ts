import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.natbib',
    node: 'cite/cite',
    description:
      "natbib's citation commands: \\citep{key} in brackets, \\citet{key} in the sentence, \\citealp without brackets.",
    writes: '\\citep{…}',
    ctan: ['natbib'],
    features: ['author-year', 'numeric-citations'],
    params: {
      command: { type: 'enum', values: ['citep', 'citet', 'citealp', 'cite'], default: 'citep', description: 'the citation command' },
    },
    presets: PRESETS,
    requires: [
      'pkg:natbib',
    ],
    // b28 (batch 2, round 2, GitHub run b27-39fa711): the classes where its reference list never gets a .bbl.
    deny: [
      {
        class: 'class.achemso',
        reason: "its list is natbib's (\\nocite{*}, \\bibliographystyle{plainnat}, \\bibliography{\\jobname}); achemso ignores the style ('Class achemso Warning: \\bibliographystyle ignored', achemso.cls l.1427-1435) and puts its own achemso.bst in, and BibTeX makes no .bbl, as with bib.bibtex-bst (b27, P7): every branch in a cell that reached BibTeX failed at no-bbl",
        evidence: [
          { kind: 'source', file: 'achemso.cls (achemso 2025-09-22 v3.14, MiKTeX snapshot 9766)', line: '1427-1435' },
          { kind: 'compile', cell: "GitHub run b27-39fa711, achemso.A: 138 of the 214 not-denied bib.natbib@cite branches fail, 131 at no-bbl (document dfac2c765373107fa2bd4); the 76 that pass are all in cells that stopped at a TeX error before BibTeX ran (d775a277398404e8a2e85 logs 'No file main.bbl.' too); every achemso.A no-bbl branch holds this way" },
        ],
      },
    ],
    targetEngine: 'untested',
  }),
);
