/**
 * cols.tikzposter: tikzposter's columns of blocks, \begin{columns} \column{0.33} \block{…}{…} … \column{0.34} … \end{columns},
 * at the top level of the poster: the blocks (split at top-level blank lines only, `blocksOf`) shared out across the columns in
 * order. A poster lays out only its blocks, so what is not already a \block (a paragraph, a list) is wrapped in an untitled
 * \block{}{…}, consecutive pieces of one column together. Widths: equal (0.5/0.5, 0.33/0.34/0.33), wide-middle (0.3/0.4/0.3),
 * or a list of fractions such as 0.25,0.5,0.25 (equal where the list's length is not the node's count). One column is
 * \column{1}. The node's gap is not printed: tikzposter's column gap is the class option colspace, on the class line.
 * Manual: https://ctan.org/pkg/tikzposter (tikzposter.pdf, "Columns" and "Blocks").
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { countOf } from '../node.ts';
import { blocksOf, shareOut } from './blocks.ts';
import key from './key.ts';

const EQUAL: { readonly [count: number]: readonly string[] } = { 1: ['1'], 2: ['0.5', '0.5'], 3: ['0.33', '0.34', '0.33'] };
const WIDE_MIDDLE: { readonly [count: number]: readonly string[] } = { 3: ['0.3', '0.4', '0.3'] };

/** The columns' widths for `n` columns under the `widths` param: a style, or a comma list of fractions of the poster's width. */
const widthsOf = (widths: string, n: number): readonly string[] => {
  const equal = EQUAL[n] ?? ['0.5', '0.5'];
  if (widths === 'equal') return equal;
  if (widths === 'wide-middle') return WIDE_MIDDLE[n] ?? equal;
  const list = widths.split(',').map((w) => w.trim());
  return list.length === n && list.every((w) => /^(0?\.\d+|1(\.0*)?)$/u.test(w)) ? list : equal;
};

/** A column's blocks, each piece that is not a \block (nor tikzposter's \note pinned to one) put in an untitled \block{}{…}. */
const asBlocks = (pieces: readonly string[]): string => {
  const out: string[] = [];
  let loose: string[] = [];
  const flush = (): void => {
    if (loose.length > 0) out.push(`\\block{}{\n${loose.join('\n\n')}\n}`);
    loose = [];
  };
  for (const piece of pieces) {
    if (/^\\(block|note)\b/u.test(piece.trimStart())) {
      flush();
      out.push(piece);
    } else loose.push(piece);
  }
  flush();
  return out.join('\n\n');
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    emit: (node, content) => {
      const n = countOf(node);
      const widths = widthsOf(param(p, 'widths', 'equal'), n);
      const columns = shareOut(blocksOf(content), n).map((pieces, i) => `\\column{${widths[i] ?? '0.5'}}\n${asBlocks(pieces)}`);
      return `\\begin{columns}\n${columns.join('\n\n')}\n\\end{columns}\n\n`;
    },
  };
};

export default realize;
