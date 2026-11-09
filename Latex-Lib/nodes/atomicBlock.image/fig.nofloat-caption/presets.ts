/**
 * fig.nofloat-caption's presets, one per class form.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  tikzfigure: {
    description: "tikzposter's captioned figure, \\begin{tikzfigure}[caption] … \\end{tikzfigure}: no float, so it sits inside a block, numbered by the class with its caption under the image.",
    features: ['centered', 'captioned', 'scaled', 'class-styled', 'box-safe'],
    params: { form: 'tikzfigure' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0429-ndpvt-web-latex-document-skill/assets/templates/poster.tex', line: "11 ('tikzfigure environments (NOT standard figure)'), 229-256, 286-325" },
      solution('0429-ndpvt-web-latex-document-skill', '58'),
    ],
  },
  handset: {
    description: "A hand-numbered caption with no float, for the minimal class: the image centred, then {\\small Figure~\\thefigure: …} under it.",
    writes: '\\begin{center} \\includegraphics[width=…]{…}\\par \\smallskip {\\small\\refstepcounter{figure}\\label{…}Figure~\\thefigure: …\\par} \\end{center}',
    features: ['centered', 'captioned', 'scaled', 'small-type', 'box-safe'],
    params: { form: 'handset' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.minimal/main.tex', line: '223-227 (\\begin{center}\\includegraphics…\\par\\smallskip{\\small Figure 1: …\\par}\\end{center}), 47 (\\providecommand{\\small})' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0577-latex-base-dev/minimal.cls', line: '33-42 (no figure environment, no \\caption)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
