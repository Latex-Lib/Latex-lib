/**
 * front.apa7's presets, from the apa7 class example (Latex Related Research/Latex-Template-Examples/class.apa7/main.tex).
 */
import type { Preset } from '../../../schema/params.ts';

const EXAMPLE = { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.apa7/main.tex', line: '63-91' } as const;

export const PRESETS = {
  apa7: {
    description:
      "apa7's title page: \\title, the running head (\\shorttitle), the authors with their affiliation numbers (\\authorsnames[1,{1,2}]{…}) and the affiliations (\\authorsaffiliations), an author note with each author's ORCID link (\\addORCIDlink), the note's text and the correspondence line with its email, and the keywords; no date, as APA prints none.",
    features: ['class-styled', 'title-page'],
    params: {},
    evidence: [EXAMPLE],
  },
} as const satisfies { readonly [name: string]: Preset };
