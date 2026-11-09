/**
 * fig.caption-only's presets, from PLOS's template.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  plos: {
    description: "PLOS's figure legend: a figure float at !h holding only \\caption{…} and \\label{…}, the figure file itself uploaded apart.",
    features: ['floating', 'captioned', 'class-styled'],
    params: {},
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0862-plos/plos_latex_template.tex', line: '37-40 (DO NOT INCLUDE GRAPHICS IN YOUR MANUSCRIPT), 274-278 (\\begin{figure}[!h] \\caption{…} \\label{fig1} \\end{figure})' },
      { kind: 'requirement', file: 'Template/template-requirement/PLOS.md', line: '89' },
      solution('0862-plos', '23'),
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
