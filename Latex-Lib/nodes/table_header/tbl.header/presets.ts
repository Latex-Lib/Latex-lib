/**
 * tbl.header's presets, each from the templates that use it (`node seed.ts tbl --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  bold: {
    description: "A header cell in bold (General's), its background and row span as any cell.",
    features: ['bold-head'],
    params: {},
    evidence: [solution('0053-zhanghai-zju-csse-undergraduate-design-l', '60'), solution('0240-ksp-thesis', '52')],
  },
  shaded: {
    description: 'A bold header cell on a light grey ground (\\cellcolor{gray!20}).',
    features: ['bold-head', 'background'],
    params: { shade: 'gray!20' },
    evidence: [solution('0030-seu-ml-assign', '69'), solution('0044-long-invoice', '48')],
  },
  smallcaps: {
    description: 'A header cell in small capitals instead of bold.',
    features: ['smallcaps-head'],
    params: { font: '\\scshape' },
    evidence: [solution('0098-minimal-cv', '43')],
  },
} as const satisfies { readonly [name: string]: Preset };
