/**
 * num.handset: appendices under the minimal class, which defines no \appendix, no \section and no size command but
 * \normalsize. The template sets each appendix by hand: \bigskip \noindent{\large\bfseries Appendix A\quad Derivation
 * Details}\par \medskip (Latex-Template-Examples/class.minimal/main.tex l.255-257, 265-266), its letters typed in. Here a
 * library counter letters them (\theLatexLibAppendix as \Alph), stepped by \refstepcounter so a label refers to the letter;
 * an unnumbered appendix (`numbered: false`) steps nothing and prints no word and letter. \large is provided as the template
 * provides it (l.48), and as ack.block's hand-set form does: a no-op where something defines it already.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { dataOf, escapeText, field, labelLine, param } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({
      declarations: [
        '\\providecommand{\\large}{\\fontsize{12}{14}\\selectfont}',
        '\\newcounter{LatexLibAppendix}',
        '\\renewcommand{\\theLatexLibAppendix}{\\Alph{LatexLibAppendix}}',
      ],
    }),
    emit: (node, content) => {
      const numbered = dataOf(node)['numbered'] !== false;
      // The node's own title is plain text (escaped, as General's is); the word is LaTeX.
      const title = escapeText(field(node, 'title'));
      const word = param(p, 'name', 'Appendix');
      const head = numbered ? `${word} \\theLatexLibAppendix${title === '' ? '' : `\\quad ${title}`}` : title === '' ? word : title;
      // An unnumbered appendix with a label gets an anchor, as num.appendix's does: else \label took the previous counter's.
      const anchor = !numbered && field(node, 'label') !== '' ? '\n\\ifdefined\\phantomsection\\phantomsection\\fi' : '';
      return (
        [
          `${numbered ? '\\refstepcounter{LatexLibAppendix}' : ''}\\bigskip`,
          `\\noindent{\\large\\bfseries ${head}}\\par${anchor}${labelLine(field(node, 'label'))}`,
          '\\medskip',
          '',
          content.trim(),
        ].join('\n') + '\n\n'
      );
    },
  };
};

export default realize;
