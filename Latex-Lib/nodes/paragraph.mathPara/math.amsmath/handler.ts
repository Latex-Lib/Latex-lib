/**
 * math.amsmath (paragraph/mathPara). One line of display maths, in amsmath's split or gathered when its data.latexStyle asks, with its \label.
 * CTAN: https://ctan.org/pkg/amsmath
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { field, labelLine } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: (_params, _parentType, node, content) => ({ packages: ['\\usepackage{amsmath}'] }),
    emit: (node, content, context, parentType) => `${field(node, 'latexStyle') === 'split' ? `\\begin{split}\n${content.trim()}\n\\end{split}` : field(node, 'latexStyle') === 'gathered' ? `\\begin{gathered}\n${content.trim()}\n\\end{gathered}` : content.trim()}${labelLine(field(node, 'label'))}\n\n`,
  };
};

export default realize;
