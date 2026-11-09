/**
 * xref.upref: the kernel's \ref{label} (as xref.kernel, after the target's
 * name and a tie when the node gives one) with the AMS package upref, whose
 * \@setref prints the number through \textup, so it stands upright in a
 * theorem's italic body (upref.dtx l.97-144, hyperref-aware). upref calls
 * amsgen's \@xp and \sw@slant without loading amsgen, so amsgen comes first:
 * under article alone each \ref stopped at "Undefined control sequence".
 * CTAN: https://ctan.org/pkg/upref (amscls)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, labelKey, textOf } from '../../protocol.ts';
import { refNameOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({ packages: ['\\usepackage{amsgen}', '\\usepackage{upref}'] }),
    emit: (node) => `${p['name'] === false || refNameOf(node) === '' ? '' : `${escapeText(refNameOf(node))}~`}\\ref{${labelKey(textOf(node))}}`,
  };
};

export default realize;
