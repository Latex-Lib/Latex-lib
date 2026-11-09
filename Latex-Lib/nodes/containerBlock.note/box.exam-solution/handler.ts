/**
 * box.exam-solution: exam's \begin{solution}[space] … \end{solution} (or solutionorbox, solutionorlines,
 * solutionordottedlines), the note's content as a question's answer. exam prints it only under \printanswers, in \TheSolution
 * after \solutiontitle (`\noindent\textbf{Solution:}\enspace`); otherwise it keeps the space (blank, a box, lines) and sets the
 * body in a box it drops (exam 2023/07/09 v2.704, probed: \\solution, \TheSolution). The note's title, when it has one, goes to
 * a \solutiontitle renewed inside a group around the environment, so the document's own title stays for every other solution.
 * CTAN: https://ctan.org/pkg/exam (examdoc, "Solutions")
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { dataOf, escapeText, field, param } from '../../protocol.ts';
import key from './key.ts';

/** The note's own title, escaped, or undefined when it has none (exam's 'Solution:' then stays). */
const titleOf = (node: Subject): string | undefined => (typeof dataOf(node)['title'] === 'string' ? escapeText(field(node, 'title')) : undefined);

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const env = param(p, 'form', 'solution');
  const space = param(p, 'space');
  const declarations = param(p, 'answers', 'document') === 'printed' ? ['\\printanswers'] : [];
  return {
    preamble: () => (declarations.length === 0 ? {} : { declarations }),
    emit: (node, content) => {
      const body = content.trim() || '\\mbox{}';
      // Without the optional argument exam looks ahead for one (\@protected@testopt): a body opening with [ would be read as it.
      const open = `\\begin{${env}}${space === '' ? (body.startsWith('[') ? '\\relax' : '') : `[${space}]`}`;
      const block = `${open}\n${body}\n\\end{${env}}`;
      const title = param(p, 'title', 'note') === 'note' ? titleOf(node) : undefined;
      if (title === undefined) return `\n${block}\n\n`;
      // exam's own form of the title (\solutiontitle), with the note's words; '' prints none.
      const renewed = title === '' ? '' : `\\noindent\\textbf{${title}:}\\enspace`;
      return `\n\\begingroup\\renewcommand{\\solutiontitle}{${renewed}}\n${block}\n\\endgroup\n\n`;
    },
  };
};

export default realize;
