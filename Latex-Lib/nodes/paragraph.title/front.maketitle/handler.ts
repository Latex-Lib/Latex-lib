/**
 * front.maketitle: \title, \author and \date just before \maketitle, where
 * the title stands; \date{} for no date, \date{\today} for today's.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { titleLinesWith } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    // The title lines go in the body, just before \maketitle, not in the preamble: revtex4-2 resets \@title to its "No title" warning
    // (revtex4-2.cls l.2121-2126), clears the authors (l.2154) and the affiliation lists (l.2382) at \begin{document}, and aastex701 does
    // the same (aastex701.cls l.1922). All 43 batch-3b revtex4-2-aps.A title documents that use \maketitle logged "Class revtex4-2 Warning:
    // No title." (e.g. result b60d1c3a274a: then "No pages of output."). The kernel's \title, \author and \date only store their text until
    // \maketitle, so the body serves every class as well.
    preamble: () => ({}),
    emit: (node, content) => `${titleLinesWith(node, content, param(p, 'date', 'given')).join('\n')}\n\\maketitle\n\n`,
  };
};

export default realize;
