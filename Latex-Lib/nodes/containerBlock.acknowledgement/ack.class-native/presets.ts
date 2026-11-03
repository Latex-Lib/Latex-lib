/**
 * ack.class-native's presets: the class's own acknowledgements environment.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  acks: {
    description: "acmart's acknowledgements environment, \\begin{acks} … \\end{acks}, which the class titles and hides in anonymous review.",
    features: ['class-styled'],
    params: {},
    evidence: [solution('0346-anonymous-acm', '39'), solution('0332-ejp-electronic-communications-in-probabi', '44')],
  },
} as const satisfies { readonly [name: string]: Preset };
