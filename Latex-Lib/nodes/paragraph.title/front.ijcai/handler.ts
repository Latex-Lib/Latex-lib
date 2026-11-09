/**
 * front.ijcai (paragraph/title). IJCAI's own title block (ijcai27.sty on article, a copy of ijcai22.sty as ijcai26.sty is):
 * \title, then one \author holding the authors joined by \and, the last two by \And, with \\ after the last, each numbered
 * $^{1,2}$ by affiliation; \affiliations with one line per affiliation, each after its number and ended by \\; \emails with
 * the authors' e-mails joined by a comma and a space; then the style's \maketitle.
 * Not on CTAN: IJCAI's FormattingGuidelines kit (ijcai26.tex l.74-107, 221-245; ijcai26.sty l.99-168).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf } from '../node.ts';
import key from './key.ts';

const front = (node: Subject, content: string, emails: boolean): string => {
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  // With more than one affiliation each author carries their numbers as a math superscript, $^{2,3}$ (ijcai26.tex l.88-92,
  // 239: "numeric math superscripts", never symbols, which are the title's footnotes); with one affiliation none is needed
  // (l.237) and the affiliation is its line alone (l.77-83).
  const numbered = affiliations.length > 1;
  const names = authors.map((a) => {
    const numbers = numbered ? affiliationsOfAuthor(a, affiliations).map((f) => affiliationNumber(f, affiliations)) : [];
    return `${a.name}${numbers.length > 0 ? `$^{${numbers.join(',')}}$` : ''}`;
  });
  // \and after every author but the last two, \And after the second to last, \\ after the last (ijcai26.tex l.223-227): the
  // style's \@maketitle makes \and a comma and \And " and " (ijcai26.sty l.153-154).
  const authorText = names.map((n, i) => `${n}${i < names.length - 2 ? ' \\and' : i === names.length - 2 ? ' \\And' : '\\\\'}`).join('\n');
  // Every affiliation ends with \\, the last one too (ijcai26.tex l.232-233); its text is its department, name and address.
  const affiliationText = affiliations.map((f) => `${numbered ? `$^{${affiliationNumber(f, affiliations)}}$` : ''}${f.text}\\\\`).join('\n');
  // The e-mails are optional; given, all the authors' e-mails in the authors' order, joined by a comma and a space (l.243-245).
  const emailText = emails ? authors.map((a) => a.email).filter(Boolean).join(',\n') : '';
  // \affiliations and \emails are defined only inside the style's \@maketitle (ijcai26.sty l.122-127, 155-164), where the
  // \author text is set; each closes the group the authors' bold opened, so they appear only inside \author.
  const body = [
    ...(authorText === '' ? [] : [authorText]),
    ...(affiliationText === '' ? [] : ['\\affiliations', affiliationText]),
    ...(emailText === '' ? [] : ['\\emails', emailText]),
  ];
  // A per-author \thanks (the style turns \footnote into \thanks and sets the marks as \fnsymbol, l.103-104, 119, 146) is not
  // printed: the title's records carry no per-author note.
  return [`\\title{${content.trim()}}`, ...(body.length > 0 ? [`\\author{\n${body.join('\n')}\n}`] : [])].join('\n');
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    // The title lines go in the body, just before \maketitle, as front.class-native writes them: the style's \maketitle
    // (ijcai26.sty l.101-109) reads \@title and \@author there, in \twocolumn[\@maketitle] across both columns.
    preamble: () => ({}),
    emit: (node, content) => `${front(node, content, param(p, 'emails', 'all') === 'all')}\n\\maketitle\n\n`,
  };
};

export default realize;
