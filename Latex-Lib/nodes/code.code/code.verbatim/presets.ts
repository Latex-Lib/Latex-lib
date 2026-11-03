/**
 * code.verbatim's presets, each from the templates that use it (`node seed.ts code --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  kernel: {
    description: "The kernel's verbatim environment: the code as typed, in typewriter type, no highlighting.",
    features: ['captioned'],
    params: {},
    evidence: [solution('0008-envlab', '34'), solution('0021-elife', '62'), solution('0024-flabels', '44')],
  },
  'fancy-framed': {
    description: "fancyvrb's Verbatim in a single frame, small type.",
    features: ['framed', 'captioned'],
    params: { package: 'fancyvrb', frame: 'single', fontsize: '\\small' },
    evidence: [solution('0154-hepthesis', '74'), solution('0188-elegantpaper', '65')],
  },
  'fancy-numbered': {
    description: "fancyvrb's Verbatim with line numbers at the left and rules above and below (numbers=left, frame=lines).",
    features: ['line-numbers', 'ruled', 'captioned'],
    params: { package: 'fancyvrb', numbers: 'left', frame: 'lines' },
    evidence: [solution('0166-retosmatematicos', '66')],
  },
  'fancy-indented': {
    description: "fancyvrb's Verbatim indented from the left margin (xleftmargin=0.5cm).",
    features: ['indented', 'captioned'],
    params: { package: 'fancyvrb', indent: '0.5cm' },
    evidence: [solution('0077-gi-ev-lni', '92')],
  },
  alltt: {
    description: 'alltt: typewriter text kept as typed but with LaTeX commands still working, so escaped LaTeX prints as LaTeX.',
    features: ['escape-latex', 'captioned'],
    params: { package: 'alltt' },
    evidence: [solution('0185-memhfixc', '69')],
  },
} as const satisfies { readonly [name: string]: Preset };
