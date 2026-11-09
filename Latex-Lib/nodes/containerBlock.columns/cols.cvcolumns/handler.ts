/**
 * cols.cvcolumns: moderncv's own columns, \begin{cvcolumns} \cvcolumn{}{…} … \end{cvcolumns}, each column a \cvcolumn with
 * an empty head (the node has no column titles), the blocks (split at top-level blank lines only, `blocksOf`) shared out across
 * them in order. The class sets the columns in a top-aligned tabular inside \cvitem{}{…}, on the CV's main column, with
 * \separatorcolumnwidth between them (moderncv.cls l.660-723), so the node's gap is not used. A column without a width takes an
 * equal share of what the given widths leave (l.676-679, 728-741).
 * Source: moderncv.cls l.653-750; the template's References section, Source/0196-moderncv/template.tex l.249-254.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { countOf } from '../node.ts';
import { blocksOf, shortArgument } from './blocks.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const lastWidth = param(p, 'widths', 'equal') === 'wide-last' ? '0.5' : '';
  return {
    preamble: () => ({}),
    emit: (node, content) => {
      const blocks = blocksOf(content);
      const n = countOf(node);
      // Each column takes an even share of the blocks, the earlier columns the extra ones (4 blocks in 3 columns: 2, 1, 1).
      const start = (i: number): number => Math.ceil((i * blocks.length) / n);
      const columns = Array.from({ length: n }, (_, i) => {
        const text = shortArgument(blocks.slice(start(i), start(i + 1)).join('\n\n'));
        // The template's [0.5] on the last column (template.tex l.254); a single column keeps the whole width.
        const width = lastWidth !== '' && n > 1 && i === n - 1 ? `[${lastWidth}]` : '';
        return `  \\cvcolumn${width}{}{${text}}`;
      });
      return `\n\\begin{cvcolumns}\n${columns.join('\n')}\n\\end{cvcolumns}\n\n`;
    },
  };
};

export default realize;
