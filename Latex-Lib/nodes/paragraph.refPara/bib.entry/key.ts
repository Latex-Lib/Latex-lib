import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.entry',
    node: 'paragraph/refPara',
    description:
      "One bibliography entry as BibTeX source; the reference list's way writes it to \\jobname.bib or reads it into a \\bibitem.",
    ctan: ['bibtex'],
    features: [],
    presets: PRESETS,
    zerotex: 'untested',
  }),
);
