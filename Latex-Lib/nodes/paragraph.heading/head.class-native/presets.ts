/**
 * head.class-native's presets, each from the templates that use it (`node seed.ts head --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  class: {
    description: "The class's own heading look, untouched: fonts, spacing and numbering as the class sets them (acmart, llncs, IEEEtran, ltxdoc, a thesis class's \\@startsection).",
    features: ['class-styled'],
    params: {},
    evidence: [solution('0061-cascadilla-proceedings-project', '34'), solution('0125-eurographics', '40'), solution('0159-deutschesmuseum', '43'), solution('0179-simplecv', '33')],
  },
} as const satisfies { readonly [name: string]: Preset };
