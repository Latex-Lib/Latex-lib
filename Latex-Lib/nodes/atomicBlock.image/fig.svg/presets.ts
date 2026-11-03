/**
 * fig.svg's presets, each from the templates that use it (`node seed.ts fig --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  figure: {
    description: 'An SVG file in a centred figure float, \\includesvg[width=…]{file}, its text typeset by LaTeX (Inkscape exports it at compile time).',
    features: ['vector-graphics', 'floating', 'centered', 'captioned', 'scaled'],
    params: {},
    evidence: [solution('0103-relatese', '61'), solution('0108-lix', '57')],
  },
  'inkscape-text': {
    description: "The SVG's text kept as Inkscape draws it, not set by LaTeX (inkscapelatex=false), files from their own folder (\\svgpath).",
    features: ['vector-graphics', 'floating', 'centered', 'captioned', 'scaled'],
    params: { latexText: false, svgPath: 'images/vectors' },
    evidence: [solution('0475-alexpovel-latex-cookbook', '90')],
  },
} as const satisfies { readonly [name: string]: Preset };
