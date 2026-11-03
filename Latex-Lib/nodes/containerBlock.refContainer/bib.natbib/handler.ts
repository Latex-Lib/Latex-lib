/**
 * bib.natbib: \usepackage[options]{natbib} with an natbib style,
 * \bibliographystyle{plainnat} (unsrtnat, abbrvnat) and \bibliography{\jobname};
 * the options numbers, authoryear or super, round or square, sort or
 * sort&compress, comma or semicolon; \bibsep and \bibfont for the list.
 * CTAN: https://ctan.org/pkg/natbib
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { bibFile, headingLines, nociteOnce, printedOnce } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const options = [
    param(p, 'citeStyle', 'numbers'),
    ...(param(p, 'brackets', 'style') === 'style' ? [] : [param(p, 'brackets')]),
    ...(param(p, 'sort', 'none') === 'none' ? [] : [param(p, 'sort')]),
    ...(param(p, 'separator', 'style') === 'style' ? [] : [param(p, 'separator')]),
  ];
  const declarations = [
    ...headingLines(param(p, 'heading')),
    ...(param(p, 'bibsep') === '' ? [] : [`\\setlength{\\bibsep}{${param(p, 'bibsep')}}`]),
    ...(param(p, 'bibFont') === '' ? [] : [`\\renewcommand{\\bibfont}{${param(p, 'bibFont')}}`]),
    nociteOnce,
  ];
  return {
    preamble: (_params, _parentType, node, content) => ({ packages: [`\\usepackage[${options.join(',')}]{natbib}`], beforeDocument: bibFile(content), declarations }),
    // Once per document: BibTeX takes one \bibstyle, \bibdata and \citation{*} (printedOnce, ../node.ts).
    emit: () => printedOnce(`\\nocite{*}\n\\bibliographystyle{${param(p, 'bst', 'plainnat')}}\n\\bibliography{\\jobname}`),
  };
};

export default realize;
