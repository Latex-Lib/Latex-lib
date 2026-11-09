/**
 * front.lipics (paragraph/title). The LIPIcs title block (lipics-v2021) as the series' template writes it (Latex-Template-Examples/class.lipics/main.tex, "main.tex" below, l.56-96; LIPIcs.md l.41-44):
 * \title, \titlerunning, one five-argument \author{name}{affiliations joined by \and}{email}{ORCID}{funding} per author,
 * \authorrunning, \Copyright, the ACM 2012 classification (\ccsdesc[500]{General~Specific}), \keywords, \category,
 * \relatedversion, \supplement, \funding and \ArticleNo in the preamble, and the class's \maketitle where the title stands.
 * The class prints the classification, keywords, category, related version, supplement and funding at the end of the abstract
 * (LIPIcs.md l.53: lipics-v2021.cls l.418-468), so they must be stored before \end{abstract}: the preamble serves.
 * CTAN: https://ctan.org/pkg/lipics
 */
import type { Realization, Subject } from '../../../schema/realization.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';
import type { TitleAuthor } from '../node.ts';
import { authorFundingOf, ccsConceptsOf } from './records.ts';

/** Whether an author is the one a field names, by e-mail or by name (both escaped alike). */
const names = (a: TitleAuthor, v: string): boolean => (a.email !== '' && a.email === v) || a.name === v;

/** Names as a sentence: `A`, `A and B`, `A, B, and C`. */
const sentence = (xs: readonly string[]): string => (xs.length <= 2 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')}, and ${xs[xs.length - 1] ?? ''}`);

/**
 * The ORCID argument as the template gives it, a full URL (main.tex l.61: https://orcid.org/0000-0002-1825-0097), which the
 * class links behind its ORCID logo. Flouest stores the bare iD; a value that is already a URL stays as it is. Only the
 * characters a macro argument cannot hold are dropped (an iD has none).
 */
const orcidUrl = (orcid: string): string => {
  const v = orcid.replace(/[\\{}%#\s]/gu, '');
  return v === '' ? '' : /^https?:\/\//u.test(v) ? v : `https://orcid.org/${v}`;
};

/** The preamble block, in the template's order. */
const front = (node: Subject, content: string): string => {
  const field = (name: string): string => templateField(node, name);
  const set = (command: string, name: string): string[] => (field(name) !== '' ? [`${command}{${field(name)}}`] : []);
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  const funding = authorFundingOf(node);

  // One \author per author, always with its five arguments (an empty one is {}, as main.tex l.62 writes them): the author's
  // affiliations as the class's second argument, each "Department, Institution, Address" and several joined by \and
  // (main.tex l.59-61); the class asks each for a country (LIPIcs.md l.42), which the address's last part is.
  const people = authors.map((a) => {
    const where = affiliationsOfAuthor(a, affiliations).map((f) => f.text).join(' \\and ');
    const own = funding.filter((f) => names(a, f.author)).map((f) => f.text).join(' ');
    return `\\author{${a.name}}{${where}}{${a.email}}{${orcidUrl(a.orcid)}}{${own}}`;
  });

  // The running heads: \titlerunning only when the paper gives a short title (the class runs the title otherwise); the author
  // head always, as the checklist asks for one (LIPIcs.md l.41; main.tex l.64), from the running-author field or the full names.
  const running = field('runningAuthor') || sentence(authors.map((a) => a.name));
  // \Copyright takes the authors' full names (LIPIcs.md l.41; main.tex l.65); a paper's own line wins.
  const copyright = field('copyright') || sentence(authors.map((a) => a.name));
  const ccs = ccsConceptsOf(node).map((c) => `\\ccsdesc${c.significance !== '' ? `[${c.significance}]` : ''}{${c.concept}}`);
  // Comma-separated keywords (LIPIcs.md l.41; main.tex l.70).
  const keywords = templateList(node, 'keywords');
  return [
    `\\title{${content.trim()}}`,
    ...set('\\titlerunning', 'shortTitle'),
    ...people,
    ...(running !== '' ? [`\\authorrunning{${running}}`] : []),
    ...(copyright !== '' ? [`\\Copyright{${copyright}}`] : []),
    ...ccs,
    ...(keywords.length > 0 ? [`\\keywords{${keywords.join(', ')}}`] : []),
    // The optional metadata the class prints after the abstract, each only when the paper gives it (main.tex l.72-75; optional by LIPIcs.md l.89).
    ...set('\\category', 'category'),
    ...set('\\relatedversion', 'relatedVersion'),
    ...set('\\supplement', 'supplement'),
    ...set('\\funding', 'funding'),
    // Editor-only (LIPIcs.md l.44; main.tex l.92): written only when the paper carries the number the editors gave it.
    ...set('\\ArticleNo', 'articleNo'),
  ].join('\n');
};

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  // One declaration, so the de-duplicated preamble keeps the authors in order and the \ccsdesc lines with them.
  preamble: (_params, _parentType, node, content) => (node !== undefined && content !== undefined ? { declarations: [front(node, content)] } : {}),
  // The class's own \maketitle, where the title stands (main.tex l.96, before \begin{abstract}).
  emit: () => '\\maketitle\n\n',
});

export default realize;
