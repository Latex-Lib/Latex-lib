/**
 * front.ieeeaccess (paragraph/title). IEEE Access's title block as its starter (Template/templates/ieee-access/starter.tex l.1-23)
 * and example (Latex-Template-Examples/class.ieeeaccess/main.tex l.97-117) write it: \history, \doi, \title, one \author of
 * \uppercase{Name}\authorrefmark{n} with \IEEEmembership{grade}, an \address[n]{…(e-mail: …)} per affiliation, \tfootnote (the
 * funding), \markboth, \corresp and the keywords environment; then \maketitle, which ieeeaccess.cls holds until the abstract is
 * written, since its abstract and keywords are boxes that only \maketitle prints (ieeeaccess.cls l.615-649, 763-765).
 * CTAN: https://ctan.org/pkg/ieeetran (the class itself is IEEE's, not on CTAN)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';
import type { TitleAuthor } from '../node.ts';
import { membershipOf, namesAuthor, runningAuthorOf } from '../front.ieeetran-journal/records.ts';
import key from './key.ts';

/**
 * The \author argument: each name as \uppercase{Name}\authorrefmark{1,2}, then ", \IEEEmembership{grade}" (the class prints it
 * "(grade)", l.794), joined by ", " with "and" before the last (the example's "…, and \uppercase{Third C. Scholar}…").
 */
const authorLine = (node: Subject, authors: readonly TitleAuthor[]): string => {
  const affiliations = affiliationsOf(node);
  return authors
    .map((a, i) => {
      const marks = affiliationsOfAuthor(a, affiliations).map((f) => affiliationNumber(f, affiliations));
      const grade = membershipOf(node, a);
      const and = i > 0 && i === authors.length - 1 ? 'and ' : '';
      return `${and}\\uppercase{${a.name}}${marks.length > 0 ? `\\authorrefmark{${marks.join(',')}}` : ''}${grade !== '' ? `, \\IEEEmembership{${grade}}` : ''}`;
    })
    .join(authors.length > 2 ? ',\n' : '\n');
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const skip = param(p, 'titlepgskip', '');
  return {
    // The deferred \maketitle's triggers: the end of the abstract environment, whose text the class keeps in box 99 for
    // \maketitle (l.615-625); the first \section, for a paper with no abstract; and \end{document}, for one with neither. \LatexLibAccessTitle is empty until the title
    // block below defines it, and empties itself once it has run, so the title block is set once, whichever comes first.
    // The kernel's generic hooks (env/abstract/after, cmd/section/before) are declared here, before \begin{document}.
    preamble: (_params, _parentType, node) =>
      node === undefined
        ? {}
        : { declarations: ['\\providecommand\\LatexLibAccessTitle{}', '\\AddToHook{env/abstract/after}{\\LatexLibAccessTitle}', '\\AddToHook{cmd/section/before}{\\LatexLibAccessTitle}', '\\AtEndDocument{\\LatexLibAccessTitle}'] },
    // In the body, where the title stands: \history, \doi, \title, \author, \address, \tfootnote, \corresp and \markboth only store
    // their text (ieeeaccess.cls l.508, 601-613), and the keywords environment fills box 88 (l.630-649), all for \maketitle.
    emit: (node, content) => {
      const authors = authorsOf(node);
      const affiliations = affiliationsOf(node);
      const field = (name: string): string => templateField(node, name);
      // One \address per affiliation, numbered as the marks are, with its authors' e-mails (starter.tex l.7-11): each e-mail once,
      // at the first affiliation that names its author.
      const mailed = new Set<string>();
      const addresses = affiliations.map((f, i) => {
        const emails = authors.filter((a) => a.email !== '' && !mailed.has(a.email) && affiliationsOfAuthor(a, affiliations).some((x) => x.id === f.id)).map((a) => a.email);
        emails.forEach((e) => mailed.add(e));
        return `\\address[${i + 1}]{${f.text}${emails.length > 0 ? ` (e-mail: ${emails.join(', ')})` : ''}}`;
      });
      // "Corresponding author: Name (e-mail: …)." (starter.tex l.13), the author templateSpecific.correspondingAuthor names.
      const named = field('correspondingAuthor');
      const corresponding = authors.find((a) => namesAuthor(a, named));
      const corresp =
        named === '' ? [] : [`\\corresp{Corresponding author: ${corresponding?.name ?? named}${corresponding !== undefined && corresponding.email !== '' ? ` (e-mail: ${corresponding.email})` : ''}.}`];
      // The running heads, both pages alike: "Surname \headeretal: short title" (the example's l.110-112; \headeretal, l.1096).
      const head = `${field('runningAuthor') || runningAuthorOf(authors, '\\headeretal')}${authors.length > 0 || field('runningAuthor') !== '' ? ': ' : ''}${field('shortTitle') || content.trim()}`;
      const keywords = templateList(node, 'keywords');
      return `${[
        ...(field('history') !== '' ? [`\\history{${field('history')}}`] : []),
        // Always: \@maketitle prints \@doi (l.738), which only \doi sets; the starter writes \doi{} (l.1).
        `\\doi{${field('doi')}}`,
        `\\title{${content.trim()}}`,
        ...(authors.length > 0 ? [`\\author{${authorLine(node, authors)}}`] : []),
        ...addresses,
        ...(field('titleFootnote') !== '' ? [`\\tfootnote{${field('titleFootnote')}}`] : []),
        `\\markboth{${head}}{${head}}`,
        ...corresp,
        ...(keywords.length > 0 ? [`\\begin{keywords}\n${keywords.join(', ')}\n\\end{keywords}`] : []),
        // The space the class adds under the title block (\vspace*{\titlepgskip}, l.691), 0pt unless the template sets it.
        ...(skip !== '' ? [`\\titlepgskip=${skip}`] : []),
        // \maketitle, held until the abstract has filled its box: the starter writes the abstract and keywords before \maketitle
        // (l.15-23), and "after it they are silently lost" (IEEE_Access.md l.43); a Flouest document has its abstract after the
        // title. \maketitle starts with \twocolumn[…], a new page: an abstract printed in place (not in the class's box) stands
        // on a page of its own before the title: the abstract way to pair with it is one that fills the class's box.
        '\\gdef\\LatexLibAccessTitle{\\global\\let\\LatexLibAccessTitle\\relax\\maketitle}',
      ].join('\n')}\n\n`;
    },
  };
};

export default realize;
