/**
 * head.class-native: the kernel commands under the class's own look; nothing
 * restyled, nothing loaded. With `sectionWithinChapter`, sections number
 * within chapters, \numberwithin{section}{chapter} (amsmath's, which amsbook
 * loads itself: amsbook-template.tex l.56).
 * CTAN: https://ctan.org/pkg/latex-base
 */
import type { Realization } from '../../../schema/realization.ts';
import { headingCommand } from '../node.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => ({
  preamble: (_params, _parentType, node) => (given['sectionWithinChapter'] === true && node !== undefined ? { declarations: ['\\numberwithin{section}{chapter}'] } : {}),
  emit: (node, content) => headingCommand(node, content),
});

export default realize;
