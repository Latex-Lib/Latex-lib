/**
 * bib.cite-pkg: the cite package over BibTeX's numbered styles: citations
 * sorted and compressed ([1-3]) by default, nosort to keep their order,
 * super for superscript numbers; \bibliographystyle and \bibliography{\jobname}.
 * CTAN: https://ctan.org/pkg/cite
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { bibFile, nociteOnce, printedOnce } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const options = [...(p['sort'] === false ? ['nosort'] : []), ...(p['superscript'] === true ? ['super'] : [])];
  return {
    preamble: (_params, _parentType, node, content) => ({ packages: [`\\usepackage${options.length === 0 ? '' : `[${options.join(',')}]`}{cite}`], beforeDocument: bibFile(content), declarations: [nociteOnce] }),
    // Once per document: BibTeX takes one \bibstyle, \bibdata and \citation{*} (printedOnce, ../node.ts).
    emit: () => printedOnce(`\\nocite{*}\n\\bibliographystyle{${param(p, 'bst', 'plain')}}\n\\bibliography{\\jobname}`),
  };
};

export default realize;
