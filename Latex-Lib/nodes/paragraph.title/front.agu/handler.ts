/**
 * front.agu (paragraph/title). AGU's title block as its journal template writes it (agujournaltemplate.tex l.81-142):
 * \title, one \authors line with \affil numbers, \affiliation{n}{…} per affiliation, \correspondingauthor{name}{email}
 * and the keypoints list, all in the body, with no \maketitle.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateList } from '../node.ts';
import key from './key.ts';

/** 'A', 'A and B', 'A, B, and C': the template's example (l.99-100) puts a comma before the last of three or more. */
const joinNames = (names: readonly string[], and: string): string =>
  names.length <= 2 ? names.join(` ${and} `) : `${names.slice(0, -1).join(', ')}, ${and} ${names[names.length - 1] ?? ''}`;

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    // agujournal2019's \title, \authors and \affiliation typeset their argument at once (l.578-586): in the preamble they stop
    // at 'Missing \begin{document}' (the agu profile), so nothing goes there.
    preamble: () => ({}),
    emit: (node, content) => {
      const affiliations = affiliationsOf(node);
      const authors = authorsOf(node);
      const named = authors.map((a) => {
        const numbers = affiliationsOfAuthor(a, affiliations).map((f) => affiliationNumber(f, affiliations));
        return numbers.length > 0 ? `${a.name}\\affil{${numbers.join(',')}}` : a.name;
      });
      // The corresponding authors (the template allows several, l.116-119): an author named by email or name gives both; any
      // other value is printed as it is, as the email when it is one.
      const corresponding = templateList(node, 'correspondingAuthor').map((v) => {
        const a = authors.find((x) => (x.email !== '' && x.email === v) || x.name === v);
        if (a !== undefined) return `\\correspondingauthor{${a.name}}{${a.email}}`;
        return v.includes('@') ? `\\correspondingauthor{}{${v}}` : `\\correspondingauthor{${v}}{}`;
      });
      const points = templateList(node, 'keyPoints');
      return `${[
        `\\title{${content.trim()}}`,
        ...(named.length > 0 ? [`\\authors{${joinNames(named, escapeText(param(p, 'andWord', 'and')))}}`] : []),
        ...affiliations.map((f) => `\\affiliation{${affiliationNumber(f, affiliations)}}{${f.text}}`),
        ...corresponding,
        // The Key Points close the title page (l.125-142): the class's keypoints is \subsection*{Key Points:} and an itemize (cls l.599-601).
        ...(points.length > 0 ? ['\\begin{keypoints}', ...points.map((x) => `\\item ${x}`), '\\end{keypoints}'] : []),
      ].join('\n')}\n\n`;
    },
  };
};

export default realize;
