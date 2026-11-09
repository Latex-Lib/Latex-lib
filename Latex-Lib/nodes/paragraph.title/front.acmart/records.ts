/**
 * front.acmart's readers for the title's template record (`data.templateSpecific`) where a value has parts that node.ts's
 * templateList cannot keep: an author note that names its author, a CCS concept with its significance and its General~Specific
 * path, a received date with its kind. Each takes a list (of records or strings) or one string split at semicolons or line
 * ends, never at commas, which notes, concepts and dates hold. Every text comes back LaTeX-escaped, as node.ts's readers give it.
 */
import { dataOf, escapeText } from '../../protocol.ts';
import type { Subject } from '../../../schema/realization.ts';

const record = (v: unknown): { readonly [name: string]: unknown } => (v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as { readonly [name: string]: unknown }) : {});
const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(v) : '');

/** The field's entries: a list as it is, a string split at semicolons and line ends. */
const entries = (node: Subject, name: string): unknown[] => {
  const v = record(dataOf(node)['templateSpecific'])[name];
  return Array.isArray(v) ? v : typeof v === 'string' ? v.split(/[;\n]/u) : [];
};

/** `label: value` (a kind, a significance, an author before a colon), or the whole string as the value. */
const labelled = (s: string): { readonly label: string; readonly value: string } => {
  const m = /^([^:]{1,60}):\s*(.+)$/u.exec(s);
  return m ? { label: (m[1] ?? '').trim(), value: (m[2] ?? '').trim() } : { label: '', value: s };
};

/** Author notes: `{author, text}` records or `Author: text` strings; `author` is a name or an e-mail, '' when none is given. */
export const authorNotesOf = (node: Subject): { readonly author: string; readonly text: string }[] =>
  entries(node, 'authorNotes')
    .map((e) => (typeof e === 'string' ? labelled(e.trim()) : { label: str(record(e)['author']), value: str(record(e)['text']) }))
    .filter((n) => n.value !== '')
    .map((n) => ({ author: escapeText(n.label), text: escapeText(n.value) }));

/**
 * CCS concepts: `{significance, concept}` records or `500: General~Specific` strings. The path's parts are escaped one by one and
 * joined by acmart's `~` (\ccsdesc@parse splits at it, acmart.dtx l.6037), which escapeText would turn into a printed tilde; a
 * path written with → or > is read the same.
 */
export const ccsConceptsOf = (node: Subject): { readonly significance: string; readonly concept: string }[] =>
  entries(node, 'ccsConcepts')
    .map((e) => {
      const { label, value } = typeof e === 'string' ? labelled(e.trim()) : { label: str(record(e)['significance']), value: str(record(e)['concept']) };
      const significance = /^\d+$/u.test(label) ? label : '';
      return { significance, concept: (significance === '' && label !== '' ? `${label}: ${value}` : value).split(/\s*(?:~|→|->|>)\s*/u).filter(Boolean).map(escapeText).join('~') };
    })
    .filter((c) => c.concept !== '');

/** Received dates: `{kind, date}` records or `revised: 12 March 2026` strings; the first unlabelled one is the received date. */
export const receivedOf = (node: Subject): { readonly kind: string; readonly date: string }[] =>
  entries(node, 'received')
    .map((e) => (typeof e === 'string' ? labelled(e.trim()) : { label: str(record(e)['kind']), value: str(record(e)['date']) }))
    .filter((r) => r.value !== '')
    .map((r) => ({ kind: escapeText(r.label), date: escapeText(r.value) }));

/** A URL for a macro pvldb.sty hands to \url: kept as written but for the characters a macro body cannot hold (# % \ { }). */
export const urlOf = (node: Subject, name: string): string =>
  str(record(dataOf(node)['templateSpecific'])[name]).replace(/[\\{}]/gu, '').replace(/[#%]/gu, (c) => `\\${c}`);
