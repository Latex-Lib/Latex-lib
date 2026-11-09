/**
 * front.mdpi (paragraph/title). MDPI's title declarations (Definitions/mdpi.cls) as MDPI's template writes them
 * (Source/0894-mdpi/template.tex l.72-114, "template.tex" below): \Title, one \newcommand{\orcidauthorA}{iD} per author with an
 * ORCID, \Author{Name $^{1}$\orcidA{}, … and Name $^{1,2,}$*}, \AuthorNames, \address{$^{1}$ \quad …\\ $^{2}$ \quad …},
 * \corres{Correspondence: …}, \conference, \firstnote, \secondnote, \simplesumm, \keyword{…; …}, \PACS, \MSC and \JEL, all in the
 * preamble. The class prints them itself: it runs \maketitle, its affiliation block (\maketitlen) and its abstract and keyword
 * block (\abstractkeywords) once, after the preamble (mdpi.cls l.1319-1331), and then disables \maketitle, so the way writes
 * nothing where the title stands.
 * Not on CTAN: MDPI's own template (testing-pipeline/settings/classes/files/Definitions/mdpi.cls).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';
import type { TitleAuthor } from '../node.ts';
import key from './key.ts';

/** Whether an author is the one a field names, by e-mail or by name (both escaped alike). */
const names = (a: TitleAuthor, v: string): boolean => (a.email !== '' && a.email === v) || a.name === v;

/** Names as MDPI joins them: `A`, `A and B`, `A, B and C` (template.tex l.79, 84). */
const joined = (xs: readonly string[]): string => (xs.length <= 2 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1] ?? ''}`);

/** The class's ORCID macros go from \orcidA to \orcidZ (mdpi.cls l.778: \foreach \x in {A, ..., Z}). */
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const front = (node: Subject, content: string, long: boolean): string => {
  const field = (name: string): string => templateField(node, name);
  const set = (command: string, name: string): string[] => (field(name) !== '' ? [`${command}{${field(name)}}`] : []);
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  // One affiliation: \address[1]{…} with no number before it and none after the names (template.tex l.86, "Add [1] after
  // \address if there is only one affiliation"; mdpi.cls l.1149 then drops the hanging indent).
  const single = affiliations.length === 1;
  const corresponding = templateList(node, 'correspondingAuthor');
  const isCorresponding = (a: TitleAuthor): boolean => corresponding.some((v) => names(a, v));

  // ORCID iDs: \newcommand{\orcidauthorA}{iD} for each author who has one, lettered in order, and \orcidA{} after that
  // author's name (template.tex l.74-76). The 27th and later go without, as the class has no macro for them. An iD holds only
  // digits, hyphens and X; anything a macro body cannot hold is dropped.
  const orcids = new Map<TitleAuthor, string>();
  for (const a of authors) if (a.orcid !== '' && orcids.size < LETTERS.length) orcids.set(a, LETTERS[orcids.size] ?? '');
  const orcidLines = authors.flatMap((a) => (orcids.has(a) ? [`\\newcommand{\\orcidauthor${orcids.get(a) ?? ''}}{${a.orcid.replace(/[\\{}%#\s]/gu, '')}}`] : []));

  // Each name with its affiliations' numbers as a superscript, the corresponding author's closed by `,` and followed by `*`
  // (template.tex l.79: Firstname Lastname $^{2,}$*), then the ORCID logo.
  const person = (a: TitleAuthor): string => {
    const numbers = single ? [] : affiliationsOfAuthor(a, affiliations).map((f) => affiliationNumber(f, affiliations));
    const star = isCorresponding(a);
    const mark = numbers.length > 0 ? ` $^{${numbers.join(',')}${star ? ',' : ''}}$${star ? '*' : ''}` : star ? ' *' : '';
    return `${a.name}${mark}${orcids.has(a) ? `${mark === '' ? ' ' : ''}\\orcid${orcids.get(a) ?? ''}{}` : ''}`;
  };

  // Each affiliation on its line: its number and \quad, "Department, Institution, Address", and the e-mails of the authors
  // whose first affiliation it is (template.tex l.87-89: $^{1}$ \quad Affiliation 1; e-mail@e-mail.com).
  const address = affiliations.map((f) => {
    const emails = authors.filter((a) => a.email !== '' && affiliationsOfAuthor(a, affiliations)[0]?.id === f.id).map((a) => a.email);
    const text = [f.text, ...emails].join('; ');
    return single ? text : `$^{${affiliationNumber(f, affiliations)}}$ \\quad ${text}`;
  });

  // The correspondence line: the paper's own, or "Correspondence: " and the corresponding authors' e-mails (template.tex l.92).
  // The class prints it only under its moreauthors option (mdpi.cls l.1157), the template's class line's.
  const correspondence =
    field('correspondence') ||
    (() => {
      const emails = authors.filter((a) => isCorresponding(a) && a.email !== '').map((a) => a.email);
      return emails.length > 0 ? `Correspondence: ${emails.join('; ')}` : '';
    })();
  const keywords = templateList(node, 'keywords');
  return [
    `\\Title{${content.trim()}}`,
    ...orcidLines,
    ...(authors.length > 0 ? [`\\Author{${joined(authors.map(person))}}`] : []),
    // A long author list: the class sets the names across the full width, beside the left column (mdpi.cls l.943-970).
    ...(long ? ['\\longauthorlist{yes}'] : []),
    // The plain names for the PDF's author field (template.tex l.84; mdpi.cls l.563 pdfauthor).
    ...(authors.length > 0 ? [`\\AuthorNames{${joined(authors.map((a) => a.name))}}`] : []),
    ...(address.length > 0 ? [single ? `\\address[1]{${address[0] ?? ''}}` : `\\address{%\n${address.join('\\\\\n')}}`] : []),
    ...(correspondence !== '' ? [`\\corres{${correspondence}}`] : []),
    // "This paper is an extended version of our paper published in …" (template.tex l.103; mdpi.cls l.1163-1166).
    ...set('\\conference', 'conference'),
    // A current address or shared authorship, marked † and ‡ by the class (template.tex l.94-99; mdpi.cls l.1168-1177).
    ...set('\\firstnote', 'firstNote'),
    ...set('\\secondnote', 'secondNote'),
    ...set('\\simplesumm', 'simpleSummary'),
    // Keywords separated by semicolons (template.tex l.108-109), printed after the abstract (mdpi.cls l.1277-1281).
    ...(keywords.length > 0 ? [`\\keyword{${keywords.join('; ')}}`] : []),
    // Classification codes, left out when the paper has none (template.tex l.111-114).
    ...set('\\PACS', 'pacs'),
    ...set('\\MSC', 'msc'),
    ...set('\\JEL', 'jel'),
  ].join('\n');
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    // One declaration, so the de-duplicated preamble keeps the ORCID macros before \Author and the lines in order.
    preamble: (_params, _parentType, node, content) =>
      node !== undefined && content !== undefined ? { declarations: [front(node, content, param(p, 'longAuthorList', 'no') === 'yes')] } : {},
    // Nothing where the title stands: the class has printed the title block after the preamble and disabled \maketitle
    // (mdpi.cls l.1319-1325: \maketitle \let\maketitle\relax \maketitlen … \abstractkeywords).
    emit: () => '',
  };
};

export default realize;
