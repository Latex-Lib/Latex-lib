/**
 * code.algorithmic's presets, each from the templates that write the algorithm float and algorithmic.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  plain: {
    description: "Pseudo-code in the algorithms bundle's ruled 'Algorithm n' float at the top or bottom of the page, caption above, one \\STATE per line, no line numbers; the way loads algorithm and algorithmic.",
    features: ['floating', 'captioned', 'ruled', 'escape-latex'],
    params: {},
    evidence: [solution('0703-aaai', '68'), { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0703-aaai/AnonymousSubmission/LaTeX/anonymous-submission-latex-2026.tex', line: '18-19, 652-670' }],
  },
  icml: {
    description:
      "ICML's algorithm: \\begin{algorithm}[tb] with \\caption and \\label, then algorithmic with no line numbers; icml2026.sty loads algorithm and algorithmic itself, so the way loads nothing.",
    features: ['floating', 'captioned', 'ruled', 'escape-latex'],
    params: { loadPackages: false },
    evidence: [
      solution('0461-icml', '68'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0461-icml/example_paper.tex', line: '429-444' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0461-icml/icml2026.sty', line: '121-122' },
    ],
  },
  ijcai: {
    description: "IJCAI's algorithm: \\begin{algorithm}[tb] with \\caption and \\label, then \\begin{algorithmic}[1], every line numbered; the style loads nothing, so the way loads algorithm and algorithmic.",
    writes: '\\begin{algorithm}[tb] \\caption{…} \\label{…} \\begin{algorithmic}[1] \\STATE … \\end{algorithmic} \\end{algorithm}',
    features: ['floating', 'captioned', 'ruled', 'line-numbers', 'escape-latex'],
    params: { lineNumbers: true },
    evidence: [solution('0319-ijcai', '65'), { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0319-ijcai/ijcai26.tex', line: '26-27, 568-586' }],
  },
} as const satisfies { readonly [name: string]: Preset };
