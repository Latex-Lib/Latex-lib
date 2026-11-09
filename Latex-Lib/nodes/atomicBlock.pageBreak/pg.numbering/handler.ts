/**
 * pg.numbering (atomicBlock/pageBreak). The break, then \pagenumbering{<style>}: the kernel resets the page counter to 1 and
 * prints it in the new style from the next page on.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    emit: () => `\n\\${param(p, 'command', 'clearpage')}\n\\pagenumbering{${param(p, 'style', 'arabic')}}\n`,
  };
};

export default realize;
