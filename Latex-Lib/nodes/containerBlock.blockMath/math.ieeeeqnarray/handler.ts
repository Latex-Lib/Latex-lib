/**
 * math.ieeeeqnarray (containerBlock/blockMath): IEEEtran's IEEEeqnarray{rCl} (IEEEtran.cls l.3621), IEEEeqnarray* when
 * unnumbered. Each row's lines (split at \\) are split at their first & into left side, relation and right side
 * (`a &= b` gives `a & = & b`); a line already in rCl's form (two &) is kept, one with no & spans the three columns.
 * A row's own \label stays on its last line, the block's label on the last line of the display.
 * CTAN: https://ctan.org/pkg/ieeetran (IEEEtran_HOWTO, "IEEEeqnarray")
 */
import type { Realization } from '../../../schema/realization.ts';
import { amsDisplay, cellDisplay, kindOf, labelOf, rowsOf, TABLE_CELLS } from '../node.ts';
import { linesOf, rclLine, tabsOf } from './lines.ts';

/** A row's math and its trailing \label (a row Flouest labelled), apart. */
const splitLabel = (row: string): { readonly math: string; readonly label: string } => {
  const label = /\n(\\label\{[^{}\n]+\})$/u.exec(row)?.[1] ?? '';
  return { math: label === '' ? row : row.slice(0, -label.length).trimEnd(), label };
};

/** A line ending in a %-comment ends on its own line, or the comment takes what follows. */
const closeComment = (line: string): string => (/(?<!\\)%[^\n]*$/u.test(line) ? `${line}\n` : line);

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  preamble: () => ({ packages: ['\\usepackage{amsmath}'] }),
  emit: (node, content, _context, parentType) => {
    const rows = rowsOf(content);
    if (rows.length === 0) return '';
    // In a table cell, one inline island, as General prints it (`cellDisplay`).
    if (TABLE_CELLS.has(parentType ?? '')) return cellDisplay(node, rows);
    const parts = rows.map(splitLabel);
    const lines = parts.flatMap((r) => linesOf(r.math));
    // rCl has three columns: an align-style line with more than two & (x &= 1 & y &= 2) would stop at "Extra & in your
    // IEEEeqnarray", and a nested environment (aligned, split, cases, a matrix) holds &s and \\ of its own. Those displays
    // are printed as math.amsmath prints them.
    if (parts.some((r) => /\\begin\{/u.test(r.math)) || lines.some((l) => tabsOf(l.line).length > 2)) return amsDisplay(node, content, 'auto', parentType);
    const body = parts
      .map((r) =>
        linesOf(r.math)
          .map((l, i, all) => {
            const line = rclLine(l.line);
            const label = i === all.length - 1 && r.label !== '' ? ` ${r.label}` : '';
            return i === all.length - 1 ? closeComment(`${line}${label}`) : `${closeComment(line)} ${l.brk}\n`;
          })
          .join(''),
      )
      .join(' \\\\\n');
    const numbered = kindOf(node) !== 'display';
    const env = numbered ? 'IEEEeqnarray' : 'IEEEeqnarray*';
    return `\\begin{${env}}{rCl}\n${body}${numbered ? labelOf(node) : ''}\n\\end{${env}}\n\n`;
  },
});

export default realize;
