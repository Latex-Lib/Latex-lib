/**
 * front.maketitle's presets, each from the templates that use it (`node seed.ts front --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  kernel: {
    description: "The kernel title block: \\title, \\author (several joined by \\and) and \\date just before \\maketitle, where the title stands; the kernel prints today's date when none is given.",
    features: ['centered'],
    params: {},
    evidence: [solution('0017-hit-report', '34'), solution('0019-stylish-article', '34'), solution('0006-gsemthesis', '58')],
  },
  'no-date': {
    description: 'The title block with no date line at all (\\date{}).',
    features: ['centered'],
    params: { date: 'none' },
    evidence: [solution('0015-malaysian-journal-of-mathematical-scienc', '37')],
  },
} as const satisfies { readonly [name: string]: Preset };
