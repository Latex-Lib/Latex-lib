/**
 * bib.entry (paragraph/refPara). One bibliography entry as BibTeX source; the reference list's way writes it to \jobname.bib or reads it into a \bibitem.
 * CTAN: https://ctan.org/pkg/bibtex
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: (_params, _parentType, node, content) => ({}),
    emit: (node, content, context, parentType) => content.trim() === '' ? '' : `${content.trim()}\n\n`,
  };
};

export default realize;
