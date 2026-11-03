/**
 * fig.rotating: \begin{sidewaysfigure} … \end{sidewaysfigure}, the whole
 * float on its side on a page of its own (figuresright or figuresleft fix
 * which way); or only the image turned with \rotatebox{angle}{…} in a figure.
 * CTAN: https://ctan.org/pkg/rotating
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { inFloat, pathOf, placementOf, widthOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const direction = param(p, 'direction', 'class');
  return {
    preamble: () => ({ packages: ['\\usepackage{graphicx}', direction === 'class' ? '\\usepackage{rotating}' : `\\usepackage[${direction}]{rotating}`] }),
    emit: (node, content, context) => {
      if (pathOf(node) === '') return '';
      const image = `\\includegraphics[width=${widthOf(node)}]{${pathOf(node)}}`;
      if (param(p, 'turn', 'float') === 'image') return inFloat('figure', placementOf(node, 'h!'), true, `\\rotatebox{${typeof p['angle'] === 'number' ? p['angle'] : 90}}{${image}}`, node, context);
      return inFloat('sidewaysfigure', '', true, image, node, context);
    },
  };
};

export default realize;
