/**
 * The IEEE title ways' readers for what Flouest's title records do not hold per author: an author's IEEE membership grade
 * ("Member, IEEE", printed through \IEEEmembership) and an author's biography with its photo (IEEEbiography). Both are
 * templateSpecific lists naming their author, as front.acmart's author notes are (the owner's rule: a per-author value the
 * schema lacks is a templateSpecific field). Each takes a list of records or of `Author: text` strings, or one string split at
 * semicolons or line ends, never at commas, which a grade ("Member, IEEE") holds. The author is named by name or e-mail.
 * Every text comes back LaTeX-escaped, as node.ts's readers give it; a photo's path is kept as written (a file name, which
 * escaping would break), less the characters an argument cannot hold.
 */
import { dataOf, escapeText } from '../../protocol.ts';
import type { Subject } from '../../../schema/realization.ts';
import type { TitleAuthor } from '../node.ts';

const record = (v: unknown): { readonly [name: string]: unknown } => (v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as { readonly [name: string]: unknown }) : {});
const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

/** The field's entries: a list as it is, a string split at semicolons and line ends. */
const entries = (node: Subject, name: string): unknown[] => {
  const v = record(dataOf(node)['templateSpecific'])[name];
  return Array.isArray(v) ? v : typeof v === 'string' ? v.split(/[;\n]/u) : [];
};

/** `Author: text`, or the whole string as the text with no author. */
const labelled = (s: string): { readonly label: string; readonly value: string } => {
  const m = /^([^:]{1,80}):\s*(.+)$/u.exec(s);
  return m ? { label: (m[1] ?? '').trim(), value: (m[2] ?? '').trim() } : { label: '', value: s };
};

/** Whether a value (a name or an e-mail, escaped as the author's are) names the author. */
export const namesAuthor = (a: TitleAuthor, value: string): boolean => value !== '' && (a.name === value || (a.email !== '' && a.email === value));

/** Memberships: `{author, membership}` records or `Author: Member, IEEE` strings (templateSpecific.memberships). */
export const membershipsOf = (node: Subject): { readonly author: string; readonly text: string }[] =>
  entries(node, 'memberships')
    .map((e) => (typeof e === 'string' ? labelled(e.trim()) : { label: str(record(e)['author']), value: str(record(e)['membership']) }))
    .filter((m) => m.label !== '' && m.value !== '')
    .map((m) => ({ author: escapeText(m.label), text: escapeText(m.value) }));

/** The membership grade the paper gives an author, or ''. */
export const membershipOf = (node: Subject, a: TitleAuthor): string => membershipsOf(node).find((m) => namesAuthor(a, m.author))?.text ?? '';

/** Biographies: `{author, text, photo}` records or `Author: text` strings (templateSpecific.biographies). */
export const biographiesOf = (node: Subject): { readonly author: string; readonly text: string; readonly photo: string }[] =>
  entries(node, 'biographies')
    .map((e) =>
      typeof e === 'string'
        ? { ...labelled(e.trim()), photo: '' }
        : { label: str(record(e)['author']), value: str(record(e)['text']), photo: str(record(e)['photo']).replace(/[\\{}%#]/gu, '') },
    )
    .filter((b) => b.label !== '' && b.value !== '')
    .map((b) => ({ author: escapeText(b.label), text: escapeText(b.value), photo: b.photo }));

/** Names as IEEE lists them in running text: "A", "A and B", "A, B, and C". */
export const nameList = (names: readonly string[]): string =>
  names.length <= 2 ? names.join(' and ') : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1] ?? ''}`;

/** The running head's authors when the paper gives none: the first author's surname, with "et al." when there are more. */
export const runningAuthorOf = (authors: readonly TitleAuthor[], etAl: string): string => {
  const first = authors[0];
  if (first === undefined) return '';
  // Before a comma ("Third C. Author, Jr."), the last word.
  const surname = (first.name.split(',')[0] ?? first.name).split(/\s+/u).filter(Boolean).pop() ?? first.name;
  return authors.length > 1 ? `${surname} ${etAl}` : surname;
};
