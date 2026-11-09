/**
 * front.center-block (paragraph/title): a title banner set by hand in a center (or flushleft) environment where the title
 * stands, with no \maketitle and no page of its own: the title in its font, an optional subtitle, the authors (with
 * affiliation superscripts when there are several affiliations), one line per affiliation, the e-mails, the template's
 * extra lines (course, student number) joined by \quad, and the date only when the paper gives one. A poster's banner
 * (flowfram's sample-poster.tex l.48-56, a0poster's own a0.tex l.20-29) and a homework's head (0958-ecnu-homework
 * main.tex l.34-40).
 * CTAN: https://ctan.org/pkg/latex-base (center, flushleft)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, peopleOf, templateField, templateList } from '../node.ts';
import key from './key.ts';

/** `{<font> <text>\par}`, the font left out when it is ''. */
const line = (font: string, text: string): string => `{${font.trim() === '' ? '' : `${font.trim()} `}${text}\\par}`;

/**
 * The e-mails it prints: every author's (`all`), none, or (`corresponding`) the corresponding author's when
 * templateSpecific.correspondingAuthor names one (by e-mail or by name; an e-mail no author holds is printed as it is),
 * else every author's.
 */
const emailsOf = (node: Subject, which: string): string[] => {
  if (which === 'none') return [];
  const authors = authorsOf(node);
  const all = authors.map((a) => a.email).filter(Boolean);
  if (which === 'all') return all;
  const corresponding = templateField(node, 'correspondingAuthor');
  if (corresponding === '') return all;
  const matched = authors.filter((a) => a.email === corresponding || a.name === corresponding).map((a) => a.email).filter(Boolean);
  return matched.length > 0 ? matched : corresponding.includes('@') ? [corresponding] : [];
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    emit: (node, content) => {
      const env = param(p, 'align', 'center') === 'left' ? 'flushleft' : 'center';
      const titleGap = param(p, 'titleGap', '1em');
      const authorGap = param(p, 'authorGap', '0.5em');
      const affiliations = affiliationsOf(node);
      // Superscripts only when there is more than one affiliation to tell apart, as the posters and General's title do.
      const marked = affiliations.length > 1;
      const authors = authorsOf(node).map((a) => {
        const numbers = marked ? affiliationsOfAuthor(a, affiliations).map((f) => affiliationNumber(f, affiliations)) : [];
        return numbers.length > 0 ? `${a.name}\\textsuperscript{${numbers.join(',')}}` : a.name;
      });
      const subtitle = templateField(node, 'subtitle');
      const affiliationLines = affiliations.map((a) => line(param(p, 'affilFont', '\\large'), `${marked ? `\\textsuperscript{${affiliationNumber(a, affiliations)}}` : ''}${a.text}`));
      const emails = emailsOf(node, param(p, 'emails', 'corresponding'));
      const extra = templateList(node, 'titleLines');
      const { date } = peopleOf(node);
      const below = [
        ...affiliationLines,
        ...(emails.length === 0 ? [] : [line(param(p, 'emailFont', '\\normalsize\\ttfamily'), emails.join(', '))]),
        ...(extra.length === 0 ? [] : [line('', extra.join('\\quad '))]),
        ...(date === '' ? [] : [line('', date)]),
      ];
      const lines = [
        `\\begin{${env}}`,
        line(param(p, 'titleFont', '\\Huge\\bfseries'), content.trim()),
        ...(subtitle === '' ? [] : [`\\vspace{${titleGap}}`, line(param(p, 'subtitleFont', '\\large'), subtitle)]),
        ...(authors.length === 0 ? [] : [`\\vspace{${titleGap}}`, line(param(p, 'authorFont', '\\LARGE'), authors.join(', '))]),
        ...(below.length === 0 ? [] : [`\\vspace{${authorGap}}`, ...below]),
        `\\end{${env}}`,
      ];
      return `${lines.join('\n')}\n\n`;
    },
  };
};

export default realize;
