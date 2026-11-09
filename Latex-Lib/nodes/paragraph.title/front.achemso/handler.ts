/**
 * front.achemso (paragraph/title): achemso's title block, all in the preamble. Every command the class's title reads is
 * \@onlypreamble (\title l.788, \author l.832, \affiliation l.880, \altaffiliation l.1021, \email l.1069, \fax l.1084,
 * \phone l.1093, \abbreviations l.1108, \keywords l.1113 of achemso.dtx), and the class appends \maketitle to \document
 * (l.1823), so the title is set at \begin{document} and a \maketitle in the body prints nothing. The body gets nothing.
 * CTAN: https://ctan.org/pkg/achemso
 */
import type { Realization, Subject } from '../../../schema/realization.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, type TitleAuthor } from '../node.ts';

/**
 * The corresponding authors, whom achemso stars by their \email (achemso-demo.tex l.33-35): those templateSpecific.correspondingAuthor
 * names (by e-mail or by name), else every author with an e-mail.
 */
const correspondingOf = (node: Subject, authors: readonly TitleAuthor[]): readonly TitleAuthor[] => {
  const named = templateField(node, 'correspondingAuthor');
  const withEmail = authors.filter((a) => a.email !== '');
  return named === '' ? withEmail : withEmail.filter((a) => a.email === named || a.name === named);
};

/**
 * The declarations, in achemso's order (achemso-demo.tex l.50-89): per author \author, then for a corresponding author \email
 * (and, for the first, \phone and \fax from templateSpecific), then the author's first affiliation as \affiliation[short]{full}
 * and each further one as \alsoaffiliation[short]{full}. An \affiliation applies to every earlier author with none yet, and the
 * class drops a repeat of a text it has (\acs@affil@ifdup, l.860-880), so one per author is safe. Then \title[short]{…},
 * \abbreviations and \keywords. No \and or \thanks (both only warn, l.839-850), no \date, no ORCID (the class has no command).
 * One string, not one declaration per line: the preamble's declarations are de-duplicated, and two authors' equal
 * \affiliation lines must both stay, in order.
 */
export const declarations = (node: Subject, content: string): string => {
  const authors = authorsOf(node);
  const affiliations = affiliationsOf(node);
  const corresponding = correspondingOf(node, authors);
  const [phone, fax] = [templateField(node, 'correspondingPhone'), templateField(node, 'correspondingFax')];
  const lines: string[] = [];
  for (const a of authors) {
    lines.push(`\\author{${a.name}}`);
    if (corresponding.includes(a)) {
      lines.push(`\\email{${a.email}}`);
      if (a === corresponding[0]) lines.push(...(phone === '' ? [] : [`\\phone{${phone}}`]), ...(fax === '' ? [] : [`\\fax{${fax}}`]));
    }
    affiliationsOfAuthor(a, affiliations).forEach((f, i) => {
      // The short name in braces, so a ] in it does not end the optional argument.
      lines.push(`\\${i === 0 ? 'affiliation' : 'alsoaffiliation'}[{${f.name === '' ? f.text : f.name}}]{${f.text}}`);
    });
  }
  const short = templateField(node, 'shortTitle');
  lines.push(`\\title${short === '' ? '' : `[{${short}}]`}{${content.trim()}}`);
  const abbreviations = templateField(node, 'abbreviations', ',');
  const keywords = templateField(node, 'keywords');
  if (abbreviations !== '') lines.push(`\\abbreviations{${abbreviations}}`);
  if (keywords !== '') lines.push(`\\keywords{${keywords}}`);
  return lines.join('\n');
};

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  // The preamble is called with the node and its content for a declaration that carries the title (as abs.class-native's command form).
  preamble: (_params, _parentType, node, content) => (node !== undefined && content !== undefined ? { declarations: [declarations(node, content)] } : {}),
  emit: () => '',
});

export default realize;
