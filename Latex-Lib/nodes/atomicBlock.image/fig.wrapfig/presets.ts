/**
 * fig.wrapfig's presets, each from the templates that use it (`node seed.ts fig --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

// right and left follow the line (\linewidth), not the text block. The templates write \textwidth, in one-column documents (elife, IU),
// where the two are equal at top level. In a two-column page 0.45\textwidth of a 229.5pt column is 211.05pt and leaves 8.45pt of text,
// and wrapfig keeps that \parshape for the paragraphs and headings after it (copy batch-3b article.B: d7167dfdc18053ec20c9e result
// 812e10de90, \begin{wrapfigure}{l}{0.45\textwidth} at l.475, every later heading overfull, "References" 67.35pt over at l.537; in
// d56b8966c11297756e7b1 the 8.45pt measure lasts from l.232 to l.863). The handler's default is already 0.45\linewidth.
export const PRESETS = {
  right: {
    description: 'The text wraps round an image at the right, a quarter of the line wide, \\begin{wrapfigure}{r}{0.25\\linewidth}.',
    features: ['wrapped', 'captioned', 'scaled'],
    params: { side: 'r', width: '0.25\\linewidth' },
    evidence: [solution('0169-open-source-uc-latex-templates', '72'), solution('0166-retosmatematicos', '63')],
  },
  left: {
    description: 'The image at the left, 0.45 of the line wide, the text wrapping on its right (\\begin{wrapfigure}{l}{.45\\linewidth}).',
    features: ['wrapped', 'captioned', 'scaled'],
    params: { side: 'l', width: '0.45\\linewidth' },
    evidence: [solution('0021-elife', '53')],
  },
  'outer-raised': {
    description: 'The image at the outer edge of two-sided pages (o), pulled up 4.5mm against the paragraph above.',
    features: ['wrapped', 'captioned', 'scaled'],
    params: { side: 'o', width: '40mm', raise: '4.5mm' },
    evidence: [solution('0166-retosmatematicos', '63')],
  },
} as const satisfies { readonly [name: string]: Preset };
