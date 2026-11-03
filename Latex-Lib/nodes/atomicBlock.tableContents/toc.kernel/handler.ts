/**
 * toc.kernel: the kernel's \tableofcontents, with \listoffigures and
 * \listoftables after it when asked, \tocdepth, \contentsname and a break.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { contentsBody, contentsDeclarations } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = contentsDeclarations(p);
  return {
    preamble: () => (declarations.length === 0 ? {} : { declarations }),
    emit: () => contentsBody(p),
  };
};

export default realize;
