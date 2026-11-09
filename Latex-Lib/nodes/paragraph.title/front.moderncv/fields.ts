/**
 * front.moderncv's readers of the title's template record (`data.templateSpecific`), for the values a CV's personal data
 * holds that the shared readers (`templateField`, `templateList` in ../node.ts) cannot give: lines (an address, a
 * recipient's address), typed entries (phones, social accounts) and file names (a photo, a signature), which must not be
 * escaped.
 */
import { dataOf, escapeText } from '../../protocol.ts';
import type { Subject } from '../../../schema/realization.ts';

const record = (v: unknown): { readonly [name: string]: unknown } => (v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as { readonly [name: string]: unknown }) : {});
const raw = (node: Subject, name: string): unknown => record(dataOf(node)['templateSpecific'])[name];

/** A field that holds lines: a list item by item, a string split at its line breaks; each escaped. */
export const templateLines = (node: Subject, name: string): string[] => {
  const v = raw(node, name);
  const items = Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : typeof v === 'string' ? v.split(/\r\n?|\n/u) : [];
  return items.map((x) => x.trim()).filter(Boolean).map(escapeText);
};

/**
 * Typed entries (`phone`: mobile, fixed, fax; `social`: github, orcid, linkedin…), each as { type, value }, escaped. A list of
 * records ({ type, number } or { kind, handle }, or any one-key { github: 'jdoe' }), a record of kind to value, or strings
 * "type: value" (one per item, or one string split at semicolons and line breaks); a string with no known type has none.
 */
export const templateEntries = (node: Subject, name: string, types: readonly string[] | 'any'): { readonly type: string; readonly value: string }[] => {
  const v = raw(node, name);
  const known = (t: string): boolean => /^[a-z][a-z0-9]*$/u.test(t) && (types === 'any' || types.includes(t));
  const fromString = (s: string): { type: string; value: string } => {
    const m = /^\s*([A-Za-z][A-Za-z0-9]*)\s*:\s*(.+)$/u.exec(s);
    return m !== null && known(m[1]!.toLowerCase()) && !/^\/\//u.test(m[2]!) ? { type: m[1]!.toLowerCase(), value: m[2]!.trim() } : { type: '', value: s.trim() };
  };
  const fromRecord = (r: { readonly [name: string]: unknown }): { type: string; value: string }[] => {
    const type = [r['type'], r['kind']].find((x): x is string => typeof x === 'string');
    const value = [r['number'], r['handle'], r['value'], r['account']].find((x): x is string => typeof x === 'string');
    if (value !== undefined) return [{ type: type !== undefined && known(type.trim().toLowerCase()) ? type.trim().toLowerCase() : '', value: value.trim() }];
    return Object.entries(r).filter((e): e is [string, string] => typeof e[1] === 'string' && known(e[0].toLowerCase())).map(([k, x]) => ({ type: k.toLowerCase(), value: x.trim() }));
  };
  const entries = Array.isArray(v)
    ? v.flatMap((x) => (typeof x === 'string' ? [fromString(x)] : fromRecord(record(x))))
    : typeof v === 'string'
      ? v.split(/[;\r\n]+/u).map(fromString)
      : fromRecord(record(v));
  return entries.filter((e) => e.value !== '').map((e) => ({ type: e.type, value: escapeText(e.value) }));
};

/** A file name (a photo, a signature image) as \includegraphics takes it: unescaped, with no TeX specials, or ''. */
export const templateFile = (node: Subject, name: string): string => {
  const v = raw(node, name);
  return typeof v === 'string' ? v.trim().replace(/[\\{}%#&$^~]/gu, '') : '';
};
