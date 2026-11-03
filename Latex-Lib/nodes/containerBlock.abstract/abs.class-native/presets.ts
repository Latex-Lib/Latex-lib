/**
 * abs.class-native's presets, each from the templates that use it (`node seed.ts abs --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  environment: {
    description: "The class's own abstract environment, unstyled: \\begin{abstract} … \\end{abstract} as acmart, IEEEtran, elsarticle or iopjournal print it.",
    features: ['class-styled'],
    params: {},
    evidence: [solution('0035-iop-journals', '44'), solution('0159-deutschesmuseum', '42'), solution('0003-ucsmonograph', '60')],
  },
  command: {
    description: 'The abstract as a preamble command the class stores and \\maketitle prints, \\abstract{…} (sn-jnl, mdpi, aa).',
    features: ['class-styled'],
    params: { form: 'command' },
    evidence: [solution('0108-lix', '41')],
  },
} as const satisfies { readonly [name: string]: Preset };
