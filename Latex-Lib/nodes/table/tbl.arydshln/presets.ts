/**
 * tbl.arydshln's presets, each from the templates that use it (`node seed.ts tbl --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  dashed: {
    description: 'Dashed rules between every row (\\hdashline) and between columns (;{2pt/3pt}), in a table float.',
    features: ['floating', 'captioned', 'dashed-rules'],
    params: {},
    evidence: [solution('0180-simple-thesis-dissertation', '71')],
  },
  'fine-dashes': {
    description: 'Solid rules above and below, fine dashed rules inside (\\dashlinedash 0.2pt, \\dashlinegap 1.5pt), no vertical rules.',
    features: ['floating', 'captioned', 'dashed-rules', 'horizontal-rules'],
    params: { vertical: false, outer: 'solid', dash: '0.2pt', gap: '1.5pt' },
    evidence: [solution('0861-tu-delft-light-assignment', '64'), solution('0914-oup-authoring-template', '65')],
  },
} as const satisfies { readonly [name: string]: Preset };
