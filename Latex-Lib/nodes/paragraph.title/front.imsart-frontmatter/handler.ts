/**
 * front.imsart-frontmatter (paragraph/title). The IMS front matter (imsart, aos and its sister journals), all at the title's
 * place inside \begin{frontmatter} … \end{frontmatter}, which prints it (imsart.sty l.2426-2452, as the requirement document
 * reads it): \title and \runtitle, the aug environment with \author[A]{\fnms{…}~\snm{…}\ead[label=e1]{…}\orcid{…}} and
 * one \address[A]{\orgdiv{…},\orgname{…}\printead[presep={,\ }]{e1}} per affiliation used, then the MSC2020 keyword
 * environment with \kwd[Primary ] and \kwd[; secondary ] groups and the keyword environment of \kwd's.
 * The macro names are aos-template.tex's (template l.63-110, read through Template/template-requirement/IMS_Imsart.md); the
 * class files are not in this repository, so they are not yet checked against imsart.sty itself.
 * The IMS distributes imsart itself (not in the engine's package mirror).
 */
import type { Realization, Subject } from '../../../schema/realization.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';

/** The address label of the n-th affiliation (1-based): A, B, …, Z, then A1, B1, … */
const letter = (n: number): string => `${String.fromCharCode(65 + ((n - 1) % 26))}${n > 26 ? Math.floor((n - 1) / 26) : ''}`;

/** \fnms{given names}~\snm{surname}: the last word is the surname; a one-word name is a surname alone. */
const nameOf = (name: string): string => {
  const words = name.split(/\s+/u);
  const surname = words.pop() ?? name;
  return words.length === 0 ? `\\snm{${surname}}` : `\\fnms{${words.join(' ')}}~\\snm{${surname}}`;
};

const front = (node: Subject, content: string): string => {
  const title = content.trim();
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  const lines: string[] = ['\\begin{frontmatter}', `\\title{${title}}`, `\\runtitle{${templateField(node, 'shortTitle') || title}}`];
  // "Only one address is permitted per author" (template l.73-80; the AoS page: one affiliation per author, department and
  // university only): each author's first affiliation; further ones belong in the Acknowledgments. The address keeps the
  // division and the organisation, not the postal address.
  const firstOf = authors.map((a) => affiliationsOfAuthor(a, affiliations)[0]);
  const used = affiliations.filter((f) => firstOf.some((g) => g?.id === f.id));
  const labelOf = (id: string): string => letter(used.findIndex((f) => f.id === id) + 1);
  if (authors.length > 0) {
    lines.push('\\begin{aug}');
    // \author[A]{\fnms{…}~\snm{…}\ead[label=e1]{…}\orcid{…}}, separated by commas and \and before the last (template l.70-84, as the requirement document cites it).
    // One ORCID at most per author (imsart.sty l.944).
    const entries = authors.map((a, i) => {
      const f = firstOf[i];
      const ead = a.email === '' ? '' : `\\ead[label=e${i + 1}]{${a.email}}`;
      const orcid = a.orcid === '' ? '' : `\\orcid{${a.orcid}}`;
      return `\\author${f === undefined ? '' : `[${labelOf(f.id)}]`}{${nameOf(a.name)}${ead}${orcid}}`;
    });
    lines.push(entries.length > 1 ? `${entries.slice(0, -1).join(',\n')}\n\\and\n${entries[entries.length - 1]}` : entries[0]!);
    // \address[A]{\orgdiv{…},\orgname{…}\printead[presep={,\ }]{e1,e2}}: the emails of the authors at that address follow it.
    for (const f of used) {
      const parts = [...(f.department === '' ? [] : [`\\orgdiv{${f.department}}`]), ...(f.name === '' ? [] : [`\\orgname{${f.name}}`])];
      const emails = authors.flatMap((a, i) => (firstOf[i]?.id === f.id && a.email !== '' ? [`e${i + 1}`] : []));
      lines.push(`\\address[${labelOf(f.id)}]{${parts.join(',')}${emails.length === 0 ? '' : `\\printead[presep={,\\ }]{${emails.join(',')}}`}}`);
    }
    lines.push('\\end{aug}');
  }
  // The MSC2020 codes, primary then secondary, and the keywords: printed by the front matter as a first-page footnote under
  // fixed labels (imsart.sty l.2457-2479, 3412-3414), so they must sit inside it (template l.99-108).
  const primary = templateList(node, 'mscPrimary');
  const secondary = templateList(node, 'mscSecondary');
  if (primary.length > 0 || secondary.length > 0) {
    lines.push(
      '\\begin{keyword}[class=MSC2020]',
      ...primary.map((k, i) => (i === 0 ? `\\kwd[Primary ]{${k}}` : `\\kwd{${k}}`)),
      ...secondary.map((k, i) => (i === 0 ? `\\kwd[${primary.length > 0 ? '; secondary ' : 'Secondary '}]{${k}}` : `\\kwd{${k}}`)),
      '\\end{keyword}',
    );
  }
  const keywords = templateList(node, 'keywords');
  if (keywords.length > 0) lines.push('\\begin{keyword}', ...keywords.map((k) => `\\kwd{${k}}`), '\\end{keyword}');
  lines.push('\\end{frontmatter}');
  return lines.join('\n');
};

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  // Everything goes in the body at the title's place, as aos-template.tex writes it. \end{frontmatter} prints the front matter
  // (imsart.sty l.1944-1988, 2426-2452), so no \maketitle follows. An abstract written after it is lost unless its way prints it
  // in place (abs.abstract-pkg; abs.kernel and abs.class-native are denied under imsart for that reason).
  preamble: () => ({}),
  emit: (node, content) => `${front(node, content)}\n\n`,
});

export default realize;
