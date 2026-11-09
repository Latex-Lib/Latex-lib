/**
 * cols.fullwidth's presets, from Tufte-LaTeX's definition of the area (Source/0793-xtufte/latex/xtufte-common.def l.1293-1300)
 * and the class's own samples (sample-handout.tex l.267-274, sample-book.tex l.89-95).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual } from '../../evidence.ts';

const DEFINITION = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0793-xtufte/latex/xtufte-common.def', line: '1293-1300' } as const;
const HANDOUT = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0793-xtufte/doc/sample-handout.tex', line: '267-274' } as const;
const BOOK = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0793-xtufte/doc/sample-book.tex', line: '89-95' } as const;

export const PRESETS = {
  'full-width': {
    description: "Tufte's full-width area: the block's text runs across the text block and the margin (\\begin{fullwidth} … \\end{fullwidth}).",
    features: ['full-width', 'class-styled'],
    params: {},
    evidence: [DEFINITION, HANDOUT, BOOK],
  },
  'full-width-columns': {
    description: "Tufte's full-width area holding multicol's balanced columns for a block of two or three columns (\\begin{fullwidth} \\begin{multicols}{2} … \\end{multicols} \\end{fullwidth}).",
    writes: '\\begin{fullwidth} \\setlength{\\columnsep}{…} \\begin{multicols}{…} … \\end{multicols} \\end{fullwidth}',
    features: ['full-width', 'balanced-columns'],
    params: { split: 'multicol' },
    evidence: [DEFINITION, manual('multicol', 'the multicols environment')],
  },
} as const satisfies { readonly [name: string]: Preset };
