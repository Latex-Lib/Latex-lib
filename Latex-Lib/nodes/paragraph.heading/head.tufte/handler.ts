/**
 * head.tufte: Tufte-LaTeX's headings kept within the levels the class allows. tufte-common.def replaces \subsubsection and
 * \subparagraph with a class error ("\subsubsection is undefined by this class", after Bringhurst's levels of headings;
 * tufte-common.def v3.5.2 l.1649-1669, xtufte-common.def l.1552-1572; classes/tufte-handout.ts `forbids.names`), and gives
 * \newthought{…} for a paragraph-style opening: \tuftebreak (a skip of a line) then \noindent\textsc{…} (xtufte-common.def
 * l.700-705). So a heading at a forbidden level is written at an allowed one, chosen by `deepLevel`; every other level is the
 * kernel command under the class's titlesec formats (part, chapter, section, subsection, paragraph).
 * CTAN: https://ctan.org/pkg/tufte-latex
 *
 * deepLevel newthought: \subsubsection and \subparagraph become \newthought{Title}, the title opening a paragraph in small
 * capitals (no number, no contents line: a \label after it refers to the enclosing section, as for any unnumbered text).
 * deepLevel paragraph: both become \paragraph, the class's run-in italic title.
 * deepLevel subsection: \subsubsection becomes \subsection, \subparagraph \paragraph (one level up each, keeping their order).
 * Never \subsubsection or \subparagraph.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { field, labelLine, param } from '../../protocol.ts';
import { headingCommand, levelOf, type Level } from '../node.ts';
import key from './key.ts';

/** The level a forbidden one is written at, by `deepLevel`. */
const REPLACED: { readonly [deep: string]: { readonly subsubsection: Level | 'newthought'; readonly subparagraph: Level | 'newthought' } } = {
  newthought: { subsubsection: 'newthought', subparagraph: 'newthought' },
  paragraph: { subsubsection: 'paragraph', subparagraph: 'paragraph' },
  subsection: { subsubsection: 'subsection', subparagraph: 'paragraph' },
};

/** The node with its section level replaced, for headingCommand. */
const atLevel = (node: Subject, level: Level): Subject => {
  const data = (node.attrs?.['data'] ?? {}) as { readonly [name: string]: unknown };
  return { ...node, attrs: { ...(node.attrs ?? {}), data: { ...data, sectionLevel: level } } };
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const deep = REPLACED[param(p, 'deepLevel', 'newthought')] ?? REPLACED['newthought']!;
  return {
    preamble: () => ({}),
    emit: (node, content) => {
      const level = levelOf(node);
      if (level !== 'subsubsection' && level !== 'subparagraph') return headingCommand(node, content);
      const to = deep[level];
      if (to === 'newthought') return `\\newthought{${content.trim()}}${labelLine(field(node, 'label'))}\n\n`;
      return headingCommand(atLevel(node, to), content);
    },
  };
};

export default realize;
