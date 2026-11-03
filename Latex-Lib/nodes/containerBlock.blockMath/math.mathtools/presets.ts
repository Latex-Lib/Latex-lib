/**
 * math.mathtools's presets, each from the templates that use it (`node seed.ts math --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  auto: {
    description: "mathtools over amsmath, the same displays as amsmath's (equation, align, gather), with mathtools' fixes and extensions loaded.",
    features: ['numbered', 'unnumbered', 'aligned', 'multiline'],
    params: {},
    evidence: [solution('0580-federicobruzzone-scribe', '54'), solution('0639-scientific-style-book-template', '35'), solution('0030-seu-ml-assign', '39')],
  },
  'only-referenced': {
    description: 'Only the equations a \\eqref points to get a number (\\mathtoolsset{showonlyrefs}).',
    features: ['numbered', 'aligned', 'multiline'],
    params: { showOnlyRefs: true },
    evidence: [manual('mathtools', 'showonlyrefs: numbering only referenced equations')],
  },
  'by-section': {
    description: 'Equations numbered within the section (\\numberwithin{equation}{section}).',
    features: ['numbered', 'numbered-within', 'aligned', 'multiline'],
    params: { numberWithin: 'section' },
    evidence: [solution('0164-coursework-term-paper', '65')],
  },
} as const satisfies { readonly [name: string]: Preset };
