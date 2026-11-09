/**
 * note.epigraph: memoir's \epigraph{text}{source} (memoir.dtx l.18919-18923): the note's content as the quotation, its title
 * as the source, empty when the note has none (memoir sets the rule and an empty source line). The look is memoir's lengths and
 * declarations, set in the preamble only where a parameter differs from memoir's default: \epigraphwidth, \epigraphrule
 * (l.18826-18829), \epigraphposition, \epigraphfontsize (l.18865-18866). memoir emulates the epigraph package (l.33773), so
 * nothing is loaded.
 * CTAN: https://ctan.org/pkg/memoir (memman, "Epigraphs")
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { dataOf, escapeText, field, param } from '../../protocol.ts';
import key from './key.ts';

/** The source line: the note's own title, escaped, or nothing (not node.ts's `Note`, which would print as an attribution). */
const sourceOf = (node: Subject): string => (typeof dataOf(node)['title'] === 'string' ? escapeText(field(node, 'title')) : '');

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = [
    ...(param(p, 'width') === '' ? [] : [`\\setlength{\\epigraphwidth}{${param(p, 'width')}}`]),
    ...(param(p, 'rule') === '' ? [] : [`\\setlength{\\epigraphrule}{${param(p, 'rule')}}`]),
    ...(param(p, 'position', 'flushright') === 'flushright' ? [] : [`\\epigraphposition{${param(p, 'position')}}`]),
    ...(param(p, 'fontSize') === '' ? [] : [`\\epigraphfontsize{${param(p, 'fontSize')}}`]),
  ];
  return {
    preamble: () => (declarations.length === 0 ? {} : { declarations }),
    // \epigraph is \long (\newcommand, not \newcommand*), so a note of several paragraphs is one argument.
    emit: (node, content) => `\n\\epigraph{${content.trim() || '\\mbox{}'}}{${sourceOf(node)}}\n\n`,
  };
};

export default realize;
