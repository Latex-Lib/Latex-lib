/**
 * fig.rotating's presets, each from the templates that use it (`node seed.ts fig --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  sideways: {
    description: 'A figure turned on its side on a page of its own, \\begin{sidewaysfigure} … \\end{sidewaysfigure}, caption and all.',
    features: ['rotated', 'floating', 'captioned', 'scaled'],
    params: {},
    evidence: [solution('0040-agu', '60'), solution('0083-ntu-thesis', '73')],
  },
  'figures-right': {
    description: 'Sideways figures always turned the same way, so their tops face the right edge (the figuresright option).',
    features: ['rotated', 'floating', 'captioned', 'scaled'],
    params: { direction: 'figuresright' },
    evidence: [solution('0432-langsci', '55')],
  },
  'rotated-image': {
    description: 'Only the image turned, \\rotatebox{90}{\\includegraphics…}, in an ordinary figure float with an upright caption.',
    features: ['rotated', 'floating', 'centered', 'captioned', 'scaled'],
    params: { turn: 'image', angle: 90 },
    evidence: [solution('0072-beamertheme-gotham', '49'), solution('0063-slidenotes', '43')],
  },
} as const satisfies { readonly [name: string]: Preset };
