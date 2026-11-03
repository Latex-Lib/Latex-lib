/**
 * fig.wrapfig: \begin{wrapfigure}[lines]{placement}[overhang]{width} …
 * \end{wrapfigure}, the text wrapping round the image; placement r, l, i, o
 * (upper case lets it float). Not in lists, columns or boxes.
 * CTAN: https://ctan.org/pkg/wrapfig (the package's usage notes)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { captionLines, pathOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const lines = typeof p['lines'] === 'number' && p['lines'] > 0 ? `[${p['lines']}]` : '';
  const overhang = param(p, 'overhang') === '' ? '' : `[${param(p, 'overhang')}]`;
  const raise = param(p, 'raise') === '' ? '' : `\\vspace{-${param(p, 'raise')}}\n`;
  return {
    preamble: () => ({ packages: ['\\usepackage{graphicx}', '\\usepackage{wrapfig}'] }),
    emit: (node, content, context) =>
      pathOf(node) === '' ? '' : `\\begin{wrapfigure}${lines}{${param(p, 'side', 'r')}}${overhang}{${param(p, 'width', '0.45\\linewidth')}}\n\\centering\n${raise}\\includegraphics[width=\\linewidth]{${pathOf(node)}}${captionLines(node, context)}\n\\end{wrapfigure}\n`,
  };
};

export default realize;
