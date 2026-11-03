/**
 * fig.graphicx: \includegraphics[width=…]{file} in a figure float
 * (\begin{figure}[placement] … \caption … \label … \end{figure}), or alone
 * in the text; figure* across both columns; \graphicspath for a folder;
 * keepaspectratio under a height limit. Alone in the text and flush
 * (`\noindent`), a head still waiting there (a statement's above it) is first
 * set on its own line (`\LatexLibHeadOwnLine`, protocol.ts): beside an image a
 * line wide it ran past the line by its width (run 41584963423: 975 not-denied
 * branches failed on that alone, all @inline). A float leaves the head to the
 * next line, and a centred image lets it end its own line. [F3]
 * CTAN: https://ctan.org/pkg/graphicx
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { HEAD_OWN_LINE, headOwnLine, param } from '../../protocol.ts';
import { inFloat, inlineLabel, pathLines, pathOf, placementOf, widthOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = [...pathLines(param(p, 'graphicsPath')), ...(p['float'] === false && p['center'] === false ? [HEAD_OWN_LINE] : [])];
  return {
    preamble: () => ({ packages: ['\\usepackage{graphicx}'], ...(declarations.length === 0 ? {} : { declarations }) }),
    emit: (node, content, context) => {
      if (pathOf(node) === '') return '';
      const height = param(p, 'maxHeight');
      const image = `\\includegraphics[width=${widthOf(node, param(p, 'unit', 'linewidth'))}${height === '' ? '' : `,height=${height},keepaspectratio`}]{${pathOf(node)}}`;
      if (p['float'] === false && p['center'] === false) return headOwnLine(`\\noindent${image}${inlineLabel(node)}\n\n`);
      if (p['float'] === false) return `\\begin{center}\n${image}\n\\end{center}${inlineLabel(node)}\n\n`;
      return inFloat(p['span'] === true ? 'figure*' : 'figure', placementOf(node, 'h!', param(p, 'placement', 'htbp')), p['center'] !== false, image, node, context, p['captionAbove'] === true);
    },
  };
};

export default realize;
