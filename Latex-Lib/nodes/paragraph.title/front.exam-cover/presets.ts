/**
 * front.exam-cover's presets, from the exam templates that write such a cover.
 */
import type { Preset } from '../../../schema/params.ts';

const SKILL = 'Latex Related Research/Latex-lib-main/Source/0429-ndpvt-web-latex-document-skill/assets/templates/exam.tex';
const EXAMPLE = 'Latex Related Research/Latex-Template-Examples/class.exam/main.tex';

export const PRESETS = {
  cover: {
    description: "An exam's cover on page 1: the course, title and date in the first page's header, the title in bold \\LARGE with the course and date centred under it, and one 'Name: ____' line.",
    writes: '\\firstpageheader{…}{…}{…} \\begin{center} {\\LARGE\\bfseries …\\par} {\\large …\\par} \\makebox[0.8\\textwidth]{Name:\\enspace\\hrulefill} \\end{center}',
    features: ['centered'],
    params: {},
    evidence: [
      { kind: 'source', file: SKILL, line: '27 (\\firstpageheader), 42-58 (the centred course, exam title, date and time allowed; the student name and ID lines with \\hrulefill)' },
      { kind: 'source', file: EXAMPLE, line: '49 (\\firstpageheader{\\coursecode}{Final Examination}{Summer Term}), 162-165 (\\makebox[0.8\\textwidth]{Name:\\enspace\\hrulefill})' },
    ],
  },
  'grade-table': {
    description: "The exam cover with 'Name' and 'Student number' lines and exam's grade table under them, one column per question (\\gradetable[h][questions]).",
    features: ['centered'],
    params: { studentFields: 'Name; Student number', gradeTable: 'questions' },
    evidence: [
      { kind: 'source', file: EXAMPLE, line: '162-167 (Name and Student number lines, \\gradetable[h][questions] in a center environment)' },
      { kind: 'source', file: SKILL, line: '81-84 (\\gradetable[h][questions] in a center environment)' },
    ],
  },
  'centred-only': {
    description: "The exam cover without the first page's header: the centred title, course, date and time allowed, then the name lines.",
    writes: '\\begin{center} {\\LARGE\\bfseries …\\par} {\\large …\\par} \\makebox[0.8\\textwidth]{…:\\enspace\\hrulefill} \\end{center}',
    features: ['centered'],
    params: { header: false, studentFields: 'Student Name; Student ID; Section' },
    evidence: [{ kind: 'source', file: SKILL, line: '27 (\\firstpageheader{}{}{}: an empty first-page header), 42-58 (the centred block and the Student Name, Student ID and Section lines)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
