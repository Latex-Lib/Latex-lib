/**
 * fig.adjustbox: \adjustimage{keys}{file}, the image sized and placed by
 * keys: width, max width or scale; center; fbox for a frame; bgcolor for a
 * ground (xcolor); in a figure float or alone.
 * CTAN: https://ctan.org/pkg/adjustbox
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { inFloat, inlineLabel, pathOf, placementOf, widthOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const background = param(p, 'background');
  return {
    preamble: () => ({ packages: ['\\usepackage{adjustbox}', ...(background === '' ? [] : ['\\usepackage{xcolor}'])] }),
    emit: (node, content, context) => {
      if (pathOf(node) === '') return '';
      const sizing = param(p, 'sizing', 'width');
      const keys = [
        sizing === 'scale' ? `scale=${typeof p['scale'] === 'number' ? p['scale'] : 1}` : sizing === 'max-width' ? `max width=${widthOf(node)}` : `width=${widthOf(node)}`,
        ...(param(p, 'frame') === '' ? [] : [`fbox=${param(p, 'frame')}`]),
        ...(background === '' ? [] : [`bgcolor=${background}`]),
        ...(p['center'] === false ? [] : ['center']),
      ];
      const image = `\\adjustimage{${keys.join(',')}}{${pathOf(node)}}`;
      return p['float'] === false ? `\\noindent${image}${inlineLabel(node)}\n\n` : inFloat('figure', placementOf(node, 'h!', param(p, 'placement', 'htbp')), false, image, node, context);
    },
  };
};

export default realize;
