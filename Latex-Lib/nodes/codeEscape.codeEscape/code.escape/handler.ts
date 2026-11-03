/**
 * code.escape (codeEscape/codeEscape). LaTeX escaped from code, between Flouest's escape markers; the code way prints it its own way (listings: between (*@ and @*)).
 * CTAN: https://ctan.org/pkg/listings
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { ESCAPE_CLOSE, ESCAPE_OPEN } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: (_params, _parentType, node, content) => ({}),
    emit: (node, content, context, parentType) => `${ESCAPE_OPEN}${content}${ESCAPE_CLOSE}`,
  };
};

export default realize;
