/**
 * front.elsarticle-frontmatter (paragraph/title). elsarticle's own front matter, all at the title's place inside
 * \begin{frontmatter} … \end{frontmatter}, whose end runs \maketitle (elsarticle.dtx l.1430): \title{…\tnoteref{t1}} with
 * \tnotetext, keyed \author[affiliation labels]{name\corref{cor1}} each followed by its \ead, \cortext, keyed
 * \affiliation[label]{organization=…, addressline=…}, the graphical abstract and highlights (printed on their own preliminary
 * pages), and the keyword box with \sep, \PACS, \MSC[year] and \JEL. No ORCID: elsarticle has no command for it.
 * CTAN: https://ctan.org/pkg/elsarticle
 */
import type { Realization, Subject } from '../../../schema/realization.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';
import { graphicalAbstractOf, highlightsOf } from './records.ts';

const front = (node: Subject, content: string): string => {
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  const lines: string[] = ['\\begin{frontmatter}'];
  // The title note: \tnoteref inside \title, its text in \tnotetext (elsarticle.dtx l.190-194, 216-222; template l.68-70).
  const titleNote = templateField(node, 'titleNote');
  lines.push(`\\title{${content.trim()}${titleNote === '' ? '' : '\\tnoteref{t1}'}}`);
  if (titleNote !== '') lines.push(`\\tnotetext[t1]{${titleNote}}`);
  // The corresponding authors, by name or email (templateSpecific.correspondingAuthor, one or several), share cor1: \corref
  // inside the name sets the mark (l.258-261), \cortext the footnote (l.252-256).
  const corresponding = templateList(node, 'correspondingAuthor');
  const isCorresponding = (name: string, email: string): boolean => corresponding.includes(name) || (email !== '' && corresponding.includes(email));
  const label = (n: number): string => `aff${n}`;
  for (const a of authors) {
    // \author[aff1,aff2]{Name} (l.318-345): the labels are the author's affiliations' in the title's list, as \affiliation[label]
    // below gives them; with none, the unkeyed \author{Name}.
    const labels = affiliationsOfAuthor(a, affiliations).map((f) => label(affiliationNumber(f, affiliations)));
    lines.push(`\\author${labels.length === 0 ? '' : `[${labels.join(',')}]`}{${a.name}${isCorresponding(a.name, a.email) ? '\\corref{cor1}' : ''}}`);
    // \ead reads the author just given (\the\@eadauthor, l.275-285), so it follows its \author.
    if (a.email !== '') lines.push(`\\ead{${a.email}}`);
  }
  if (authors.some((a) => isCorresponding(a.name, a.email))) lines.push('\\cortext[cor1]{Corresponding author.}');
  // \affiliation[label]{organization={…}, addressline={…}} (l.516-531, 707-718): the department and the name are the
  // organisation ("Department and Organization", template l.104), the address its line; each value braced, so its commas stay in it.
  for (const f of affiliations) {
    const keys = [...([f.department, f.name].some(Boolean) ? [`organization={${[f.department, f.name].filter(Boolean).join(', ')}}`] : []), ...(f.address === '' ? [] : [`addressline={${f.address}}`])];
    lines.push(`\\affiliation[${label(affiliationNumber(f, affiliations))}]{${keys.join(', ')}}`);
  }
  // The graphical abstract and the highlights each go to a box that \maketitle prints on a page of its own before the title
  // page (l.753-808); both print \@title, so they come after \title.
  const graphical = graphicalAbstractOf(node);
  if (graphical !== '') lines.push('\\begin{graphicalabstract}', graphical, '\\end{graphicalabstract}');
  const highlights = highlightsOf(node);
  if (highlights.length > 0) lines.push('\\begin{highlights}', ...highlights.map((h) => `\\item ${h}`), '\\end{highlights}');
  // The keyword box, printed by \maketitle under the abstract (l.810-826, 885-886): keywords separated by \sep, then each
  // classification on its own line, \PACS, \MSC[year] (2000 by default) and \JEL, its codes separated by \sep.
  const keywords = templateList(node, 'keywords');
  const mscYear = templateField(node, 'mscYear');
  const codes = (
    [
      ['\\PACS', templateList(node, 'pacs')],
      [mscYear === '' ? '\\MSC' : `\\MSC[${mscYear}]`, templateList(node, 'msc')],
      ['\\JEL', templateList(node, 'jel')],
    ] as const
  )
    .filter(([, v]) => v.length > 0)
    .map(([c, v]) => `${c} ${v.join(' \\sep ')}`);
  if (keywords.length > 0 || codes.length > 0) lines.push('\\begin{keyword}', ...(keywords.length > 0 ? [keywords.join(' \\sep ')] : []), ...codes, '\\end{keyword}');
  lines.push('\\end{frontmatter}');
  return lines.join('\n');
};

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  // Everything goes in the body at the title's place, as elsarticle's templates write it (elsarticle-template-num.tex
  // l.56-139). \end{frontmatter} runs \maketitle, so no \maketitle follows. No \date: elsarticle prints none on the title page.
  // The abstract node, which Flouest writes after the title, is printed where it stands (abs.class-native's stored-abstract
  // release, containerBlock.abstract/node.ts), not in the front matter's box.
  preamble: () => ({}),
  emit: (node, content) => `${front(node, content)}\n\n`,
});

export default realize;
