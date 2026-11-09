/**
 * front.iopjournal (paragraph/title). IOP Publishing's journal title block as its template writes it (iopjournal-template.tex
 * l.10-24): \articletype, \title, one \author line with each author's affiliation numbers ($^{1,2}$), a star for the
 * corresponding author and \orcid{…}, one \affil{$^n$…} per affiliation and the star's note, \email and \keywords, all
 * typeset where they stand, with no \maketitle.
 */
import type { Realization } from '../../../schema/realization.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';

/** 'A', 'A and B', 'A, B and C': the template's author line (l.14), no comma before 'and'. */
const joinNames = (names: readonly string[]): string =>
  names.length <= 2 ? names.join(' and ') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1] ?? ''}`;

export const realize = (): Realization => ({
  // iopjournal's \title, \author, \affil, \email and \keywords typeset their argument at once (iopjournal.cls l.98-118): in the
  // preamble they stop at 'Missing \begin{document}' (the iopjournal profile), so nothing goes there.
  preamble: () => ({}),
  emit: (node, content) => {
    const affiliations = affiliationsOf(node);
    const authors = authorsOf(node);
    // The corresponding author, named by email or name; a value that names no author but is an email is still the \email line.
    const wanted = templateField(node, 'correspondingAuthor');
    const corresponding = wanted === '' ? undefined : authors.find((a) => (a.email !== '' && a.email === wanted) || a.name === wanted);
    const email = corresponding !== undefined ? corresponding.email : wanted.includes('@') ? wanted : '';
    const names = authors.map((a) => {
      const marks = [...affiliationsOfAuthor(a, affiliations).map((f) => String(affiliationNumber(f, affiliations))), ...(a === corresponding ? ['*'] : [])];
      // \orcid is the class's ORCID icon linked to orcid.org (l.183); the id is not escaped: it goes into a URL.
      return `${a.name}${marks.length > 0 ? `$^{${marks.join(',')}}$` : ''}${a.orcid !== '' ? `\\orcid{${a.orcid}}` : ''}`;
    });
    const keywords = templateList(node, 'keywords');
    return `${[
      // \articletype also prints the class's journal-name line and its Crossmark/RECEIVED margin note (l.93-96), so it is written
      // with an empty type when the paper gives none.
      `\\articletype{${templateField(node, 'articleType')}}`,
      `\\title{${content.trim()}}`,
      ...(names.length > 0 ? [`\\author{${joinNames(names)}}`] : []),
      ...affiliations.map((f) => `\\affil{$^{${affiliationNumber(f, affiliations)}}$${f.text}}`),
      ...(corresponding !== undefined ? ['\\affil{$^{*}$Author to whom any correspondence should be addressed.}'] : []),
      ...(email !== '' ? [`\\email{${email}}`] : []),
      ...(keywords.length > 0 ? [`\\keywords{${keywords.join(', ')}}`] : []),
      // One paragraph each, as the template's blank lines make them (l.10-24): the class's \affil and \keywords end no paragraph
      // (l.108-118), so two lines in a row would run together.
    ].join('\n\n')}\n\n`;
  },
});

export default realize;
