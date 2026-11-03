/**
 * bib.apacite: APA citations and reference list, \usepackage{apacite} (or
 * [natbibapa] for natbib's commands), \bibliographystyle{apacite} and
 * \bibliography{\jobname}; the heading through \refname or \bibname.
 * CTAN: https://ctan.org/pkg/apacite
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
    preamble: (_params, _parentType, node, content) => ({ packages: [p['natbib'] === true ? '\\usepackage[natbibapa]{apacite}' : '\\usepackage{apacite}'], beforeDocument: bibFile(content), declarations }),
    // Once per document: BibTeX takes one \bibstyle, \bibdata and \citation{*} (printedOnce, ../node.ts).
    emit: () => printedOnce(`\\nocite{*}\n\\bibliographystyle{apacite}\n\\bibliography{\\jobname}`),
  };
};

export default realize;
