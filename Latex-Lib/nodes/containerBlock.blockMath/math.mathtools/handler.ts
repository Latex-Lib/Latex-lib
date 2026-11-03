/**
 * math.mathtools: amsmath's displays with mathtools loaded over it;
 * \mathtoolsset{showonlyrefs} to number only referenced equations, and
 * amsmath's numbering, break and alignment settings (mathtools passes its
 * options to amsmath).
 * CTAN: https://ctan.org/pkg/mathtools
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { amsDeclarations, amsDisplay, amsOptions } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const options = amsOptions(p);
  const declarations = [...amsDeclarations(p), ...(p['showOnlyRefs'] === true ? ['\\mathtoolsset{showonlyrefs}'] : [])];
  return {
    preamble: () => ({ packages: [`\\usepackage${options.length === 0 ? '' : `[${options.join(',')}]`}{mathtools}`], ...(declarations.length === 0 ? {} : { declarations }) }),
    emit: (node, content, _context, parentType) => amsDisplay(node, content, param(p, 'multiline', 'auto'), parentType),
  };
};

export default realize;
