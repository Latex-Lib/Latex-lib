/**
 * code.escape's presets: the escape travels to the code way between Flouest's markers.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  marker: {
    description: "LaTeX escaped from code, wrapped in Flouest's escape markers for the code way to print as it can (listings between (*@ and @*), alltt as it is, the others drop it).",
    features: ['escape-latex'],
    params: {},
    evidence: [solution('0084-guitartabs', '45')],
  },
} as const satisfies { readonly [name: string]: Preset };
