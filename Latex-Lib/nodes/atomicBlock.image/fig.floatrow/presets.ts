/**
 * fig.floatrow's presets, each from the templates that use it (`node seed.ts fig --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'sidecap-outer': {
    description: "sidecap's SCfigure: the caption beside the image at the outer edge, the caption half as wide as the image (\\sidecaptionrelwidth).",
    features: ['side-caption', 'floating', 'captioned', 'scaled'],
    params: { engine: 'sidecap', relWidth: 0.5 },
    evidence: [solution('0315-valentjn-uni-stuttgart-phdthesis-templat', '105')],
  },
  'sidecap-left': {
    description: 'The caption always at the left of the image (sidecap\'s leftcaption option), vertically centred.',
    features: ['side-caption', 'floating', 'captioned', 'scaled'],
    params: { engine: 'sidecap', position: 'left', vpos: 'c' },
    evidence: [solution('0372-letgut', '74')],
  },
  'floatrow-right': {
    description: "floatrow's caption beside the image on the right, a quad between (\\floatsetup[figure]{capposition=beside,capbesideposition=right,capbesidesep=quad}, \\fcapside).",
    features: ['side-caption', 'floating', 'captioned', 'scaled'],
    params: { engine: 'floatrow', position: 'right' },
    evidence: [solution('0475-alexpovel-latex-cookbook', '92'), solution('0068-kaobook', '96')],
  },
  'floatrow-top-left': {
    description: 'floatrow with the caption beside the image at its top left (capbesideposition={top,left}).',
    features: ['side-caption', 'floating', 'captioned', 'scaled'],
    params: { engine: 'floatrow', position: 'left', vpos: 't' },
    evidence: [solution('0372-letgut', '74')],
  },
} as const satisfies { readonly [name: string]: Preset };
