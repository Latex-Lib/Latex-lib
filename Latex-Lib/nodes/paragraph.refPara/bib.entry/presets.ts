/**
 * bib.entry's presets: one entry as BibTeX source.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  entry: {
    description: "One bibliography entry as BibTeX source; the reference list's way writes it to \\jobname.bib or reads it into a \\bibitem.",
    features: [],
    params: {},
    evidence: [solution('0642-elegantnote', '41')],
  },
} as const satisfies { readonly [name: string]: Preset };
