/**
 * ack.bmhead (containerBlock/acknowledgement). Springer Nature's back matter: \backmatter, once per document, then
 * \bmhead{Acknowledgements} and the text, as sn-article.tex l.535 and 545 write it. The manual's rule is that every back-matter
 * head is a \bmhead after \backmatter (manual §8.1, §5); \backmatter only sets a flag and prints nothing (sn-jnl.cls l.1365-1366),
 * \bmhead is an unnumbered, bold, run-in heading (l.950-953). The switch \LatexLibBackmatter runs \backmatter once, as
 * num.appendix runs \appendix once, so a second acknowledgement (or another back-matter way testing the same switch) adds only
 * its own head. The node's title, when it has one, is the head; else the preset's.
 * Requirement: Template/template-requirement/Springer_Nature_SN_Jnl.md l.55, 111, 155.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, field, labelLine, param } from '../../protocol.ts';
import key from './key.ts';

export const BACKMATTER_ONCE = '\\ifdefined\\LatexLibBackmatter\\else\\backmatter\\global\\let\\LatexLibBackmatter\\empty\\fi';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    emit: (node, content) => {
      // The node's own title is plain text (escaped, as General's is); the preset's is LaTeX.
      const title = field(node, 'title') === '' ? param(p, 'title', 'Acknowledgements') : escapeText(field(node, 'title'));
      return `${BACKMATTER_ONCE}\n\\bmhead{${title}}${labelLine(field(node, 'label'))}\n${content.trim()}\n\n`;
    },
  };
};

export default realize;
