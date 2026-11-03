/**
 * tbl.row's presets: a row ends its cells with Flouest's row separator.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  row: {
    description: "A table row: its cells as they were emitted, then Flouest's row separator for the table to split on.",
    features: [],
    params: {},
    evidence: [solution('0053-zhanghai-zju-csse-undergraduate-design-l', '60')],
  },
} as const satisfies { readonly [name: string]: Preset };
