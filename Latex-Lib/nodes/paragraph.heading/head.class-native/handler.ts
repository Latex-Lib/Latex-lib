/**
 * head.class-native: the kernel commands under the class's own look; nothing
 * restyled, nothing loaded.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import type { Realization } from '../../../schema/realization.ts';
import { headingCommand } from '../node.ts';

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  preamble: () => ({}),
  emit: (node, content) => headingCommand(node, content),
});

export default realize;
