/**
 * fig.margin's presets, from the Tufte samples (0825-tufte-essay main.tex l.46-58; xtufte's sample-book.tex l.605-620).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  margin: {
    description: 'The image in the outer margin at the line it is written beside, its caption under it in the margin.',
    features: ['margin-note', 'captioned', 'scaled', 'class-styled'],
    params: {},
    evidence: [
      solution('0825-tufte-essay', '35'),
      solution('0793-xtufte', '68'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0793-xtufte/doc/sample-book.tex', line: '605-610' },
    ],
  },
  offset: {
    description: 'The margin figure moved from the line it is anchored to by an offset (here one line down), to clear a side note or line up with the text.',
    writes: '\\begin{marginfigure}[…] \\includegraphics[width=\\linewidth]{…} \\caption{…} \\label{…} \\end{marginfigure}',
    features: ['margin-note', 'captioned', 'scaled', 'class-styled'],
    params: { offset: '1\\baselineskip' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0793-xtufte/doc/sample-book.tex', line: '612-624 (\\begin{marginfigure}[<offset>])' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0793-xtufte/latex/xtufte-common.def', line: '1027-1050' },
      manual('tufte-latex', 'Margin figures and tables: the optional offset'),
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
