/**
 * front.elsarticle-frontmatter's readers for the template fields node.ts's templateField and templateList do not shape:
 * the highlights (one sentence each, so a string is not split at its commas) and the graphical abstract (an image's path,
 * which must reach \includegraphics unescaped, or a sentence). Every text is LaTeX text, escaped as General escapes it.
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

/** An image file's path: what \includegraphics takes, and what the graphical abstract usually is (template: `\includegraphics{grabs}`). */
const IMAGE = /^[^\s{}%#\\]+\.(png|jpe?g|pdf|eps)$/iu;

/**
 * `templateSpecific.graphicalAbstract` as the body of the graphicalabstract environment: an image's path becomes
 * `\includegraphics[width=\linewidth]{path}` (graphicx is preloaded by elsarticle, elsarticle.dtx l.181), anything else is printed as
 * text. '' when there is none.
 */
export const graphicalAbstractOf = (node: Subject): string => {
  const v = field(node, 'graphicalAbstract');
  if (typeof v !== 'string' || v.trim() === '') return '';
  const value = v.trim();
  return IMAGE.test(value) ? `\\includegraphics[width=\\linewidth]{${value}}` : escapeText(value);
};
