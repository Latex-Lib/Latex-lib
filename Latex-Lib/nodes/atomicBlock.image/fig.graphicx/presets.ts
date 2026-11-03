/**
 * fig.graphicx's presets, each from the templates that use it (`node seed.ts fig --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  centered: {
    description: 'A figure float placed where LaTeX finds room (htbp), the image centred at its width of the line, the caption below.',
    features: ['floating', 'centered', 'captioned', 'scaled'],
    params: {},
    evidence: [solution('0125-eurographics', '47'), solution('0228-tikz', '35'), solution('0042-jankapunkt-master-thesis', '64')],
  },
  'top-or-bottom': {
    description: 'A figure only at the top or bottom of a page or on a float page (tbp), never in the text.',
    features: ['floating', 'centered', 'captioned', 'scaled'],
    params: { placement: 'tbp' },
    evidence: [solution('0070-ntgclass', '44'), solution('0432-langsci', '55')],
  },
  wide: {
    description: 'A figure across both columns of a two-column page (figure*), at the text width.',
    features: ['floating', 'centered', 'captioned', 'scaled', 'full-width'],
    params: { span: true, unit: 'textwidth', placement: 'tbp' },
    evidence: [solution('0125-eurographics', '47')],
  },
  'graphics-folder': {
    description: 'Images looked up in a folder of their own (\\graphicspath{{images/}}), in a centred figure float.',
    features: ['floating', 'centered', 'captioned', 'scaled'],
    params: { graphicsPath: 'images' },
    evidence: [solution('0004-lebhart', '46'), solution('0197-unbtex-university-of-bras-lia-thesis', '48'), solution('0088-tinoryj-uestc-thesis-latex-template', '74')],
  },
  inline: {
    description: 'The image alone, not in a float, at a fixed width (a logo, a photo, a signature): \\includegraphics[width=…]{…} in the text.',
    features: ['scaled'],
    params: { float: false, center: false },
    evidence: [solution('0105-unswcover', '34'), solution('0142-topletter', '46'), solution('0035-iop-journals', '40')],
  },
} as const satisfies { readonly [name: string]: Preset };
