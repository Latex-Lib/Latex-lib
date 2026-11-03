/**
 * custom.raw (customLatex/customLatex). Raw LaTeX the author wrote, inline, with its preamble line (attrs.preamble) when it has one.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: (_params, _parentType, node, content) => typeof node?.attrs?.['preamble'] === 'string' && node.attrs['preamble'] !== '' ? { declarations: [node.attrs['preamble']] } : {},
    emit: (node, content, context, parentType) => content,
  };
};

export default realize;
