/**
 * code.verbatim: the kernel's verbatim environment; fancyvrb's
 * \begin{Verbatim}[frame=…, numbers=…, fontsize=…, xleftmargin=…]; or
 * alltt, where LaTeX commands still work, so escapes print as LaTeX.
 * CTAN: https://ctan.org/pkg/fancyvrb, https://ctan.org/pkg/alltt
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { alltt, codeText, plainCaption } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const pkg = param(p, 'package', 'kernel');
  const keys = [
    ...(param(p, 'frame', 'none') === 'none' ? [] : [`frame=${param(p, 'frame')}`]),
    ...(param(p, 'numbers', 'none') === 'none' ? [] : [`numbers=${param(p, 'numbers')}`]),
    ...(param(p, 'fontsize') === '' ? [] : [`fontsize=${param(p, 'fontsize')}`]),
    ...(param(p, 'indent') === '' ? [] : [`xleftmargin=${param(p, 'indent')}`]),
  ];
  return {
    preamble: () => (pkg === 'fancyvrb' ? { packages: ['\\usepackage{fancyvrb}'] } : pkg === 'alltt' ? { packages: ['\\usepackage{alltt}'] } : {}),
    emit: (node, content, context) => {
      if (pkg === 'fancyvrb') return `\\begin{Verbatim}${keys.length === 0 ? '' : `[${keys.join(',')}]`}\n${codeText(content, () => '')}\n\\end{Verbatim}\n${plainCaption(context)}\n`;
      if (pkg === 'alltt') return `\\begin{alltt}\n${codeText(content, (latex) => latex, alltt)}\n\\end{alltt}\n${plainCaption(context)}\n`;
      return `\\begin{verbatim}\n${codeText(content, () => '')}\n\\end{verbatim}\n${plainCaption(context)}\n`;
    },
  };
};

export default realize;
