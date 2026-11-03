/**
 * math.kernel (paragraph/mathPara). One line of display maths as written, with its \label.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { field, labelLine } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: (_params, _parentType, node, content) => ({}),
    emit: (node, content, context, parentType) => `${content.trim()}${labelLine(field(node, 'label'))}\n\n`,
  };
};

export default realize;
