/**
 * box.exam-solution's presets, each from the templates that use it (`node seed.ts note --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual } from '../../evidence.ts';

const EXAMPLE = 'Latex Related Research/Latex-Template-Examples/class.exam/main.tex';

export const PRESETS = {
  solution: {
    description: "exam's solution environment after a question: printed with its bold title only when the document says \\printanswers, otherwise left out with no space kept; the note's title, when it has one, in place of 'Solution:'.",
    writes: '\\begin{solution} … \\end{solution}',
    features: ['bold-head'],
    params: {},
    evidence: [
      { kind: 'source', file: EXAMPLE, line: '181-183 (\\begin{solution} … \\end{solution} after \\question[4]), 36-37 (% \\printanswers)' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0429-ndpvt-web-latex-document-skill/assets/templates/exam.tex', line: '5-12 (answers only with \\printanswers), 103-105' },
    ],
  },
  'answer-space': {
    description: 'A solution that keeps 4cm of blank space for the answer on the students\' copy, where the answers are not printed (\\begin{solution}[4cm]).',
    writes: '\\begin{solution}[…] … \\end{solution}',
    features: ['bold-head'],
    params: { space: '4cm' },
    evidence: [
      { kind: 'source', file: EXAMPLE, line: '253-255 (\\begin{solution}[4cm])' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0429-ndpvt-web-latex-document-skill/assets/templates/exam.tex', line: '220-222 (\\begin{solution}[2in])' },
    ],
  },
  'box-or-solution': {
    description: 'solutionorbox: the solution when answers are printed, otherwise an empty framed box 2in high for the answer.',
    writes: '\\begin{solutionorbox}[…] … \\end{solutionorbox}',
    features: ['bold-head', 'framed'],
    params: { form: 'solutionorbox', space: '2in' },
    evidence: [manual('exam', 'Solutions: the solutionorbox environment')],
  },
  'lines-or-solution': {
    description: 'solutionorlines: the solution when answers are printed, otherwise ruled lines filling 1.5in for the answer.',
    writes: '\\begin{solutionorlines}[…] … \\end{solutionorlines}',
    features: ['bold-head', 'ruled'],
    params: { form: 'solutionorlines', space: '1.5in' },
    evidence: [manual('exam', 'Solutions: the solutionorlines environment')],
  },
  'answer-key': {
    description: "The answer key: \\printanswers for the whole document, so every solution prints, framed or shaded as the class's \\framedsolutions or \\shadedsolutions say.",
    writes: '\\begin{solution} … \\end{solution}; \\printanswers',
    features: ['bold-head'],
    params: { answers: 'printed' },
    evidence: [
      { kind: 'source', file: EXAMPLE, line: '36-37 (% \\printanswers, "Uncomment to print the solutions")' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0429-ndpvt-web-latex-document-skill/assets/templates/exam.tex', line: '11-12 (% \\printanswers)' },
    ],
  },
  'document-title': {
    description: "A solution under the document's own \\solutiontitle (the template's 'Model answer:'), whatever the note's title.",
    writes: '\\begin{solution} … \\end{solution}',
    features: ['bold-head'],
    params: { title: 'document' },
    evidence: [
      { kind: 'source', file: EXAMPLE, line: '59 (\\renewcommand{\\solutiontitle}{\\noindent\\textbf{Model answer:}\\enspace})' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0169-open-source-uc-latex-templates/templates/plantilla-uc/base.tex', line: '280 (\\renewcommand{\\solutiontitle}{…})' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
