/**
 * pg.afterpage (atomicBlock/pageBreak). afterpage: the break waits until the current page is full, \afterpage{\clearpage}, so the page is not left short.
 * CTAN: https://ctan.org/pkg/afterpage
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: (_params, _parentType, node, content) => ({ packages: ['\\usepackage{afterpage}'] }),
    emit: () => `\n\\afterpage{\\${param(p, 'command', 'clearpage')}}\n`,
  };
};

export default realize;
