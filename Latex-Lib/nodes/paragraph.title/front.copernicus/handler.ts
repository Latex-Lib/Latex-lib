/**
 * front.copernicus (paragraph/title). Copernicus Publications' own title block (copernicus.cls), all at the title's place
 * before \maketitle, in template.tex's order (l.85-126): \title, one \Author[affiliation numbers][email]{given}{surname}
 * per author (the email only on the corresponding authors), one \affil[n]{…} per affiliation, then \deceased[date]{author
 * numbers} and \equalcontrib{author numbers} at the end of the affiliations, \correspondence when the line is given,
 * \runningtitle and \runningauthor (always), \keywords, then \maketitle. The abstract follows \maketitle, as in the template.
 * CTAN: https://ctan.org/pkg/copernicus
 */
import type { Realization, Subject } from '../../../schema/realization.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';
import { namedAuthors, nameParts } from './records.ts';

const front = (node: Subject, content: string): string => {
  const title = content.trim();
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  const lines: string[] = [`\\title{${title}}`];
  // The corresponding authors (templateSpecific.correspondingAuthor: names, emails or author numbers), else the first author
  // with an email, as template.tex marks the first \Author "%% correspondence author" (l.90). Only they carry their email: the
  // class lists every \Author with a second optional argument on the "Correspondence:" line, "Given Surname (email)"
  // (copernicus.cls l.1688-1741, 2606-2621), and prints no line when none has one (l.702, 825).
  const named = namedAuthors(templateList(node, 'correspondingAuthor'), authors).map((n) => n.number);
  const firstWithEmail = authors.findIndex((a) => a.email !== '') + 1;
  const corresponding = named.length > 0 ? named : firstWithEmail > 0 ? [firstWithEmail] : [];
  authors.forEach((a, i) => {
    // \Author[1,2][email]{given}{surname} (l.1683-1742) passes the numbers to the class's \author[affil] (l.1583), which marks
    // the name with them; the numbers are the author's affiliations' in the title's list, as \affil[n] below gives them.
    const numbers = affiliationsOfAuthor(a, affiliations).map((f) => affiliationNumber(f, affiliations));
    const { given, surname } = nameParts(a.name);
    const email = corresponding.includes(i + 1) ? a.email : '';
    lines.push(`\\Author[${numbers.join(',')}]${email === '' ? '' : `[${email}]`}{${given}}{${surname}}`);
  });
  // \affil[n]{…} (l.1629-1657): the department, the name and the address on one line, joined by commas.
  for (const f of affiliations) lines.push(`\\affil[${affiliationNumber(f, affiliations)}]{${[f.department, f.name, f.address].filter(Boolean).join(', ')}}`);
  // The deceased authors (templateSpecific.deceased: a name, email or author number, with the date after a colon) and those who
  // contributed equally (templateSpecific.equalContribution), "at the end of the affiliations" (template.tex l.96-101): each
  // \deceased adds a ribbon note to the affiliation list, \equalcontrib one star note for all (copernicus.cls l.1666-1680).
  // Both write the author numbers to the .aux, so the marks by the names appear from the second run (l.1659-1665, 1592-1593).
  for (const d of namedAuthors(templateList(node, 'deceased'), authors)) lines.push(`\\deceased${d.note === '' ? '' : `[${d.note}]`}{${d.number}}`);
  const equal = namedAuthors(templateList(node, 'equalContribution'), authors).map((n) => n.number);
  if (equal.length > 0) lines.push(`\\equalcontrib{${equal.join(',')}}`);
  // \correspondence{…} replaces the line the class builds from \Author (l.2624); the class prints it only when some \Author
  // carries an email (corr@cnt > 0, l.702, 825).
  const correspondence = templateField(node, 'correspondence');
  if (correspondence !== '') lines.push(`\\correspondence{${correspondence}}`);
  // Always written: \maketitle stops with \UndefinedError{\runningtitle} or {\runningauthor} when either is empty (l.551-553,
  // 603). The short author list falls back to the class's convention: one surname, two joined by "and", else "et al.".
  const surnames = authors.map((a) => nameParts(a.name).surname);
  const runningAuthor = templateField(node, 'runningAuthor') || (surnames.length > 2 ? `${surnames[0]} et al.` : surnames.join(' and '));
  lines.push(`\\runningtitle{${templateField(node, 'shortTitle') || title}}`, `\\runningauthor{${runningAuthor}}`);
  // \keywords{…} in the final stage only stores them (l.2671-2676): the manuscript layout prints "Keywords." under the
  // abstract (l.1210-1214; typeset, see the key), the other layouts as a title-page item (l.855). In a discussion-stage paper
  // the class would print them where they stand (l.2677-2682); the copernicus setting is final (acp).
  const keywords = templateList(node, 'keywords');
  if (keywords.length > 0) lines.push(`\\keywords{${keywords.join(', ')}}`);
  return lines.join('\n');
};

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  // Everything in the body at the title's place, as template.tex writes it after \begin{document} (l.83-121); the class's
  // \maketitle (l.568-603) prints the authors, the affiliation list and the correspondence line.
  preamble: () => ({}),
  emit: (node, content) => `${front(node, content)}\n\\maketitle\n\n`,
});

export default realize;
