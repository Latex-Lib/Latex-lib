/**
 * front.cas's readers for the template fields node.ts's templateField and templateList do not shape: the highlights (one
 * sentence each, so a string is not split at its commas) and the CRediT roles per author. Every text is LaTeX text,
 * escaped as General escapes it.
 */
import type { Subject } from '../../../schema/realization.ts';
import { dataOf, escapeText } from '../../protocol.ts';

const record = (v: unknown): { readonly [name: string]: unknown } => (v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as { readonly [name: string]: unknown }) : {});
const field = (node: Subject, name: string): unknown => record(dataOf(node)['templateSpecific'])[name];
const strings = (v: readonly unknown[]): string[] => v.filter((x): x is string => typeof x === 'string').map((x) => x.trim()).filter(Boolean);

/** `templateSpecific.highlights`: a list as it is, a string one highlight per line (or per semicolon). */
export const highlightsOf = (node: Subject): string[] => {
  const v = field(node, 'highlights');
  return (Array.isArray(v) ? strings(v) : typeof v === 'string' ? strings(v.split(/\r\n?|\n|;/u)) : []).map(escapeText);
};

/**
 * `templateSpecific.creditRoles` for one author (by the escaped name authorsOf gives): an object of name to roles (a string
 * or a list, joined by ', '), or a list of "Name: roles" strings. '' when the author has none.
 */
export const creditOf = (node: Subject, name: string): string => {
  const v = field(node, 'creditRoles');
  const roles = (r: unknown): string => (typeof r === 'string' ? escapeText(r.trim()) : Array.isArray(r) ? strings(r).map(escapeText).join(', ') : '');
  if (Array.isArray(v)) {
    for (const entry of strings(v)) {
      const at = entry.indexOf(':');
      if (at > 0 && escapeText(entry.slice(0, at).trim()) === name) return escapeText(entry.slice(at + 1).trim());
    }
    return '';
  }
  for (const [who, r] of Object.entries(record(v))) if (escapeText(who.trim()) === name) return roles(r);
  return '';
};
