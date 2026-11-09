/**
 * bib.named: IJCAI's reference list, BibTeX with the kit's named.bst: \nocite{*}, \bibliographystyle{named} and
 * \bibliography{\jobname}, the entries written to \jobname.bib. named.bst labels each entry
 * \bibitem[\protect\citeauthoryear{Author}{Year}]{key} (named.bst l.1067-1069), which the style's named.sty macros
 * read: \cite prints [Author, Year], \shortcite [Year], and \@biblabel prints the list's label as [Author, Year]
 * (ijcai26.sty l.286-317). The heading through \refname, as bib.bibtex-bst.
 * Source: Latex Related Research/Latex-lib-main/Source/0319-ijcai/ijcai26.tex l.630-632.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { bibFile, headingLines, nociteOnce, printedOnce } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = [...headingLines(param(p, 'heading')), nociteOnce];
  return {
    preamble: (_params, _parentType, _node, content) => ({ beforeDocument: bibFile(content), declarations }),
    // Once per document: BibTeX takes one \bibstyle, \bibdata and \citation{*} (printedOnce, ../node.ts).
    emit: () => printedOnce('\\nocite{*}\n\\bibliographystyle{named}\n\\bibliography{\\jobname}'),
  };
};

export default realize;
