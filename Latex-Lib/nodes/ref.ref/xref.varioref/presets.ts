/**
 * xref.varioref's presets, each from the templates that use it (`node seed.ts xref --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  vref: {
    description: "varioref's \\vref{label}: the number, with its page when the target is elsewhere (2 on the next page).",
    features: ['page-refs'],
    params: {},
    evidence: [solution('0068-kaobook', '112'), solution('0372-letgut', '55'), solution('0559-mentis', '71')],
  },
  'page-only': {
    description: 'Only where the target is, \\vpageref{label} (on the next page, on page 4).',
    features: ['page-refs'],
    params: { command: 'vpageref' },
    evidence: [solution('0068-kaobook', '112')],
  },
} as const satisfies { readonly [name: string]: Preset };
