/**
 * head.tufte's presets: where a heading below the class's levels goes. The research's Tufte templates write \section,
 * \subsection and \newthought and never \subsubsection (Solution/0793-xtufte.md l.49-51, 0087-xtufte.md l.35-36,
 * 0825-tufte-essay.md l.33).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const XTUFTE_DEF = 'Latex Related Research/Latex-lib-main/Source/0793-xtufte/latex/xtufte-common.def';

export const PRESETS = {
  newthought: {
    description:
      "Tufte's own levels: chapter, section and subsection in the class's italic titles, and a heading below them as \\newthought{…}, a paragraph opening in small capitals after a line's space, as Tufte's books start a new thought.",
    writes: '\\section{…} \\label{…} \\subsection{…} \\newthought{…}',
    features: ['class-styled', 'italic-head', 'smallcaps-head', 'unnumbered'],
    params: { deepLevel: 'newthought' },
    evidence: [solution('0793-xtufte', '49'), solution('0087-xtufte', '36'), { kind: 'source', file: XTUFTE_DEF, line: '700-705' }],
  },
  paragraph: {
    description: "Tufte's levels with a heading below the subsection as the class's \\paragraph, a run-in italic title at the start of its paragraph.",
    writes: '\\section{…} \\label{…} \\subsection{…} \\paragraph{…}',
    features: ['class-styled', 'italic-head', 'run-in-head', 'unnumbered'],
    params: { deepLevel: 'paragraph' },
    evidence: [solution('0793-xtufte', '50'), { kind: 'source', file: XTUFTE_DEF, line: '1540-1544' }],
  },
  subsection: {
    description: "Tufte's levels with each heading below them moved one level up: a sub-subsection as \\subsection, a subparagraph as \\paragraph, so the outline keeps its depth order within the class's three levels.",
    writes: '\\section{…} \\label{…} \\subsection{…} \\paragraph{…}',
    features: ['class-styled', 'italic-head', 'unnumbered'],
    params: { deepLevel: 'subsection' },
    evidence: [solution('0793-xtufte', '51'), { kind: 'source', file: XTUFTE_DEF, line: '1552-1572' }],
  },
} as const satisfies { readonly [name: string]: Preset };
