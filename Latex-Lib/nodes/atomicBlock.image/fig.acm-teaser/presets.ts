/**
 * fig.acm-teaser's presets, from ACM's samples (samples.dtx l.375-389) and acmart's documentation.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

const ACMART = 'Latex Related Research/Latex-lib-main/Source/0665-acmart/acmart.dtx';
const SAMPLES = 'Latex Related Research/Latex-lib-main/Source/0665-acmart/samples/samples.dtx';

export const PRESETS = {
  'full-width': {
    description: "ACM's teaser: the image at the full text width between the authors and the abstract, its caption and \\Description below it.",
    features: ['captioned', 'full-width', 'class-styled'],
    params: {},
    evidence: [
      { kind: 'source', file: SAMPLES, line: '375-389 (\\begin{teaserfigure}\\includegraphics[width=\\textwidth]{sampleteaser}\\caption\\Description\\label)' },
      { kind: 'source', file: ACMART, line: '1060-1076 (teaserfigure, before \\maketitle), 6450-6458, 7710-7721' },
      solution('0665-acmart', '73'),
    ],
  },
  scaled: {
    description: "A narrower teaser: the image at the node's share of the text width, centred, with its caption and \\Description.",
    writes: '\\begin{teaserfigure} \\centering \\includegraphics[width=…\\textwidth]{…} \\caption{…} \\Description{…} \\label{…} \\end{teaserfigure}',
    features: ['captioned', 'centered', 'scaled', 'class-styled'],
    params: { scaled: true },
    evidence: [{ kind: 'source', file: ACMART, line: '1380-1386 (a teaserfigure image scaled against \\textwidth)' }, manual('acmart', 'teaserfigure')],
  },
} as const satisfies { readonly [name: string]: Preset };
