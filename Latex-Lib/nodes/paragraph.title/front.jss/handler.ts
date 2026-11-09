/**
 * front.jss (paragraph/title): the Journal of Statistical Software's title block (jss.cls v3.6), all in the preamble. The class
 * runs \maketitle itself at begindocument/end (jss.cls l.471) and then \let's it to \relax (l.325), so \title, \author and the
 * class's fields (\Plainauthor, \Plaintitle, \Shorttitle, \Keywords, \Plainkeywords, \Address, the masthead's \Volume ...
 * \DOI; \newcommand'd at l.81-116) must be set before \begin{document}; a field left unset keeps the class's placeholder
 * (l.117-140, 197: "Givenname Familyname", VV, YYYY, "at least one keyword is required"). The body gets nothing.
 * Source: Latex Related Research/Latex-lib-main/Source/0623-jss/jss.cls.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { dataOf } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, templateField } from '../node.ts';
import key from './key.ts';

/**
 * The text without markup, for the class's Plain fields (PDF metadata through \hypersetup, l.451-466): a \\ becomes a space, a
 * command name (\proglang, \emph) is dropped with its braces kept as text, and $ goes; an escaped character (\&, \%, \_) stays.
 */
export const plain = (s: string): string =>
  s
    // One pass, so an escaped brace (\{) is kept whole rather than losing its brace to the last alternative.
    .replace(/\\\\(?:\[[^\]]*\])?|\\[^A-Za-z@\s]|\\[A-Za-z@]+\*?\s*|[{}$]/gu, (m) => (m.startsWith('\\\\') ? ' ' : /^\\[^A-Za-z@\s]$/u.test(m) ? m : ''))
    .replace(/\s+/gu, ' ')
    .trim();

/**
 * templateSpecific.authorUrl as \url's argument: the raw text (url.sty prints it as it is, so General's text escapes would show),
 * with \, %, #, { and } escaped, as hyperref's \url needs them inside another command's argument (here \Address's).
 */
const urlOf = (node: Subject): string => {
  const ts = dataOf(node)['templateSpecific'];
  const v = ts !== null && typeof ts === 'object' ? (ts as { readonly [name: string]: unknown })['authorUrl'] : undefined;
  return typeof v === 'string' ? v.trim().replace(/[%#{}\\]/gu, (c) => `\\${c}`) : '';
};

export const declarations = (node: Subject, content: string, perRow: number): string => {
  const authors = authorsOf(node);
  const affiliations = affiliationsOf(node);
  const field = (name: string): string => templateField(node, name);
  const lines: string[] = [];

  // \author: one cell per author, "name\\affiliation", joined by \And; \AND starts a new row (jss.cls l.340-345, the \And and \AND
  // of \@maketitle, as NeurIPS's). The cell's second line is the affiliation's name (department and address go to \Address).
  if (authors.length > 0) {
    const row = Math.max(1, Math.floor(perRow));
    const cells = authors.map((a) => {
      const own = affiliationsOfAuthor(a, affiliations).map((f) => f.name || f.text);
      return own.length === 0 ? a.name : `${a.name}\\\\${own.join(', ')}`;
    });
    const joined = cells.map((c, i) => (i === 0 ? c : `${i % row === 0 ? '\\AND' : '\\And'} ${c}`)).join('\n  ');
    lines.push(`\\author{${joined}}`);
    lines.push(`\\Plainauthor{${authors.map((a) => plain(a.name)).join(', ')}}`);
  }

  // \title, with templateSpecific.titleNote as its \thanks (the class's \maketitle prints it in its fnsymbol footnote, l.303-309).
  const title = content.trim();
  const note = field('titleNote');
  lines.push(`\\title{${title}${note === '' ? '' : `\\thanks{${note}}`}}`);
  lines.push(`\\Plaintitle{${field('plainTitle') || plain(title)}}`);
  // Left out when empty: the class defaults it to the title (l.148-152).
  const short = field('shortTitle');
  if (short !== '') lines.push(`\\Shorttitle{${short}}`);

  // Left out when empty: the class then prints its "at least one keyword is required" placeholder (l.197), which shows what is missing.
  const keywords = field('keywords');
  if (keywords !== '') lines.push(`\\Keywords{${keywords}}`, `\\Plainkeywords{${plain(keywords)}}`);

  // \Address, printed by \makefooter at the end of the article (l.216-251, \AtEndDocument at l.251): per author the name, then each affiliation's
  // department, name and address, and "E-mail: \email{…}", each on a line; the first author also "URL: \url{…}" from
  // templateSpecific.authorUrl. Authors part by a blank line (\Address is a \long \newcommand).
  if (authors.length > 0) {
    const url = urlOf(node);
    const blocks = authors.map((a, i) => {
      const parts = [
        a.name,
        ...affiliationsOfAuthor(a, affiliations).flatMap((f) => [f.department, f.name, f.address].filter(Boolean)),
        ...(a.email === '' ? [] : [`E-mail: \\email{${a.email}}`]),
        ...(i === 0 && url !== '' ? [`URL: \\url{${url}}`] : []),
      ];
      return `  ${parts.join('\\\\\n  ')}`;
    });
    lines.push(`\\Address{\n${blocks.join('\n\n')}\n}`);
  }

  // The masthead and footer values (masthead l.257-266, footer l.237-242), when the paper gives them; else the class's VV, YYYY, II, yyyy-mm-dd.
  const masthead: readonly (readonly [string, string])[] = [
    ['Volume', 'volume'],
    ['Year', 'year'],
    ['Month', 'month'],
    ['Issue', 'issue'],
    ['Submitdate', 'submitted'],
    ['Acceptdate', 'accepted'],
    ['DOI', 'doi'],
  ];
  for (const [command, name] of masthead) {
    const v = field(name);
    if (v !== '') lines.push(`\\${command}{${v}}`);
  }
  // One string, not one declaration per line: the preamble's declarations are de-duplicated, and the order must hold.
  return lines.join('\n');
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const perRow = typeof p['authorsPerRow'] === 'number' ? p['authorsPerRow'] : 3;
  return {
    // The preamble is called with the node and its content (as front.achemso): the class's \maketitle reads it at \begin{document}.
    preamble: (_params, _parentType, node, content) => (node !== undefined && content !== undefined ? { declarations: [declarations(node, content, perRow)] } : {}),
    emit: () => '',
  };
};

export default realize;
