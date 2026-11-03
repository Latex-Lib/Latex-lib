/**
 * math.kernel (containerBlock/blockMath). Display maths without amsmath: \[ … \] for one unnumbered line, equation for a numbered one, eqnarray for several lines.
 * \counterwithin (the kernel's since 2018) numbers equations within a section.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { alignedRow, amsDisplay, cellDisplay, joinRows, kindOf, labelOf, rowsOf, TABLE_CELLS } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => (param(p, 'numberWithin', 'none') === 'none' ? {} : { declarations: [`\\counterwithin{equation}{${param(p, 'numberWithin')}}`] }),
    emit: (node, content, context, parentType) => {
      const rows = rowsOf(content);
      if (rows.length === 0) return '';
      // In a table cell, one inline island, as General prints it (`cellDisplay`).
      if (TABLE_CELLS.has(parentType ?? '')) return cellDisplay(node, rows);
      const k = kindOf(node);
      if (rows.length === 1) {
        // A row with & or \\ goes in amsmath's aligned (every Flouest preamble loads amsmath), as General does: bare it stopped at
        // "Misplaced alignment tab character &". A split goes in equation*, not \[ … \] (MB2's reason: with ntheorem's thmmarks a split
        // in \[ … \] leaves its alignment open, "Bad math environment delimiter").
        const row = alignedRow(rows[0] ?? '');
        if (k === 'display') return /\\begin\{split\}/u.test(row) ? `\\begin{equation*}\n${row}\n\\end{equation*}\n\n` : `\\[\n${row}\n\\]\n\n`;
        if (k === 'equation') return `\\begin{equation}\n${row}${labelOf(node)}\n\\end{equation}\n\n`;
      }
      // eqnarray has three columns: an align-style row with more than two & (x &= 1 & y &= 2) stopped at "Extra alignment tab has been
      // changed to \cr". Such rows take amsmath's align, as math.amsmath prints them.
      if (rows.some((r) => (r.match(/(?<!\\)&/gu) ?? []).length > 2)) return amsDisplay(node, content, 'align');
      const env = k === 'display' ? 'eqnarray*' : 'eqnarray';
      return `\\begin{${env}}\n${joinRows(rows)}${k === 'display' ? '' : labelOf(node)}\n\\end{${env}}\n\n`;
    },
  };
};

export default realize;
