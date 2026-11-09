/**
 * bib.tfapastyle: Taylor & Francis Interact's APA-7 list with BibTeX, as its APA sample describes it
 * (Source/0207-tandf-interact/interactapasample.tex l.16-18, 756-767): \usepackage[natbibapa]{tfapastyle} (natbib's
 * \citep and \citet over the APA styles), \setlength\bibhang{12pt} for the entries' hang,
 * \renewcommand\bibliographytypesize{\fontsize{10}{12}\selectfont} for a 10pt list, and where the list stands
 * \bibliographystyle{tfapacite} with \bibliography{\jobname}. Once per document, as every BibTeX way (`printedOnce`,
 * `nociteOnce`, `bibFile`, ../node.ts).
 *
 * tfapastyle.sty is T&F's modified apacite 6.03: it announces itself as apacite (\ProvidesPackage{apacite}, l.46), so LaTeX
 * warns that tfapastyle "provides apacite", and with natbibapa it loads natbib [longnamesfirst,sort] at the end of its own code
 * (\AtEndOfPackage, l.93-99, 996-1003). Neither it nor tfapacite.bst is on CTAN: both ship in the Interact-APA bundle and must be among the
 * template's files. The sample keeps natbib's own lines (\usepackage[longnamesfirst,sort]{natbib}, \bibpunct, \bibfont)
 * and this list apart: one or the other (l.762-765).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { bibFile, nociteOnce, printedOnce } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = [
    ...(param(p, 'bibhang') === '' ? [] : [`\\setlength\\bibhang{${param(p, 'bibhang')}}`]),
    ...(param(p, 'typeSize') === '' ? [] : [`\\renewcommand\\bibliographytypesize{${param(p, 'typeSize')}}`]),
    nociteOnce,
  ];
  return {
    preamble: (_params, _parentType, _node, content) => ({ packages: ['\\usepackage[natbibapa]{tfapastyle}'], beforeDocument: bibFile(content), declarations }),
    // Once per document: BibTeX takes one \bibstyle, \bibdata and \citation{*} (printedOnce, ../node.ts).
    emit: () => printedOnce('\\nocite{*}\n\\bibliographystyle{tfapacite}\n\\bibliography{\\jobname}'),
  };
};

export default realize;
