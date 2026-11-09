/**
 * bib.gbt7714 (cite/cite): a citation beside the GB/T 7714 list (gbt7714 loads natbib): \cite{key}, which the
 * Chinese templates write (Source/0578-monetjoe-latex-paper-templates/finalversion.tex l.141), superscript [1] in the
 * list's default mode; or natbib's \citep{key} and \citet{key}.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param, textOf } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    emit: (node) => (textOf(node) === '' ? '' : `\\${param(p, 'command', 'cite')}{${textOf(node)}}`),
  };
};

export default realize;
