/**
 * abs.ieee-indextext's preset: IEEEtran's sample papers' title-area abstract and index terms.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SRC = 'Latex Related Research/Latex-lib-main/Source/0743-ieeetran-journal/IEEEtran';

export const PRESETS = {
  compsoc: {
    description:
      "IEEE Computer Society journal's abstract and index terms in the title area, under the title and authors at 92% of the text width (\\IEEEtitleabstractindextext before \\maketitle); in the conference and plain journal formats they print where the abstract stands (\\IEEEdisplaynontitleabstractindextext).",
    features: ['class-styled', 'full-width'],
    params: {},
    evidence: [
      solution('0743-ieeetran-journal', '51'),
      { kind: 'source', file: `${SRC}/bare_jrnl_compsoc.tex`, line: '469-495' },
      { kind: 'source', file: `${SRC}/IEEEtran.cls`, line: '4784, 4791-4797, 4821-4834, 5226-5249' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
