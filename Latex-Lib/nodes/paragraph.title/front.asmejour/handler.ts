/**
 * front.asmejour (paragraph/title). asmejour's own title block: \title, one \SetAuthorBlock{name}{address} per author (the
 * corresponding author's name ends in \CorrespondingAuthor, the address in "email: …"), \keywords, \PaperNumber and \date;
 * then \maketitle, which sets the authors, the title and the stored abstract side by side, so it must follow the abstract.
 * Source: asmejour.cls (v1.27 in the engine's MiKTeX snapshot 9766; read here from CTAN's v1.28, 2026/11/05, whose title
 * code is the same) and asmejour-template.tex (CTAN asmejour), l.138-179.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, titleLines } from '../node.ts';
import key from './key.ts';
import { correspondingOf } from './people.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const afterAbstract = param(p, 'maketitle', 'after-abstract') === 'after-abstract';
  return {
    // Nothing in the preamble: the class defines every command. The lines go in the body, where the title stands and so before
    // the abstract, since \keywords must come before \begin{abstract}, whose body is set at once with the keywords stored so far
    // (asmejour.cls v1.28 l.1641-1667, 1777-1786; template l.164-167).
    preamble: () => ({}),
    emit: (node, content) => {
      const authors = authorsOf(node);
      const affiliations = affiliationsOf(node);
      const corresponding = correspondingOf(node, authors).indexes;
      // \author is an error in asmejour ("the \author command is not used", l.1769-1775): each author is a \SetAuthorBlock
      // (l.1566-1600). \CorrespondingAuthor takes no argument ("removed option 2021/01/30", l.1708-1716: the stale template comment
      // at l.147-151 still shows one, which would print the email beside the name); ASME wants the email in the address block,
      // as the template's last line "email: …" (l.138-145). Each affiliation's parts go on their own lines, each but the last
      // ending in a comma, as the template's address (l.153-158).
      const blocks = authors.map((a, i) => {
        const lines = [...affiliationsOfAuthor(a, affiliations).flatMap((f) => [f.department, f.name, f.address].filter(Boolean))];
        const address = [...lines.map((l, j) => (j < lines.length - 1 ? `${l},` : l)), ...(a.email !== '' ? [`email: ${a.email}`] : [])];
        return `\\SetAuthorBlock{${a.name}${corresponding.includes(i) ? '\\CorrespondingAuthor' : ''}}{%\n   ${address.join('\\\\\n   ')}}`;
      });
      const keywords = templateField(node, 'keywords', ', ');
      const paperNumber = templateField(node, 'paperNumber');
      // \date{…} replaces the class's default \today footnote, \date{} drops it (l.1792-1809); the node's date as the kernel ways write it.
      const date = titleLines(node, content).filter((l) => l.startsWith('\\date{'));
      return `${[
        `\\title{${content.trim()}}`,
        ...blocks,
        ...(keywords !== '' ? [`\\keywords{${keywords}}`] : []),
        // The paper number joins the page number in the footer (l.918-919, 934-945; template l.494).
        ...(paperNumber !== '' ? [`\\PaperNumber{${paperNumber}}`] : []),
        ...date,
        // \maketitle typesets the abstract the environment stored (l.1669-1706, 1732-1767), and an abstract after it is an error
        // ("The abstract environment must come before \maketitle; it will not be printed", l.1777-1789). The title stands before
        // the abstract in a Flouest document, so by default \maketitle runs once, right after the next \end{abstract}; a
        // document with no abstract after its title then prints no title block, which the in-place preset is for.
        afterAbstract ? '\\AddToHookNext{env/abstract/after}{\\maketitle}' : '\\maketitle',
      ].join('\n')}\n\n`;
    },
  };
};

export default realize;
