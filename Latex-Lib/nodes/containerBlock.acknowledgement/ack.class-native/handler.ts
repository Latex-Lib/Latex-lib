/**
 * ack.class-native (containerBlock/acknowledgement). The class's own acknowledgements environment, acmart's \begin{acks} … \end{acks}.
 * CTAN: https://ctan.org/pkg/acmart
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: (_params, _parentType, node, content) => ({}),
    emit: (node, content, context, parentType) => `\\begin{acks}\n${content.trim()}\n\\end{acks}\n\n`,
  };
};

export default realize;
