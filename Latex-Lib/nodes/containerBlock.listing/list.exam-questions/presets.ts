/**
 * list.exam-questions' presets, each from the templates that use it.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual } from '../../evidence.ts';

/** A template's own source, at its lines. */
const source = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/${file}`, line }) as const;

export const PRESETS = {
  questions: {
    description:
      "exam's questions, parts and subparts by indent, with points in brackets (\\question[4], \\part[2]) and lettered multiple choices (\\choice, \\CorrectChoice) in a choices environment.",
    features: ['numbered', 'lettered'],
    params: {},
    evidence: [
      source('Latex-Template-Examples/class.exam/main.tex', '177-211 (questions, \\question[4], parts with \\part[2], choices with \\choice and \\CorrectChoice)'),
      source('Latex-lib-main/Source/0429-ndpvt-web-latex-document-skill/assets/templates/exam.tex', '88-101, 181-189 (\\question[2] over choices; \\question[10] over parts \\part[2])'),
      source('Latex-lib-main/Source/0355-sexam/bac_template-DZ.tex', '48-50, 75-86 (\\question [04], parts, subparts)'),
    ],
  },
  checkboxes: {
    description: 'Multiple choices as boxes to tick rather than lettered answers (exam\'s checkboxes environment, \\choice and \\CorrectChoice).',
    writes: '\\begin{questions} \\question[…] … \\begin{checkboxes} \\choice … \\CorrectChoice … \\end{checkboxes} \\end{questions}',
    features: ['numbered', 'custom-labels'],
    params: { choiceForm: 'checkboxes' },
    evidence: [
      source('Latex-lib-main/Source/0169-open-source-uc-latex-templates/templates/plantilla-uc/base.tex', '169-171 (alternativas: \\begin{checkboxes}, \\choice, \\CorrectChoice)'),
      manual('exam', 'Multiple choice questions: checkboxes'),
    ],
  },
  'inline-choices': {
    description: 'Short multiple choices run into one paragraph, (A) … (B) … (exam\'s oneparchoices).',
    writes: '\\begin{questions} \\question[…] … \\begin{oneparchoices} \\choice … \\CorrectChoice … \\end{oneparchoices} \\end{questions}',
    features: ['numbered', 'lettered', 'inline-list'],
    params: { choiceForm: 'oneparchoices' },
    evidence: [manual('exam', 'Multiple choice questions: oneparchoices, oneparcheckboxes')],
  },
  continued: {
    description: 'Questions numbered on across lists split by other blocks (text, a figure, a heading between them), not from 1 in each list as exam numbers each questions environment.',
    writes: '\\begin{questions} \\setcounter{question}{…} \\question[…] … \\end{questions}; \\newcounter{LatexLibExamQuestion}',
    features: ['numbered', 'lettered', 'resumed-numbering'],
    params: { numbering: 'continue' },
    evidence: [
      source('Latex-Template-Examples/class.exam/main.tex', '177, 248, 294 (three questions environments split by sections, a table and a figure)'),
      { kind: 'compile', reproducer: 'exam 2023/07/09 v2.704 on ZeroTeX-NG: two questions environments split by text; the second one\'s first \\question printed QNUM=1 (\\typeout{QNUM=\\arabic{question}}) and the log warned "Label `question@1\' multiply defined"' },
    ],
  },
  bonus: {
    description: 'Every question and part a bonus one, its points counted apart from the exam\'s total (\\bonusquestion[4], \\bonuspart[2]).',
    writes: '\\begin{questions} \\bonusquestion[…] … \\begin{parts} \\bonuspart[…] … \\end{parts} \\end{questions}',
    features: ['numbered', 'lettered'],
    params: { bonus: true },
    evidence: [manual('exam', 'Bonus questions and bonus parts: \\bonusquestion, \\bonuspart, \\bonussubpart')],
  },
} as const satisfies { readonly [name: string]: Preset };
