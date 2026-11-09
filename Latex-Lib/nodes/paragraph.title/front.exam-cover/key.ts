import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.exam-cover',
    node: 'paragraph/title',
    description:
      "The exam class's cover on page 1, where the title stands: \\firstpageheader{course}{title}{date} for the first page's header, a centred block with the title in bold \\LARGE and the course, date and time allowed under it, one \\makebox[0.8\\textwidth]{Name:\\enspace\\hrulefill} line per student field, and exam's \\gradetable[h][questions] (or [pages], or \\pointtable) under them; no \\maketitle and no page of its own.",
    // Body; preamble. The skeleton with every part; the presets give their own.
    writes:
      '\\firstpageheader{…}{…}{…} \\begin{center} {\\LARGE\\bfseries …\\par} {\\large …\\par} \\makebox[0.8\\textwidth]{Name:\\enspace\\hrulefill} \\gradetable[h][questions] \\end{center}; \\addpoints',
    ctan: ['exam'],
    features: ['centered'],
    params: {
      header: { type: 'boolean', default: true, description: "the first page's header, \\firstpageheader{course}{title}{date} (shown under exam's default, head and headandfoot page styles)" },
      center: { type: 'boolean', default: true, description: 'the centred title lines: the title in bold \\LARGE, then the course, the date and the time allowed in \\large, each when given' },
      timeLabel: { type: 'tex', default: 'Time allowed:', description: 'the words before templateSpecific.timeAllowed' },
      studentFields: {
        type: 'string',
        default: 'Name',
        description: "the student's fields, separated by semicolons (e.g. 'Name; Student number'), each a centred '<field>: ____' line \\makebox[0.8\\textwidth]{…:\\enspace\\hrulefill}; empty for none",
      },
      gradeTable: {
        type: 'enum',
        values: ['none', 'questions', 'pages', 'pointtable'],
        default: 'none',
        description:
          "exam's table of points under the name lines: none, \\gradetable[h][questions] (a column per question), \\gradetable[h][pages] (a column per page) or \\pointtable[h][questions] (points with no score row); with a table, \\addpoints in the preamble (exam counts points only after it, and its tables stop at an error without it)",
      },
    },
    fields: ['templateSpecific.course', 'templateSpecific.timeAllowed'],
    presets: PRESETS,
    // exam.cls's own commands: \firstpageheader, \gradetable and \pointtable.
    requires: ['cmd:\\firstpageheader'],
    requiresWhen: [
      { when: { gradeTable: ['questions', 'pages'] }, requires: ['cmd:\\gradetable', 'cmd:\\addpoints'] },
      { when: { gradeTable: 'pointtable' }, requires: ['cmd:\\pointtable', 'cmd:\\addpoints'] },
    ],
    only: ['class.exam'],
    // Typeset ok on ZeroTeX-NG (2026-11-07) under \documentclass{exam} and [addpoints]{exam}, each preset on the title sample
    // (with a course and time allowed) above a questions list: page 1's header, the centred block, the name lines and the grade table
    // (also [pages] and \pointtable).
    targetEngine: 'yes',
  }),
);
