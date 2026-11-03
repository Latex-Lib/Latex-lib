/**
 * bib.natbib (cite/cite): natbib's citation commands: \citep{key} in brackets, \citet{key} in the text (Knuth (1984)), \citealp without brackets.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param, textOf } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    emit: (node) => (textOf(node) === '' ? '' : `\\${param(p, 'command', 'citep')}{${textOf(node)}}`),
  };
};

export default realize;
