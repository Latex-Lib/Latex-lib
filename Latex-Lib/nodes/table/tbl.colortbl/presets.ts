/**
 * tbl.colortbl's presets, each from the templates that use it (`node seed.ts tbl --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  zebra: {
    description: 'Alternate rows shaded from the second on, \\rowcolors{2}{gray!12}{white} (xcolor\'s table option), no rules.',
    features: ['floating', 'captioned', 'zebra-rows', 'background'],
    params: {},
    evidence: [solution('0059-ftc-notebook', '52')],
  },
  'header-band': {
    description: 'A dark header band with white text (\\rowcolor{…} and \\color{white} on the header row) over zebra rows.',
    features: ['floating', 'captioned', 'zebra-rows', 'background', 'colored'],
    params: { odd: 'white', even: 'blue!8', headerColor: 'blue!50!black', headerText: 'white' },
    evidence: [solution('0044-long-invoice', '48')],
  },
  'shaded-header': {
    description: 'Only the header row shaded light grey (\\rowcolor{gray!25}), the grid ruled with \\hline, no stripes.',
    features: ['floating', 'captioned', 'background', 'horizontal-rules'],
    params: { odd: '', even: '', headerColor: 'gray!25', rules: 'all' },
    evidence: [solution('0030-seu-ml-assign', '69'), solution('0042-jankapunkt-master-thesis', '67')],
  },
} as const satisfies { readonly [name: string]: Preset };
