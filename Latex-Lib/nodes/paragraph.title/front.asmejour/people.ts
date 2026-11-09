/**
 * front.asmejour's reading of the title's template record: which authors are corresponding authors
 * (`templateSpecific.correspondingAuthor`). asmejour has no joint first authors (asmejour.cls v1.28 l.1704-1705).
 * Every text is LaTeX text already (the title node's readers escape it).
 */
import type { Subject } from '../../../schema/realization.ts';
import { templateList, type TitleAuthor } from '../node.ts';

const same = (a: string, b: string): boolean => a !== '' && a.toLowerCase() === b.toLowerCase();

/**
 * The corresponding authors' indexes and the emails the class prints for them. `correspondingAuthor` names them by
 * email or by name (several split at commas or semicolons); each one's email is the author record's, or the value
 * itself when it was given as an email. A value that names no author but is an email marks the first author with it
 * (a paper whose author records carry no email), so the address the paper gives is not lost.
 */
export const correspondingOf = (node: Subject, authors: readonly TitleAuthor[]): { readonly indexes: readonly number[]; readonly emails: readonly string[] } => {
  const named = templateList(node, 'correspondingAuthor');
  const indexes: number[] = [];
  const emails: string[] = [];
  authors.forEach((a, i) => {
    const hit = named.find((n) => same(n, a.email) || same(n, a.name));
    if (hit === undefined) return;
    indexes.push(i);
    const email = a.email !== '' ? a.email : hit.includes('@') ? hit : '';
    if (email !== '' && !emails.includes(email)) emails.push(email);
  });
  if (indexes.length === 0 && authors.length > 0) {
    const given = named.filter((n) => n.includes('@'));
    if (given.length > 0) return { indexes: [0], emails: given };
  }
  return { indexes, emails };
};
