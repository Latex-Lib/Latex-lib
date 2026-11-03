/**
 * fn.endnotes: every footnote an endnote (\let\footnote=\endnote), printed
 * at the end with \theendnotes; \enotesize for their size, \notesname for
 * the heading.
 * CTAN: https://ctan.org/pkg/endnotes
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = [
    '\\let\\footnote=\\endnote',
    ...(param(p, 'size') === '' ? [] : [`\\renewcommand{\\enotesize}{${param(p, 'size')}}`]),
    ...(param(p, 'heading') === '' ? [] : [`\\renewcommand{\\notesname}{${param(p, 'heading')}}`]),
    '\\AtEndDocument{\\theendnotes}',
  ];
  return {
    preamble: () => ({ packages: ['\\usepackage{endnotes}'], declarations }),
    emit: (node, content) => content,
  };
};

export default realize;
