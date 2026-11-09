/**
 * front.lipics's readers for the title's template record (`data.templateSpecific`) where a value has parts that node.ts's
 * templateList cannot keep: a CCS concept with its significance and its General~Specific path, and an author's own funding
 * line naming its author. Each takes a list (of records or strings) or one string split at semicolons or line ends, never at
 * commas, which concepts and funding lines hold. Every text comes back LaTeX-escaped, as node.ts's readers give it.
 * (The same reading as front.acmart's records.ts, kept here so the two ways do not import each other.)
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

/** `label: value` (a significance, an author before a colon), or the whole string as the value. */
const labelled = (s: string): { readonly label: string; readonly value: string } => {
  const m = /^([^:]{1,60}):\s*(.+)$/u.exec(s);
  return m ? { label: (m[1] ?? '').trim(), value: (m[2] ?? '').trim() } : { label: '', value: s };
};

/**
 * CCS concepts: `{significance, concept}` records or `500: General~Specific` strings. The path's parts are escaped one by one and
 * joined by `~`, which LIPIcs's \ccsdesc prints as its arrow between the levels (Latex-Template-Examples/class.lipics/main.tex l.67-68: \ccsdesc[500]{Theory of
 * computation~Design and analysis of algorithms}); escapeText would turn it into a printed tilde. A path written with → or > is
 * read the same.
 */
export const ccsConceptsOf = (node: Subject): { readonly significance: string; readonly concept: string }[] =>
  entries(node, 'ccsConcepts')
    .map((e) => {
      const { label, value } = typeof e === 'string' ? labelled(e.trim()) : { label: str(record(e)['significance']), value: str(record(e)['concept']) };
      const significance = /^\d+$/u.test(label) ? label : '';
      return { significance, concept: (significance === '' && label !== '' ? `${label}: ${value}` : value).split(/\s*(?:~|→|->|>)\s*/u).filter(Boolean).map(escapeText).join('~') };
    })
    .filter((c) => c.concept !== '');

/**
 * An author's own funding (LIPIcs's fifth \author argument, "(Optional) author-specific funding acknowledgements"): `{author, text}`
 * records or `Author: text` strings, `author` a name or an e-mail. Flouest's author records have no funding field, so it is one
 * templateSpecific list naming its authors, as acmart's author notes are.
 */
export const authorFundingOf = (node: Subject): { readonly author: string; readonly text: string }[] =>
  entries(node, 'authorFunding')
    .map((e) => (typeof e === 'string' ? labelled(e.trim()) : { label: str(record(e)['author']), value: str(record(e)['text']) }))
    .filter((n) => n.label !== '' && n.value !== '')
    .map((n) => ({ author: escapeText(n.label), text: escapeText(n.value) }));
