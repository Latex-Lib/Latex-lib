/**
 * ack.llncs-credits (containerBlock/acknowledgement). Springer LNCS's credits: \begin{credits} \subsubsection{\ackname} …
 * \end{credits}. llncs.cls's credits environment (l.218-228) sets its text \small and redefines \subsubsection and \paragraph as
 * small bold and italic run-in heads; llncsdoc.tex l.341-358 asks that acknowledgments and the mandatory disclosure of
 * interests go in it, each under a \subsubsection whose title is \ackname ("Acknowledgments.", l.81) or \discintname
 * ("Disclosure of Interests.", l.91), names that follow the class's language option. The node's title picks the head: none, or
 * Acknowledg(e)ments, gives \ackname; Disclosure of Interests (or competing interests, conflict of interest) gives
 * \discintname; any other is printed as given, with the closing period the class's names carry.
 * CTAN: https://ctan.org/pkg/llncs
 */
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, field, labelLine } from '../../protocol.ts';

/** A title as compared: lower case, one space, no closing period or colon. */
const normal = (title: string): string => title.toLowerCase().replace(/\s+/gu, ' ').trim().replace(/[.:]+$/u, '').trim();

const ACK = new Set(['acknowledgments', 'acknowledgements', 'acknowledgment', 'acknowledgement']);
const DISCINT = new Set(['disclosure of interests', 'disclosure of interest', 'competing interests', 'conflict of interest', 'conflicts of interest', 'declaration of competing interest']);

/** The head: the class's name for an acknowledgment or disclosure of interests, else the title with a closing period. */
export const headOf = (title: string): string => {
  const t = normal(title);
  if (t === '' || ACK.has(t)) return '\\ackname';
  if (DISCINT.has(t)) return '\\discintname';
  const text = escapeText(title);
  return /[.!?:]$/u.test(title) ? text : `${text}.`;
};

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  preamble: () => ({}),
  emit: (node, content) =>
    `\\begin{credits}\n\\subsubsection{${headOf(field(node, 'title'))}}${labelLine(field(node, 'label'))}\n${content.trim()}\n\\end{credits}\n\n`,
});

export default realize;
