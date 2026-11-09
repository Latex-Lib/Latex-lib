/**
 * ack.bmhead's presets: Springer Nature's back-matter head for the acknowledgements.
 */
import type { Preset } from '../../../schema/params.ts';

const REQUIREMENT = 'Template/template-requirement/Springer_Nature_SN_Jnl.md';

export const PRESETS = {
  acknowledgements: {
    description:
      "Springer Nature's acknowledgements in the back matter: \\backmatter (once), then \\bmhead{Acknowledgements}, an unnumbered bold run-in head, and the text.",
    features: ['class-styled', 'unnumbered', 'run-in-head', 'bold-head'],
    params: {},
    evidence: [
      { kind: 'requirement', file: REQUIREMENT, line: '55' },
      { kind: 'requirement', file: REQUIREMENT, line: '111' },
      { kind: 'requirement', file: REQUIREMENT, line: '155' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
