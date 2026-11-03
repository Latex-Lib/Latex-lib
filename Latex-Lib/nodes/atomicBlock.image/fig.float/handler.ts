/**
 * fig.float: \begin{figure}[H], the figure exactly where it is written;
 * \floatstyle{plain|plaintop|boxed|ruled} with \restylefloat{figure} for
 * the float's look (ruled and plaintop put the caption on top).
 * CTAN: https://ctan.org/pkg/float
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { inFloat, pathOf, widthOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const style = param(p, 'style', 'plain');
  const declarations = style === 'plain' ? [] : [`\\floatstyle{${style}}`, '\\restylefloat{figure}'];
  return {
    preamble: () => ({ packages: ['\\usepackage{graphicx}', '\\usepackage{float}'], ...(declarations.length === 0 ? {} : { declarations }) }),
    // ruled and plaintop place the caption on top themselves, so it is written below the image either way.
    emit: (node, content, context) => (pathOf(node) === '' ? '' : inFloat('figure', 'H', p['center'] !== false, `\\includegraphics[width=${widthOf(node, param(p, 'unit', 'linewidth'))}]{${pathOf(node)}}`, node, context)),
  };
};

export default realize;
