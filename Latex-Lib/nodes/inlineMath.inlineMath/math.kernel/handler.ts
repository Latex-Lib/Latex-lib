/**
 * math.kernel (inlineMath/inlineMath). Inline maths: $…$, with a \label after it when the node has one.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { labelKey, param } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: (_params, _parentType, node, content) => ({}),
    emit: (node, content, context, parentType) => content.trim() === '' ? '' : `${param(p, 'delimiters', 'dollar') === 'paren' ? `\\(${content}\\)` : `$${content}$`}${typeof node.attrs?.['label'] === 'string' && labelKey(node.attrs['label'].trim()) !== '' ? `\\label{${labelKey(node.attrs['label'].trim())}}` : ''}`,
  };
};

export default realize;
