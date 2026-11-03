/**
 * xref.kernel: the kernel's \ref{label}, the number only, after the target's
 * name and a tie when the node gives one (Figure~\ref{…}).
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, labelKey, textOf } from '../../protocol.ts';
import { refNameOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    // The name is plain text from the node's attrs, escaped as General's ref.ts escapes it (escapeLatexText): an & or % in it stopped
    // TeX. The label goes through `labelKey`, as every library label does.
    emit: (node) => `${p['name'] === false || refNameOf(node) === '' ? '' : `${escapeText(refNameOf(node))}~`}\\ref{${labelKey(textOf(node))}}`,
  };
};

export default realize;
