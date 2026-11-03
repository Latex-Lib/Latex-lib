/**
 * math.kernel's presets, each from the templates that use it (`node seed.ts math --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  kernel: {
    description: 'Display maths without amsmath: \\[ … \\] for one unnumbered row, equation for a numbered one, eqnarray for several.',
    features: ['numbered', 'unnumbered', 'aligned', 'multiline'],
    params: {},
    evidence: [solution('0338-spie-optical-engineering-article', '39'), solution('0544-china2e', '37')],
  },
  'by-section': {
    description: 'Equations numbered within the section by the kernel\'s \\counterwithin{equation}{section}.',
    features: ['numbered', 'numbered-within', 'aligned', 'multiline'],
    params: { numberWithin: 'section' },
    evidence: [solution('0338-spie-optical-engineering-article', '39')],
  },
} as const satisfies { readonly [name: string]: Preset };
