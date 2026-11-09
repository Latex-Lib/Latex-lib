/**
 * front.agu's presets, from AGU's journal template (agujournaltemplate.tex, April 16 2019) and its Solution file.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  agu: {
    description:
      "AGU's title block typeset where it stands, with no \\maketitle: \\title, one \\authors line with each author's affiliation numbers (\\affil{1,2}) and 'and' before the last, one \\affiliation{n}{…} per affiliation, \\correspondingauthor{name}{email} and the Key Points list.",
    features: ['class-styled', 'centered'],
    params: {},
    evidence: [
      solution('0040-agu', '25, 45, 47-48'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0040-agu/April 16 2019/agujournaltemplate.tex', line: '81 (\\title), 95-102 (\\authors with \\affil and \\thanks), 105-110 (\\affiliation), 114-123 (\\correspondingauthor), 125-142 (keypoints)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
