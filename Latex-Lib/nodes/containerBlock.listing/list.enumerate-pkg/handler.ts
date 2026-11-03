/**
 * list.enumerate-pkg: the enumerate package (tools bundle). A numbered
 * list's labels from a template in brackets, \begin{enumerate}[(a)]: 1, a,
 * A, i or I in it is the counter, anything braced is kept as text; other
 * lists stay the kernel's.
 * CTAN: https://ctan.org/pkg/enumerate
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { nested, styleOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({ packages: ['\\usepackage{enumerate}'] }),
    emit: (node, content) => nested(content, () => (styleOf(node) === 'enumerate' ? `\\begin{enumerate}[${param(p, 'label', '(a)')}]` : `\\begin{${styleOf(node)}}`), () => `\\end{${styleOf(node)}}`),
  };
};

export default realize;
