/**
 * A template field that holds lines (a recipient's name and address, a signature with a role under the name, the
 * enclosures, the copies), as LaTeX text: a list item by item, a string split at its line breaks, each escaped as
 * General escapes text. `templateField` would join a string's lines with spaces (`escapeText` turns a line break into a
 * space) and `templateList` would split an address at its commas ("Boston, MA 02210"), so the letter reads them here.
 */
import { dataOf, escapeText } from '../../protocol.ts';
import type { Subject } from '../../../schema/realization.ts';

export const templateLines = (node: Subject, name: string): string[] => {
  const ts = dataOf(node)['templateSpecific'];
  const v = ts !== null && typeof ts === 'object' && !Array.isArray(ts) ? (ts as { readonly [name: string]: unknown })[name] : undefined;
  const items = Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : typeof v === 'string' ? v.split(/\r\n?|\n/u) : [];
  return items.map((x) => x.trim()).filter(Boolean).map(escapeText);
};

/** Names joined as a sender line: "A", "A and B", "A, B and C". */
export const joinNames = (names: readonly string[]): string => (names.length <= 1 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`);
