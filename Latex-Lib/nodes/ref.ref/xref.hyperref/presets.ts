/**
 * xref.hyperref's presets, each from the templates that use it (`node seed.ts xref --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  autoref: {
    description: "hyperref's \\autoref{label}, which names and links the target (Figure 2); \\hyperref[label]{name} when the node gives its own name.",
    features: ['named-refs', 'linked'],
    params: {},
    evidence: [solution('0021-elife', '59'), solution('0068-kaobook', '114')],
  },
  'title-ref': {
    description: "The target's title, linked (\\nameref{label}), as tables of terms and cross-references to headings use it.",
    features: ['named-refs', 'linked'],
    params: { command: 'nameref' },
    evidence: [solution('0068-kaobook', '114')],
  },
} as const satisfies { readonly [name: string]: Preset };
