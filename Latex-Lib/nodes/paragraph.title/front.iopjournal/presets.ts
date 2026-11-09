/**
 * front.iopjournal's presets, from IOP Publishing's journal template (iopjournal-template.tex) and its Solution file.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  iopjournal: {
    description:
      "IOP's title block typeset where it stands, with no \\maketitle: \\articletype, \\title, one \\author line with affiliation numbers, the corresponding author's star and ORCID icons, one \\affil per affiliation and the correspondence note, \\email and \\keywords.",
    features: ['class-styled'],
    params: {},
    evidence: [
      solution('0035-iop-journals', '23, 38-43'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0035-iop-journals/iopjournal-template.tex', line: '10 (\\articletype), 12 (\\title), 14 (\\author with $^n$ and \\orcid), 16-20 (\\affil), 22 (\\email), 24 (\\keywords)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
