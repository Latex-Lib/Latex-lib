/**
 * fig.caption-only: a figure float holding only the caption and the label, \begin{figure}[!h] \caption{…} \label{…}
 * \end{figure}, and no graphic: PLOS takes figure files apart from the manuscript ("DO NOT INCLUDE GRAPHICS IN YOUR
 * MANUSCRIPT", plos_latex_template.tex l.37-40), and its own figure holds only \caption and \label (l.274-278). The
 * image's file, width, crop and angle are not printed; a node with neither caption nor label prints nothing.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { field, labelKey, param } from '../../protocol.ts';
import { captionLines, placementOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    emit: (node, content, context) => {
      const caption = (context ?? '').trim();
      if (caption === '' && labelKey(field(node, 'label')) === '') return '';
      const placement = placementOf(node, 'h!', param(p, 'placement', '!h'));
      return `\\begin{figure}${placement === '' ? '' : `[${placement}]`}${captionLines(node, caption)}\n\\end{figure}\n\n`;
    },
  };
};

export default realize;
