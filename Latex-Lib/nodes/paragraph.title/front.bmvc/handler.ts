/**
 * front.bmvc (paragraph/title). BMVC's own title block (bmvc2k.cls): \title, one \addauthor{name}{email}{institution number}
 * per author, one \addinstitution{…} per affiliation and \runninghead{authors}{title} in the preamble, as the BMVA's
 * bmvc_final.tex places them (l.8-27), and \maketitle (the class's \bmv@maketitle) at the title's place.
 * Not on CTAN: the BMVA's BMVCTemplate (bmvc2k.cls v0.22).
 */
import type { Realization, Subject } from '../../../schema/realization.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField } from '../node.ts';

/**
 * The preamble block, in the template's order. bmvc2k's \maketitle prints the \addauthor and \addinstitution lists, not
 * \@author (classes/bmvc.ts: \addauthor l.380, \addinstitution l.407, \maketitle l.525-548), so the kernel's \author is
 * not written. \runninghead is always written: the page heads from page 2 print \BMVA@author and \BMVA@title, which only
 * \runninghead defines (l.554-597); without the way's values they would be the setting's placeholder.
 */
const front = (node: Subject, content: string): string => {
  const title = content.trim();
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  // The class's third argument is one institution number (bmvc_final.tex l.8-27: {1}, {2}): the author's first affiliation's
  // number in the title's list; an author with none leaves it empty. An author's second affiliation is not printed.
  const people = authors.map((a) => {
    const first = affiliationsOfAuthor(a, affiliations)[0];
    return `\\addauthor{${a.name}}{${a.email}}{${first === undefined ? '' : affiliationNumber(first, affiliations)}}`;
  });
  // The class numbers institutions in the order they are given; each part on its own line, as the template writes them.
  const institutions = affiliations.map((f) => `\\addinstitution{${[f.department, f.name, f.address].filter(Boolean).join('\\\\ ')}}`);
  const runningAuthor = templateField(node, 'runningAuthor') || authors.map((a) => a.name).join(', ');
  const shortTitle = templateField(node, 'shortTitle') || title;
  return [`\\title{${title}}`, ...people, ...institutions, `\\runninghead{${runningAuthor}}{${shortTitle}}`].join('\n');
};

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  // One declaration, so the de-duplicated preamble keeps the authors and institutions in order (two authors with the same
  // name and email stay two \addauthor lines).
  preamble: (_params, _parentType, node, content) => (node !== undefined && content !== undefined ? { declarations: [front(node, content)] } : {}),
  // The class's \maketitle; a second one only prints a message (bmvc2k.cls l.525-548).
  emit: () => '\\maketitle\n\n',
});

export default realize;
