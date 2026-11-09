/**
 * front.tufte (paragraph/title). Tufte-LaTeX's title: \title[plain]{…} and \author[plain]{…}, whose optional arguments
 * are the plain forms the running heads and the PDF metadata print (\plaintitle, \plainauthor), the authors joined in
 * words (never \and: the class sets \@author outside any tabular), each with a \thanks margin note holding the e-mail
 * when asked, \publisher{…} for the title page, \date{…}, then \maketitle (a title block in large italics under
 * tufte-handout; under tufte-book, whose default titlepage option makes it \maketitlepage, the full title page) or
 * \maketitlepage. tufte-handout and tufte-book only.
 * CTAN: https://ctan.org/pkg/tufte-latex
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { authorsOf, peopleOf, templateField, titleLinesWith } from '../node.ts';
import key from './key.ts';
import { joinNames } from './names.ts';

/** The authors' names, each with its \thanks{\texttt{e-mail}} when `notes` is 'thanks' and the author has one. */
const names = (node: Subject, notes: string): string[] => {
  const records = authorsOf(node);
  if (records.length === 0) return [...peopleOf(node).authors];
  return records.map((a) => (notes === 'thanks' && a.email !== '' ? `${a.name}\\thanks{\\texttt{${a.email}}}` : a.name));
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const notes = param(p, 'authorNotes', 'none');
  return {
    // The declarations go in the preamble, as Tufte-LaTeX's own templates give them (class.tufte-handout/main.tex l.58-62,
    // 0087-xtufte main.tex l.24-26): the class's \title and \author store the plain forms and set the PDF's title and author
    // through \hypersetup, which the running heads of every page then print.
    preamble: (_params, _parentType, node, content) => {
      if (node === undefined || content === undefined) return {};
      const short = templateField(node, 'shortTitle');
      const running = templateField(node, 'runningAuthor');
      const authors = names(node, notes);
      // The paper's own publisher before the template's constant one; printed by \maketitlepage only.
      const publisher = templateField(node, 'publisher') || param(p, 'publisher');
      const date = titleLinesWith(node, content, param(p, 'date', 'given')).filter((l) => l.startsWith('\\date{'));
      return {
        declarations: [
          `\\title${short === '' ? '' : `[${short}]`}{${content.trim()}}`,
          ...(authors.length === 0 ? [] : [`\\author${running === '' ? '' : `[${running}]`}{${joinNames(authors)}}`]),
          ...(publisher === '' ? [] : [`\\publisher{${publisher}}`]),
          ...date,
        ],
      };
    },
    emit: () => `\\${param(p, 'titleCommand', 'maketitle')}\n\n`,
  };
};

export default realize;
