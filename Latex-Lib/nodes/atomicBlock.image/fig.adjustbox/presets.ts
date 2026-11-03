/**
 * fig.adjustbox's presets, each from the templates that use it (`node seed.ts fig --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  centered: {
    description: 'The image scaled to its width and centred by keys, \\adjustimage{width=…,center}{file}, in a figure float.',
    features: ['floating', 'centered', 'captioned', 'scaled'],
    params: {},
    evidence: [solution('0088-tinoryj-uestc-thesis-latex-template', '74')],
  },
  'max-width': {
    description: 'The image at its natural size unless wider than its width, \\adjustimage{max width=…,center}, placed here.',
    features: ['here', 'centered', 'captioned', 'scaled'],
    params: { sizing: 'max-width', placement: 'h' },
    evidence: [solution('0108-lix', '56')],
  },
  'framed-scaled': {
    description: 'The image scaled by a factor in a thin frame, \\adjustimage{scale=…,fbox=1.5pt,center}.',
    features: ['floating', 'centered', 'captioned', 'scaled', 'framed'],
    params: { sizing: 'scale', scale: 0.5, frame: '1.5pt' },
    evidence: [solution('0003-ucsmonograph', '75')],
  },
  'on-white': {
    description: 'An image on a white ground outside any float (a photo, a signature): \\adjustimage{width=…,bgcolor=white}.',
    features: ['scaled', 'background'],
    params: { float: false, background: 'white', center: false },
    evidence: [solution('0112-sizuhe-latex-templates-library', '41'), solution('0112-sizuhe-latex-templates-library', '75')],
  },
} as const satisfies { readonly [name: string]: Preset };
