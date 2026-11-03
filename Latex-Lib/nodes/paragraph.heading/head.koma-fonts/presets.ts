/**
 * head.koma-fonts's presets, each from the templates that use it (`node seed.ts head --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  roman: {
    description: "KOMA's headings in the roman family instead of its sans-serif, still bold: \\setkomafont{disposition}{\\normalfont\\bfseries}.",
    features: ['bold-head'],
    params: { font: '\\normalfont\\bfseries' },
    evidence: [solution('0068-kaobook', '78'), solution('0146-extsizes', '34')],
  },
  smallcaps: {
    description: 'Headings in small capitals of the normal weight, \\setkomafont{sectioning}{\\normalfont\\scshape}.',
    features: ['smallcaps-head'],
    params: { font: '\\normalfont\\scshape' },
    evidence: [solution('0270-legrand-orange-book', '55')],
  },
  colored: {
    description: "KOMA's sans-serif bold headings with an accent colour added, \\addtokomafont{disposition}{\\color{…}}.",
    features: ['sans-serif', 'bold-head', 'colored'],
    params: { font: '', mode: 'add', color: 'blue!60!black' },
    evidence: [solution('0263-beamertheme-spectrum', '51'), solution('0189-praecordi-praecordi-book', '44'), solution('0231-tecosaur-bmc', '67')],
  },
  'small-headings': {
    description: "KOMA's own smaller heading sizes, \\KOMAoptions{headings=small}, sans-serif bold, numbers without a closing dot.",
    features: ['sans-serif', 'bold-head', 'compact-spacing'],
    params: { font: '', mode: 'add', headings: 'small', numbers: 'noenddot' },
    evidence: [solution('0198-arsclassica', '55'), solution('0205-amcos-conference-booklet', '48')],
  },
} as const satisfies { readonly [name: string]: Preset };
