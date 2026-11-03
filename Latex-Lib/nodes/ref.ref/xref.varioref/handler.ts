/**
 * xref.varioref: \vref{label}, the number with its page when it is elsewhere,
 * or \vpageref{label} for the page alone.
 * CTAN: https://ctan.org/pkg/varioref
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { labelKey, param, textOf } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({ packages: ['\\usepackage{varioref}'] }),
    emit: (node) => `\\${param(p, 'command', 'vref')}{${labelKey(textOf(node))}}`,
  };
};

export default realize;
