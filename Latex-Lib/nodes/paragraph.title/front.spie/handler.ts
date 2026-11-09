/**
 * front.spie (paragraph/title). SPIE proceedings' title block (spie.cls v3.25), at the title's place before \maketitle:
 * \title{…}, one \author{…} holding the names with \supit affiliation letters, \skiplinehalf and the affiliations each after
 * its \supit letter, the \authorinfo footnote with the correspondence and e-mails, and the keywords right after the abstract.
 * CTAN: https://ctan.org/pkg/spie
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';
import key from './key.ts';

/** a, b, …, z, then aa, ab, …: the affiliation's letter from its 1-based number. */
const letter = (n: number): string => (n <= 26 ? String.fromCharCode(96 + n) : `${letter(Math.floor((n - 1) / 26))}${letter(((n - 1) % 26) + 1)}`);

/** A, B and C: two names joined by "and", more with commas and ", and" before the last (main.tex l.95). */
const joinNames = (names: readonly string[]): string =>
  names.length <= 2 ? names.join(' and ') : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1] ?? ''}`;

const front = (node: Subject, content: string): string[] => {
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  const lines = [`\\title{${content.trim()}}`];
  // \author{First Author\supit{a}, … \skiplinehalf \supit{a}Affiliation One, …; \\ \supit{b}…} (main.tex l.95-99): \supit is a
  // raised small italic letter (spie.cls: \raisebox{0.8ex}{\small\it #1}), \skiplinehalf a \medskip and a line break.
  if (authors.length > 0) {
    const names = authors.map((a) => {
      const letters = affiliationsOfAuthor(a, affiliations).map((f) => letter(affiliationNumber(f, affiliations)));
      return `${a.name}${letters.length === 0 ? '' : `\\supit{${letters.join(',')}}`}`;
    });
    const places = affiliations.map((f) => `\\supit{${letter(affiliationNumber(f, affiliations))}}${f.text}`);
    lines.push(places.length === 0 ? `\\author{${joinNames(names)}}` : `\\author{${joinNames(names)}\n\\skiplinehalf\n${places.join('; \\\\\n')}\n}`);
  }
  // \authorinfo{…} (spie.cls: \gdef\@authorinfo{#1}), which \maketitle sets as an unmarked footnote on the first page:
  // "Further author information: (Send correspondence to …)" and one "Name: E-mail: …" line per author with an e-mail
  // (main.tex l.101-103). templateSpecific.authorInfo, when the paper gives it (telephone numbers and the like), replaces it.
  const given = templateField(node, 'authorInfo', '\\\\\n');
  const corresponding = templateList(node, 'correspondingAuthor').map((c) => authors.find((a) => a.name === c || (a.email !== '' && a.email === c))?.name ?? c);
  const info = [
    ...(corresponding.length === 0 ? [] : [`Further author information: (Send correspondence to ${joinNames(corresponding)})`]),
    ...authors.filter((a) => a.email !== '').map((a) => `${a.name}: E-mail: ${a.email}`),
  ];
  if (given !== '') lines.push(`\\authorinfo{${given}}`);
  else if (info.length > 0) lines.push(`\\authorinfo{${info.join('\\\\\n')}}`);
  return lines;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    // Everything in the body at the title's place: the template sets \title, \author and \authorinfo in the preamble, but the
    // class only stores them (\gdef) until \maketitle, so the body serves as well. No \date: spie's title block prints none.
    preamble: () => ({}),
    emit: (node, content) => {
      const keywords = templateList(node, 'keywords');
      const kw = keywords.length === 0 ? '' : `\\keywords{${keywords.join(', ')}}`;
      // SPIE puts the keywords right after the abstract (main.tex l.111-119; spie.cls's \keywords prints a bold "Keywords:"
      // paragraph where it stands). The abstract node follows the title, so the keywords wait for its end in the kernel's
      // env/abstract/after hook; in a paper with no abstract the after-title form prints them under the title.
      const after = param(p, 'keywords', 'after-abstract') === 'after-title';
      const hook = kw === '' || after ? [] : [`\\AddToHook{env/abstract/after}{${kw}}`];
      return `${[...front(node, content), ...hook, '\\maketitle', ...(kw !== '' && after ? [kw] : [])].join('\n')}\n\n`;
    },
  };
};

export default realize;
