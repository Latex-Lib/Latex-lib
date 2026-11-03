/**
 * xref.cleveref: \cref{label} (\Cref at a sentence start), the target's
 * kind and number in words; the options capitalise, noabbrev and nameinlink.
 * Loaded after hyperref.
 * CTAN: https://ctan.org/pkg/cleveref (section 7)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { labelKey, param, textOf } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const options = [...(p['capitalise'] === true ? ['capitalise'] : []), ...(p['noabbrev'] === true ? ['noabbrev'] : []), ...(p['nameInLink'] === true ? ['nameinlink'] : [])];
  return {
    preamble: () => ({ packages: ['\\usepackage{hyperref}', `\\usepackage${options.length === 0 ? '' : `[${options.join(',')}]`}{cleveref}`] }),
    emit: (node) => `\\${param(p, 'command', 'cref')}{${labelKey(textOf(node))}}`,
  };
};

export default realize;
