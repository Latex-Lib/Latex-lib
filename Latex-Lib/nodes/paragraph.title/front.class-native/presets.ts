/**
 * front.class-native's presets, each from the templates that use it (`node seed.ts front --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  class: {
    description: "The class's own title block: \\title, \\author, \\date and \\maketitle laid out as the class restyles \\maketitle (acmart, llncs, IEEEtran).",
    features: ['class-styled'],
    params: {},
    evidence: [solution('0035-iop-journals', '44'), solution('0097-wk910930-paper-template', '69')],
  },
  'one-author-each': {
    description: "The class's own title block with one \\author per author, as revtex4-2 takes them, each with its own affiliation.",
    writes: '\\title{…} \\author{…} \\author{…} \\date{…} \\maketitle',
    features: ['class-styled'],
    params: { authors: 'separate' },
    evidence: [solution('0874-reed-college-physics-200-report', '34'), solution('0517-revquantum', '34')],
  },
} as const satisfies { readonly [name: string]: Preset };
