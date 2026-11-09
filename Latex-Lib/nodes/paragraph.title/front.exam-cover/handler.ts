/**
 * front.exam-cover (paragraph/title). The exam class's cover on page 1, where the title stands: \firstpageheader{course}{title}{date}
 * (the first page's header), a centred block with the title in bold \LARGE and the course, date and time allowed under it, one
 * "Name: ____" line per student field (\makebox[0.8\textwidth]{Name:\enspace\hrulefill}), and exam's grade table (\gradetable or
 * \pointtable). exam has no title block of its own beyond article's \maketitle, and an exam's cover shares page 1 with the first
 * questions, so nothing here starts a page.
 * CTAN: https://ctan.org/pkg/exam
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, param } from '../../protocol.ts';
import { peopleOf, templateField } from '../node.ts';
import key from './key.ts';

/** The student fields of the `studentFields` parameter: names separated by semicolons, each escaped. */
const studentFields = (value: string): string[] => value.split(';').map((f) => f.trim()).filter(Boolean).map(escapeText);

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const grade = param(p, 'gradeTable', 'none');
  return {
    // exam counts points only after \addpoints (or its class option addpoints), and \gradetable and \pointtable stop at "Class exam
    // Error: You must give the command \addpoints" without it (ZeroTeX-NG, 2026-11-07, \documentclass{exam} with no option), so a
    // cover with a grade table turns it on in the preamble; given twice (with the class option) it is harmless.
    preamble: () => (grade === 'none' ? {} : { declarations: ['\\addpoints'] }),
    emit: (node, content) => {
      const title = content.trim();
      const course = templateField(node, 'course');
      const time = templateField(node, 'timeAllowed');
      const date = peopleOf(node).date;
      // The first page's header (exam.cls: \firstpageheader{left}{centre}{right}), stored and read when page 1 ships out, so it may
      // stand in the body; it shows under exam's default page style and its head and headandfoot styles (typeset: page 1's header carried the title and date).
      const header = p['header'] === false ? [] : [`\\firstpageheader{${course}}{${title}}{${date}}`];
      const lines = [
        ...(p['center'] === false
          ? []
          : [
              ...(title === '' ? [] : [`{\\LARGE\\bfseries ${title}\\par}`]),
              ...(course === '' ? [] : [`{\\large ${course}\\par}`]),
              ...(date === '' ? [] : [`{\\large ${date}\\par}`]),
              ...(time === '' ? [] : [`{\\large ${param(p, 'timeLabel', 'Time allowed:')} ${time}\\par}`]),
            ]),
      ];
      // The name lines as class.exam's example writes them (main.tex l.164-165), and the grade table under them (l.166): exam's
      // \gradetable[h][questions] (a row per question), [h][pages] (a column per page) or \pointtable[h][questions] (no score row).
      const fields = studentFields(param(p, 'studentFields', 'Name')).map((f) => `\\makebox[0.8\\textwidth]{${f}:\\enspace\\hrulefill}`);
      const table = grade === 'none' ? [] : [grade === 'pointtable' ? '\\pointtable[h][questions]' : `\\gradetable[h][${grade}]`];
      const lower = [...fields, ...table].join('\\\\[1em]\n');
      const block = [...lines, ...(lines.length > 0 && lower !== '' ? ['\\vspace{1em}'] : []), ...(lower === '' ? [] : [lower])];
      return `${[...header, ...(block.length === 0 ? [] : ['\\begin{center}', ...block, '\\end{center}'])].join('\n')}\n\n`;
    },
  };
};

export default realize;
