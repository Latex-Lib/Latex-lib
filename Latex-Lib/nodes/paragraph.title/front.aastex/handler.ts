/**
 * front.aastex (paragraph/title). AASTeX 7's front matter with no \maketitle: \title, \shorttitle, \shortauthors, per author
 * \author[orcid=…]{…}, \affiliation{…} and \email[show]{…}, then \collaboration{all}{…}, \correspondingauthor{…}, the dates and
 * \keywords{a --- b}. aastex701's first \section runs its \maketitle, which prints them (aastex701.cls l.7583-7594).
 * CTAN: https://ctan.org/pkg/aastex
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList, type TitleAuthor } from '../node.ts';
import key from './key.ts';

const line = (command: string, value: string): string[] => (value === '' ? [] : [`\\${command}{${value}}`]);

/** Whether the author is the one a templateSpecific value names (by e-mail or by name). */
const names = (author: TitleAuthor, value: string): boolean => value !== '' && (author.email === value || author.name === value);

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };

  const body = (node: Subject, content: string): string => {
    const authors = authorsOf(node);
    const affiliations = affiliationsOf(node);
    const corresponding = templateField(node, 'correspondingAuthor');
    const listed = templateList(node, 'shownEmails');
    const show = param(p, 'showEmails', 'corresponding');
    const shown = (a: TitleAuthor): boolean =>
      show === 'all' || ((show === 'listed' || show === 'corresponding') && listed.some((v) => names(a, v))) || (show === 'corresponding' && names(a, corresponding));

    // Every author needs an \affiliation and an \email, or the class stops with \stop at the title block ("AASTeX v7.0.1 requires
    // all authors to have an affiliation" / "an email address", aastex701.cls l.7370-7372, checked at l.12440-12441): an author with
    // none gets an empty one. \email[show] adds the address to the list printed at the foot of the first page (l.13341-13350).
    const author = (a: TitleAuthor): string[] => {
      const own = affiliationsOfAuthor(a, affiliations);
      return [
        `\\author${a.orcid === '' ? '' : `[orcid=${a.orcid}]`}{${a.name}}`,
        ...(own.length === 0 ? ['\\affiliation{}'] : own.map((x) => `\\affiliation{${x.text}}`)),
        `\\email${shown(a) && a.email !== '' ? '[show]' : ''}{${a.email}}`,
      ];
    };

    const correspondingAuthor = authors.find((a) => names(a, corresponding));
    const keywords = templateList(node, 'keywords').join(' --- ');
    return [
      `\\title{${content.trim()}}`,
      ...line('shorttitle', templateField(node, 'shortTitle')),
      ...line('shortauthors', templateField(node, 'runningAuthor')),
      ...authors.flatMap(author),
      ...(authors.length === 0 ? [] : line('collaboration{all}', templateField(node, 'collaboration'))),
      // After every author's \email: \correspondingauthor sets \ifcorrespauthor, and the next \email then prints as its footnote
      // without registering that author's address (l.13322-13350), so an author written after it would stop at "requires all
      // authors to have an email address".
      ...line('correspondingauthor', correspondingAuthor?.name ?? corresponding),
      ...line('received', templateField(node, 'received')),
      ...line('revised', templateField(node, 'revised')),
      ...line('accepted', templateField(node, 'accepted')),
      ...line('published', templateField(node, 'published')),
      // Stored for \maketitle (l.2308-2311), which refuses it after itself; plain keywords, as the paper gives them (no UAT ids).
      ...line('keywords', keywords),
    ].join('\n');
  };

  return {
    // In the body, after \begin{document}: aastex701 clears the title and the authors there (l.1922), as front.class-native notes.
    preamble: () => ({}),
    // No \maketitle: the profile refuses it (forbids.names), since the first \section runs it again; a document with no
    // \section never prints the block (known limitation of the class's design, which this way does not work around).
    emit: (node, content) => `${body(node, content)}\n\n`,
  };
};

export default realize;
