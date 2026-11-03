/**
 * list.item's presets: the item line Flouest's list ways read.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  item: {
    description: "A list item as the line Flouest's list ways read, \\<level>[label] text, the level from the item's indent; the list prints it as \\item[label] text.",
    features: [],
    params: {},
    evidence: [solution('0025-mpdinbrief', '54')],
  },
} as const satisfies { readonly [name: string]: Preset };
