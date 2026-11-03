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
} as const satisfies { readonly [name: string]: Preset };
