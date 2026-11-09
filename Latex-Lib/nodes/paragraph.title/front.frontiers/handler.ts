/**
 * front.frontiers (paragraph/title). Frontiers' title block as its template writes it (Source/0757-frontiers/frontiers.tex
 * l.28-58, "frontiers.tex" below): the data macros \keyFont, \firstAuthorLast, \Authors, \Address, \corrAuthor and \corrEmail in
 * the preamble, which the class's \maketitle and running head print by name (FrontiersinHarvard.cls l.240-245, 498-502); then,
 * where the title stands, \title[running title]{…}, \author[\firstAuthorLast]{\Authors}, \address{}, \correspondance{},
 * \extraAuth{…} and \maketitle. The keywords go at the end of the abstract, as the template sets them there (l.70-71).
 * Not on CTAN: Frontiers' own template (FrontiersinHarvard.cls v2.6, Frontiers_LaTeX_Templates.zip).
 */
import type { Realization, Subject } from '../../../schema/realization.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';
import type { TitleAuthor } from '../node.ts';

/** Whether an author is the one a field names, by e-mail or by name (both escaped alike). */
const names = (a: TitleAuthor, v: string): boolean => (a.email !== '' && a.email === v) || a.name === v;

/** Names as the template joins them: `A`, `A and B`, `A, B and C` (frontiers.tex l.30). */
const joined = (xs: readonly string[]): string => (xs.length <= 2 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1] ?? ''}`);

/**
 * The corresponding authors: those the paper names, else the first author. Frontiers asks for one, marked with a star
 * (frontiers.tex l.36-37), and the class cannot set an empty one: its block is \corrAuthor \\ \corrEmail under a raggedright
 * "Correspondence*:\\" (FrontiersinHarvard.cls l.502), so an empty \corrAuthor ends a line that is not there ("There's no line
 * here to end", ZeroTeX-NG, 2026-11-07).
 */
const correspondingOf = (node: Subject, authors: readonly TitleAuthor[]): TitleAuthor[] => {
  const wanted = templateList(node, 'correspondingAuthor');
  const named = authors.filter((a) => wanted.some((v) => names(a, v)));
  return named.length > 0 ? named : authors.slice(0, 1);
};

const data = (node: Subject): string => {
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  // One affiliation: no numbers, as there is nothing to key (the template keys each affiliation by number, l.30-35).
  const single = affiliations.length === 1;
  const corresponding = correspondingOf(node, authors);
  // \Authors: each name, a thin space and its affiliations' numbers, the corresponding author's with a star
  // (frontiers.tex l.30: First Author\,$^{1,*}$, Co-Author\,$^{2}$ and Co-Author\,$^{1,2}$).
  const person = (a: TitleAuthor): string => {
    const marks = [...(single ? [] : affiliationsOfAuthor(a, affiliations).map((f) => String(affiliationNumber(f, affiliations)))), ...(corresponding.includes(a) ? ['*'] : [])];
    return marks.length === 0 ? a.name : `${a.name}\\,$^{${marks.join(',')}}$`;
  };
  // \Address: each affiliation on its line after its number (l.33-34), "Department, Institution, Address"; \mbox{} for none,
  // as the class follows it with \\ in a raggedright paragraph of its own (FrontiersinHarvard.cls l.500).
  const address = affiliations.map((f) => (single ? f.text : `$^{${affiliationNumber(f, affiliations)}}$${f.text}`)).join(' \\\\\n');
  // \firstAuthorLast: the paper's running author, else the first author's surname, with "et al." after it for more than one
  // author (l.29: Sample {et~al.}, "use et al only if is more than 1 author"). The class prints it in every running head (l.240-245).
  const first = authors[0]?.name.split(/\s+/u).pop() ?? '';
  const runningAuthor = templateField(node, 'runningAuthor') || (authors.length > 1 ? `${first} {et~al.}` : first);
  const keywords = templateList(node, 'keywords');
  // The first corresponding author in \corrAuthor and \corrEmail, which the class prints under "Correspondence*:" (l.502); a
  // paper with no author at all gets \mbox{}, so the block's line break has a line to end.
  const corr = corresponding[0];
  return [
    // The keyword font, as the template defines it (l.28).
    '\\def\\keyFont{\\fontsize{8}{11}\\helveticabold }',
    `\\def\\firstAuthorLast{${runningAuthor}}`,
    `\\def\\Authors{${joined(authors.map(person))}}`,
    `\\def\\Address{${address === '' ? '\\mbox{}' : address}}`,
    `\\def\\corrAuthor{${corr?.name ?? '\\mbox{}'}}`,
    `\\def\\corrEmail{${corr?.email ?? ''}}`,
    // The keywords at the end of the abstract, set as the template sets them (l.70-71: \tiny \keyFont{ \section{Keywords:} …}),
    // where the abstract's \section is the class's run-in label (l.514-519); from the kernel's hook at \end{abstract}, inside the
    // environment's group.
    ...(keywords.length === 0 ? [] : [`\\AddToHook{env/abstract/end}{\\par\\tiny\\keyFont{\\section{Keywords:} ${keywords.join(', ')}}}`]),
  ].join('\n');
};

const front = (node: Subject, content: string): string => {
  const affiliations = affiliationsOf(node);
  const corresponding = correspondingOf(node, authorsOf(node));
  // A second and later corresponding author in \extraAuth, each as name \\ affiliation, e-mail (l.54-55); empty otherwise (l.54).
  const extra = corresponding
    .slice(1)
    .map((a) => [a.name, [...affiliationsOfAuthor(a, affiliations).map((f) => f.text), ...(a.email === '' ? [] : [a.email])].join(', ')].filter(Boolean).join(' \\\\ '))
    .join(' \\\\ ');
  const shortTitle = templateField(node, 'shortTitle');
  return [
    // \title[running title]{…}: the running title goes to the right of every running head (FrontiersinHarvard.cls l.246, 396).
    `\\title${shortTitle === '' ? '' : `[${shortTitle}]`}{${content.trim()}}`,
    // The rest as the template leaves it ("This field will be automatically populated", l.50-52): the class prints \Authors,
    // \Address, \corrAuthor and \corrEmail itself (l.498-504).
    '\\author[\\firstAuthorLast]{\\Authors}',
    '\\address{}',
    '\\correspondance{}',
    `\\extraAuth{${extra}}`,
    '\\maketitle',
  ].join('\n');
};

export const realize = (): Realization => ({
  // One declaration, so the de-duplicated preamble keeps the macros together and in order. \def, not \newcommand: the setting's
  // own preamble may hold placeholders under the same names (classes/frontiers.ts), which these replace.
  preamble: (_params, _parentType, node) => (node !== undefined ? { declarations: [data(node)] } : {}),
  // No date: the class prints none (FrontiersinHarvard.cls l.475-509).
  emit: (node, content) => `${front(node, content)}\n\n`,
});

export default realize;
