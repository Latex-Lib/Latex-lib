/**
 * fig.graphicx: \includegraphics[width=…]{file} in a figure float
 * (\begin{figure}[placement] … \caption … \label … \end{figure}), or alone
 * in the text; figure* across both columns; \graphicspath for a folder;
 * keepaspectratio under a height limit.
 * CTAN: https://ctan.org/pkg/graphicx
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { inFloat, inlineLabel, pathLines, pathOf, placementOf, widthOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = pathLines(param(p, 'graphicsPath'));
  return {
    preamble: () => ({ packages: ['\\usepackage{graphicx}'], ...(declarations.length === 0 ? {} : { declarations }) }),
    emit: (node, content, context) => {
      if (pathOf(node) === '') return '';
      const height = param(p, 'maxHeight');
      const image = `\\includegraphics[width=${widthOf(node, param(p, 'unit', 'linewidth'))}${height === '' ? '' : `,height=${height},keepaspectratio`}]{${pathOf(node)}}`;
      if (p['float'] === false) return `${p['center'] === false ? '\\noindent' : '\\begin{center}\n'}${image}${p['center'] === false ? '' : '\n\\end{center}'}${inlineLabel(node)}\n\n`;
      return inFloat(p['span'] === true ? 'figure*' : 'figure', placementOf(node, 'h!', param(p, 'placement', 'htbp')), p['center'] !== false, image, node, context, p['captionAbove'] === true);
    },
  };
};

export default realize;
