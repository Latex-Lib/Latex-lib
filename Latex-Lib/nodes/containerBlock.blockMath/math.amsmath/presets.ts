/**
 * math.amsmath's presets, each from the templates that use it (`node seed.ts math --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  auto: {
    description: "amsmath's displays as Flouest chooses them: \\[ … \\] (equation* when it holds a split) or equation for one row, align when rows align on &, else gather; starred when unnumbered.",
    features: ['numbered', 'unnumbered', 'aligned', 'multiline'],
    params: {},
    evidence: [solution('0107-elsarticle', '50'), solution('0021-elife', '49'), solution('0045-sjtutex-laboratory-report', '33')],
  },
  'by-section': {
    description: 'Equations numbered within the section, (2.1) (\\numberwithin{equation}{section}).',
    features: ['numbered', 'numbered-within', 'aligned', 'multiline'],
    params: { numberWithin: 'section' },
    evidence: [solution('0030-seu-ml-assign', '35'), solution('0267-ou-tma', '45')],
  },
  breakable: {
    description: 'Multi-row displays allowed to break across pages (\\allowdisplaybreaks).',
    features: ['numbered', 'aligned', 'multiline', 'breakable'],
    params: { allowBreaks: 4 },
    evidence: [solution('0003-ucsmonograph', '71'), solution('0020-koma-script', '74'), solution('0088-tinoryj-uestc-thesis-latex-template', '71')],
  },
  'flush-left': {
    description: 'Displays set flush left at an indent instead of centred (the fleqn option).',
    features: ['numbered', 'aligned', 'multiline'],
    params: { flushLeft: true },
    evidence: [solution('0077-gi-ev-lni', '58'), solution('0012-basic-academic-journal-article', '59')],
  },
} as const satisfies { readonly [name: string]: Preset };
