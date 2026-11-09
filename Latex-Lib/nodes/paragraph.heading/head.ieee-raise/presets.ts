/**
 * head.ieee-raise's presets: the Computer Society journal sample (bare_adv.tex l.664-669).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  compsoc: {
    description:
      "IEEE Computer Society journals: the first section's heading raised a line and a half into the space under the title area (\\IEEEraisesectionheading{\\section{Introduction}\\label{…}}), every later heading the class's own compsoc look (sans-serif, arabic-numbered sections).",
    features: ['class-styled', 'numbered', 'sans-serif', 'hang-head'],
    params: {},
    evidence: [
      solution('0743-ieeetran-journal', '53'),
      solution('0743-ieeetran-journal', '84'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0743-ieeetran-journal/IEEEtran/IEEEtran.cls', line: '5521-5527' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
