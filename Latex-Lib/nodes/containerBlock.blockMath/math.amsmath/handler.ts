/**
 * math.amsmath: amsmath's displays, \[ … \] (equation* when it holds a
 * split) or equation for one row, align, gather, multline or split for
 * several, starred when unnumbered; \numberwithin{equation}{…},
 * \allowdisplaybreaks[n], and the fleqn and leqno options.
 * CTAN: https://ctan.org/pkg/amsmath (amsldoc: displayed equations, \numberwithin, \allowdisplaybreaks)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { amsDeclarations, amsDisplay, amsOptions } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const options = amsOptions(p);
  const declarations = amsDeclarations(p);
  return {
    preamble: () => ({ packages: [`\\usepackage${options.length === 0 ? '' : `[${options.join(',')}]`}{amsmath}`], ...(declarations.length === 0 ? {} : { declarations }) }),
    emit: (node, content, _context, parentType) => amsDisplay(node, content, param(p, 'multiline', 'auto'), parentType),
  };
};

export default realize;
