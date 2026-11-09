/**
 * abs.keywords's presets, each from the templates that end their abstract with a keywords line.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SRC = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  command: {
    description: "elegantpaper's abstract ending with the class's own \\keywords{…}, a bold 'Keywords:' line after a 2ex space, the keywords separated by commas.",
    writes: '\\begin{abstract} … \\par \\keywords{…} \\end{abstract}',
    features: ['class-styled', 'bold-head', 'run-in-head'],
    params: { form: 'command', separator: ', ' },
    evidence: [
      solution('0188-elegantpaper', '52'),
      { kind: 'source', file: `${SRC}/0188-elegantpaper/elegantpaper-en.tex`, line: '19-22' },
      { kind: 'source', file: `${SRC}/0188-elegantpaper/elegantpaper.cls`, line: '228 (cn), 254 (en): \\newcommand{\\keywords}[1]{\\vskip 2ex\\par\\noindent\\normalfont{\\bfseries Keywords: } #1}' },
    ],
  },
  line: {
    description: "The abstract ending with a line of its own that opens with a bold run-in label, \\noindent\\textbf{Keywords:} first; second; third (report and ctexrep theses).",
    writes: '\\begin{abstract} … \\par\\noindent\\textbf{Keywords:} … \\end{abstract}',
    features: ['small-type', 'centered', 'bold-head', 'run-in-head'],
    params: { form: 'line', label: 'Keywords:', separator: '; ' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.ctexrep/main.tex', line: '158-164' }],
  },
  'line-zh': {
    description: 'The Chinese abstract ending with a bold 关键词： label and the keywords separated by full-width semicolons (ctexrep theses).',
    writes: '\\begin{abstract} … \\par\\noindent\\textbf{关键词：} … \\end{abstract}',
    features: ['small-type', 'centered', 'bold-head', 'run-in-head'],
    params: { form: 'line', label: '关键词：', separator: '；' },
    evidence: [solution('0578-monetjoe-latex-paper-templates', '53'), { kind: 'source', file: `${SRC}/0578-monetjoe-latex-paper-templates/finalversion.tex`, line: '115-129 (\\textbf{关键词}：)' }],
  },
  italic: {
    description: 'The abstract ending with the keywords line set in italics, label and list alike, \\emph{Keywords: Lorem, Ipsum} (a report thesis).',
    writes: '\\begin{abstract} … \\par\\noindent\\emph{Keywords: …} \\end{abstract}',
    features: ['small-type', 'centered', 'italic-head'],
    params: { form: 'italic', label: 'Keywords:', separator: ', ' },
    evidence: [solution('0134-maehr-uzh-ma-thesis', '65'), { kind: 'source', file: `${SRC}/0134-maehr-uzh-ma-thesis/ma-thesis.tex`, line: '212, 238' }],
  },
} as const satisfies { readonly [name: string]: Preset };
