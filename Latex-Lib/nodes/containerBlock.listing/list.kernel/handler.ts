/**
 * list.kernel: the kernel's itemize, enumerate and description, nested by
 * the items' indent; the bullets (\labelitemi, \labelitemii) and numbers
 * (\labelenumi, \labelenumii) redefined when asked.
 * CTAN: https://ctan.org/pkg/latex-base (usrguide, list environments)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { labelLines, nested, styleOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = labelLines(p);
  return {
    preamble: () => (declarations.length === 0 ? {} : { declarations }),
    emit: (node, content) => nested(content, () => `\\begin{${styleOf(node)}}`, () => `\\end{${styleOf(node)}}`),
  };
};

export default realize;
