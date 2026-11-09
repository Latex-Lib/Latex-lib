/**
 * front.sn-jnl's reader for the one template field node.ts's templateField and templateList do not shape: the subject
 * classifications, each a scheme ("MSC Classification", "JEL Classification", "PACS") with its codes, one \pacs[scheme]{codes}
 * each (sn-article.tex's \pacs lines; requirement document line 65). Every text is LaTeX text, escaped as General escapes it.
 */
import type { Subject } from '../../../schema/realization.ts';
import { dataOf, escapeText } from '../../protocol.ts';

export type SubjectClass = { readonly scheme: string; readonly codes: string };

const record = (v: unknown): { readonly [name: string]: unknown } => (v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as { readonly [name: string]: unknown }) : {});
const codesOf = (v: unknown): string =>
  typeof v === 'string' ? escapeText(v.trim()) : Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '').map((x) => escapeText(x.trim())).join(', ') : '';

/** "Scheme: codes" as one group; with no colon the codes alone, under no scheme. */
const entry = (s: string): SubjectClass => {
  const at = s.indexOf(':');
  return at > 0 ? { scheme: escapeText(s.slice(0, at).trim()), codes: escapeText(s.slice(at + 1).trim()) } : { scheme: '', codes: escapeText(s.trim()) };
};

/**
 * `templateSpecific.subjectClasses`: an object of scheme to codes (a string, or a list joined by ', '), a list of
 * "Scheme: codes" strings, or one string of such groups separated by semicolons or new lines. Groups with no codes are left out.
 */
export const subjectClassesOf = (node: Subject): SubjectClass[] => {
  const v = record(dataOf(node)['templateSpecific'])['subjectClasses'];
  const groups: SubjectClass[] =
    typeof v === 'string'
      ? v.split(/\r\n?|\n|;/u).filter((s) => s.trim() !== '').map(entry)
      : Array.isArray(v)
        ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '').map(entry)
        : Object.entries(record(v)).map(([scheme, codes]) => ({ scheme: escapeText(scheme.trim()), codes: codesOf(codes) }));
  return groups.filter((g) => g.codes !== '');
};
