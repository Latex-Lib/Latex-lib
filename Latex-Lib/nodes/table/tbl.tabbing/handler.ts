/**
 * tbl.tabbing: the kernel's \begin{tabbing} … \end{tabbing}, columns at tab
 * stops set by a first line ended with \kill, cells separated by \>, each
 * field a paragraph that wraps at its stop; no rules, no float, no caption.
 * CTAN: https://ctan.org/pkg/latex-base (usrguide, tabbing)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { gridOf, rowLines, withoutCellColour } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    emit: (node, content) => {
      const stop = param(p, 'firstStop');
      // The first stop as given, but at most 0.4\linewidth: label-value's 5cm (142pt) left the other fields of a 115pt
      // multicols*{3} column a negative width (d028a07c543e9e8ee86c4, article.A).
      const first = stop === '' ? '' : `\\ifdim${stop}>0.4\\linewidth 0.4\\linewidth\\else ${stop}\\fi`;
      // A column's width: the first stop's when given; the others share the rest of the line.
      const widthOf = (column: number, columns: number): string =>
        column === 0 && first !== '' ? first : first === '' ? `\\linewidth/${columns}` : `(\\linewidth-${first})/${Math.max(1, columns - 1)}`;
      // Each field a paragraph as wide as its columns, less 1em before the next stop. A tabbing line is \hbox to\linewidth{…\hss}:
      // a longer field ran over the next one and past the line with no Overfull report (article.A, oracle 4: 457 of 504 fit
      // branches failed on a sentinel up to 1032pt right of the block, e.g. 5f08f5b4b9). tabbing has no \multicolumn ("Misplaced
      // \omit"): a spanning cell is one field across its stops.
      const field = (cell: string, column: number, n: number, columns: number): string => {
        const width = Array.from({ length: n }, (_, k) => `\\dimexpr${widthOf(column + k, columns)}\\relax`).join('+');
        // A field draws no background (`withoutCellColour`): a shaded header cell's \cellcolor had no colortbl cell to paint, so it never
        // showed and colortbl kept it pending (36 tbl.tabbing@label-value verdicts with tbl.header@shaded in the copy's index4).
        return `\\parbox[t]{\\dimexpr${width}${column + n < columns ? '-1em' : ''}\\relax}{\\raggedright ${withoutCellColour(cell)}}`;
      };
      // A span is one \parbox across its n stops; the next field starts n stops on, so the span is followed by n-1 empty fields. With
      // one \> the next field went to the stop inside the span and was set over it (tabbing moves to absolute stops).
      const g = gridOf(node, content, (n, cell, column, columns) => `${field(cell, column, n, columns)}${' \\>'.repeat(column + n < columns ? n - 1 : 0)}`, (cell, column, columns) => field(cell, column, 1, columns));
      const stops = Array.from({ length: g.columns }, (_, i) => (i === 0 && first !== '' ? `\\hspace*{\\dimexpr${first}\\relax}\\=` : `\\hspace{\\dimexpr${widthOf(i, g.columns)}\\relax}\\=`)).join('');
      return `\\begin{tabbing}\n${stops}\\kill\n${rowLines(g, ' \\> ').join('\n')}\n\\end{tabbing}\n\n`;
    },
  };
};

export default realize;
