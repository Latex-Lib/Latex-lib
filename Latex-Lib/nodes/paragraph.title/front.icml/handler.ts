/**
 * front.icml (paragraph/title). ICML's own title block (icml2026.sty on article): \icmltitlerunning{…} for the running head,
 * then the full-width \twocolumn[…] the style's example wraps the whole block in: \icmltitle, \icmlsetsymbol{equal}{*}, the
 * icmlauthorlist of \icmlauthor{name}{labels}, one \icmlaffiliation{label}{text} per affiliation an author names,
 * \icmlcorrespondingauthor{name}{email}, \icmlkeywords and \vskip 0.3in; after the bracket \printAffiliationsAndNotice{…}, the
 * footnote that lists the affiliations, the correspondence line and the notice.
 * Not on CTAN: ICML's kit (icml2026.zip; example_paper.tex l.58-124, icml2026.sty l.353-550).
 */
import type { Realization, Subject } from '../../../schema/realization.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';

const front = (node: Subject, content: string): string => {
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  // Labels are generated, aff<n> by the affiliation's place in the title's list: \icmlauthor splits its labels at commas with
  // \@for and makes a counter of each (\@for at l.456, \newcounter{@affil#1} at l.435-452), so a label must be plain letters and
  // digits; the style numbers the affiliations itself in the order the authors first name them (l.441-445).
  const label = (n: number): string => `aff${n}`;
  // The marks, by name or email (templateSpecific.equalContribution, a list; templateSpecific.correspondingAuthor).
  const marked = (list: readonly string[], a: { readonly name: string; readonly email: string }): boolean => list.includes(a.name) || (a.email !== '' && list.includes(a.email));
  const equal = templateList(node, 'equalContribution');
  const anyEqual = authors.some((a) => marked(equal, a));
  const people = authors.map((a) => {
    const labels = [...(marked(equal, a) ? ['equal'] : []), ...affiliationsOfAuthor(a, affiliations).map((f) => label(affiliationNumber(f, affiliations)))];
    return `\\icmlauthor{${a.name}}{${labels.join(',')}}`;
  });
  // \icmlaffiliation only for an affiliation some author names: the style checks that its label was met in an \icmlauthor
  // before (\ifcsname the@affil#1, l.471) and else prints "AUTHORERR: Error in use of \icmlaffiliation" into the page.
  const named = affiliations.filter((f) => authors.some((a) => affiliationsOfAuthor(a, affiliations).some((g) => g.id === f.id)));
  const affiliationLines = named.map((f) => `\\icmlaffiliation{${label(affiliationNumber(f, affiliations))}}{${f.text}}`);
  // The corresponding author is always given: \printAffiliationsAndNotice prints "AUTHORERR: Missing \icmlcorrespondingauthor"
  // without one (l.530-533). Those templateSpecific.correspondingAuthor names (by name or email) that have an e-mail, else the
  // first author with an e-mail; with no e-mail at all there is nothing to write and the style's own AUTHORERR says so.
  const corresponding = templateList(node, 'correspondingAuthor');
  const withEmail = authors.filter((a) => a.email !== '');
  const chosen = withEmail.filter((a) => marked(corresponding, a));
  const correspondingLines = (chosen.length > 0 ? chosen : withEmail.slice(0, 1)).map((a) => `\\icmlcorrespondingauthor{${a.name}}{${a.email}}`);
  // \icmlkeywords only sets the PDF's keywords (l.546-550): nothing is printed.
  const keywords = templateField(node, 'keywords');
  const running = templateField(node, 'shortTitle');
  return [
    // \icmltitlerunning only stores the running head (\gdef, l.353): the example sets it in the preamble, but it holds as well
    // in the body as long as it comes before \icmltitle, which takes the full title as the running head when none was set
    // (l.360-362). With no short title the style does that.
    ...(running === '' ? [] : [`\\icmltitlerunning{${running}}`]),
    '\\twocolumn[',
    `\\icmltitle{${content.trim()}}`,
    // The symbol for equal contribution, as the example always sets it (example_paper.tex l.80).
    '\\icmlsetsymbol{equal}{*}',
    '\\begin{icmlauthorlist}',
    ...people,
    '\\end{icmlauthorlist}',
    ...affiliationLines,
    ...correspondingLines,
    ...(keywords === '' ? [] : [`\\icmlkeywords{${keywords}}`]),
    '\\vskip 0.3in',
    ']',
    // After the bracket, required even when empty (example_paper.tex l.112-124; icml2026.sty l.508-516 warns at the end of the
    // document without it); \icmlEqualContribution ("*Equal contribution", l.502) when an author is marked equal.
    `\\printAffiliationsAndNotice{${anyEqual ? '\\icmlEqualContribution' : ''}}`,
  ].join('\n');
};

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  // Everything goes in the body, as the first block: \twocolumn[…] starts a new page with the block across both columns
  // (example_paper.tex l.64-110), and the style's \maketitle is never used.
  preamble: () => ({}),
  emit: (node, content) => `${front(node, content)}\n\n`,
});

export default realize;
