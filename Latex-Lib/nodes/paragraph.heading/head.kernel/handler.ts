/**
 * head.kernel: the kernel's sectioning commands, with the numbering
 * parameters (\secnumdepth, a chapter's or section's number style).
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { headingCommand, levelOf, numberingLines } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: (_params, _parentType, node) => {
      const declarations = node === undefined ? [] : numberingLines(p, levelOf(node));
      return declarations.length === 0 ? {} : { declarations };
    },
    emit: (node, content) => headingCommand(node, content),
  };
};

export default realize;
