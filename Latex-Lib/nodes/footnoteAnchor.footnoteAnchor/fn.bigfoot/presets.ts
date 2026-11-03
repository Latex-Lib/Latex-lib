/**
 * fn.bigfoot's presets, each from the templates that use it (`node seed.ts fn --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  tables: {
    description: 'Footnotes in tables and long tables kept and printed at the foot of the page (\\makesavenoteenv{tabular}, {longtable}); they link with hyperref.',
    features: ['box-safe', 'numbered'],
    params: { environments: 'tabular,longtable' },
    evidence: [solution('0134-maehr-uzh-ma-thesis', '72'), solution('0474-quizztex', '42')],
  },
  boxes: {
    description: 'Footnotes inside tcolorbox boxes kept and printed at the foot of the page (\\makesavenoteenv{tcolorbox}).',
    features: ['box-safe', 'numbered'],
    params: { environments: 'tcolorbox' },
    evidence: [solution('0263-beamertheme-spectrum', '45')],
  },
} as const satisfies { readonly [name: string]: Preset };
