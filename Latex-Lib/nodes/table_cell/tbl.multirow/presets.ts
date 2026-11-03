/**
 * tbl.multirow's presets, each from the templates that use it (`node seed.ts tbl --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'column-width': {
    description: "A row span set to its column's width (\\multirow{n}{=}{…}), so long text wraps; \\cellcolor for a background.",
    features: ['cell-spans', 'background'],
    params: {},
    evidence: [solution('0053-zhanghai-zju-csse-undergraduate-design-l', '60')],
  },
  natural: {
    description: 'A row span at its natural width (\\multirow{n}{*}{…}), one line, vertically centred.',
    features: ['cell-spans', 'background'],
    params: { width: '*' },
    evidence: [solution('0042-jankapunkt-master-thesis', '67')],
  },
} as const satisfies { readonly [name: string]: Preset };
