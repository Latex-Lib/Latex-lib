/**
 * fig.float's presets, each from the templates that use it (`node seed.ts fig --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  here: {
    description: "float's [H]: the figure exactly where it is written, centred, the caption below.",
    features: ['here', 'centered', 'captioned', 'scaled'],
    params: {},
    evidence: [solution('0042-jankapunkt-master-thesis', '64'), solution('0169-open-source-uc-latex-templates', '72'), solution('0108-lix', '56')],
  },
  ruled: {
    description: "float's ruled style: a rule above the caption, which goes on top, and a rule under the figure (\\floatstyle{ruled}\\restylefloat{figure}), placed exactly here.",
    features: ['here', 'captioned', 'ruled', 'scaled'],
    params: { style: 'ruled' },
    evidence: [manual('float', 'float styles: \\floatstyle, \\restylefloat'), solution('0003-ucsmonograph', '73')],
  },
  boxed: {
    description: "float's boxed style: the figure framed, the caption below the frame (\\floatstyle{boxed}).",
    features: ['here', 'captioned', 'framed', 'scaled'],
    params: { style: 'boxed' },
    evidence: [manual('float', 'float styles: \\floatstyle, \\restylefloat')],
  },
} as const satisfies { readonly [name: string]: Preset };
