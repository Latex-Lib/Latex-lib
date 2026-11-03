/**
 * math.kernel's (inlineMath) presets, each from the templates that use it (`node seed.ts math --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  dollar: {
    description: 'Inline maths between dollar signs, $…$, with a \\label after it when the node has one.',
    features: [],
    params: {},
    evidence: [solution('0008-envlab', '47'), solution('0210-michaelplews-dnd-character-sheets', '50')],
  },
  paren: {
    description: "Inline maths in the kernel's \\( … \\) delimiters.",
    features: [],
    params: { delimiters: 'paren' },
    evidence: [solution('0096-c-d-p-bundle', '55')],
  },
} as const satisfies { readonly [name: string]: Preset };
