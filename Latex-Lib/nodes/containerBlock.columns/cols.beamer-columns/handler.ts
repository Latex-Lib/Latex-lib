/**
 * cols.beamer-columns: beamer's own columns, \begin{columns}[T] \begin{column}{0.48\textwidth} … \end{column} … \end{columns},
 * inside a frame; the blocks (split at top-level blank lines only, `blocksOf`) shared out across the columns in order. Columns of
 * equal width, 0.48 of the text width for two and 0.31 for three, so a gap is left between them under onlytextwidth too (beamer
 * spreads the rest of the width between the columns); [T], [c] or [b] for the vertical alignment, onlytextwidth to keep the
 * columns to the text width. One column is the content as it stands. beamer has no \columnsep: the node's gap is not printed.
 * Manual: https://ctan.org/pkg/beamer (beameruserguide, "Splitting a Frame into Multiple Columns"); the environments are
 * \newenvironment<>{columns}[1][] and {column} in beamerbaseframecomponents.sty (v3.78).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { countOf } from '../node.ts';
import { blocksOf, shareOut } from './blocks.ts';
import key from './key.ts';

/** Each column's share of the text width, by count: what 0001-digital-minimal and 0114-scu-beamer give two columns (0.48\textwidth). */
const WIDTH: { readonly [count: number]: string } = { 2: '0.48', 3: '0.31' };

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const options = [param(p, 'align', 'T'), ...(p['onlytextwidth'] === true ? ['onlytextwidth'] : [])].join(',');
  return {
    preamble: () => ({}),
    emit: (node, content) => {
      const n = countOf(node);
      if (n === 1) return `${content.trim()}\n\n`;
      const width = WIDTH[n] ?? '0.48';
      const columns = shareOut(blocksOf(content), n).map((blocks) => `\\begin{column}{${width}\\textwidth}\n${blocks.join('\n\n')}\n\\end{column}`);
      return `\\begin{columns}[${options}]\n${columns.join('\n')}\n\\end{columns}\n\n`;
    },
  };
};

export default realize;
