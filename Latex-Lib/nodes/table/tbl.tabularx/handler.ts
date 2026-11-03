/**
 * tbl.tabularx: \begin{tabularx}{width}{X…} … \end{tabularx}, a table of a
 * fixed width whose X columns share the room; X columns ragged or centred
 * with >{\raggedright\arraybackslash}X, a natural first column, | and \hline.
 * CTAN: https://ctan.org/pkg/tabularx
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { floated, gridOf, hasHeader, ruledRows, rowLines, spanning, withSetup } from '../node.ts';
import key from './key.ts';

const ALIGN: { readonly [a: string]: string } = { justify: 'X', left: '>{\\raggedright\\arraybackslash}X', center: '>{\\centering\\arraybackslash}X', right: '>{\\raggedleft\\arraybackslash}X' };

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({ packages: ['\\usepackage{tabularx}'] }),
    emit: (node, content, context) => {
      // A spanning cell is a paragraph of its columns' share of the table's width (`spanning`): a `c` span as wide as its text
      // left the X columns 1em ("X Columns too narrow": 84 branches, 20,755 entries in article.A, oracle 4, e.g. 7662c7ed15).
      const g = gridOf(node, content, spanning(p['vrules'] === false ? '' : '|', param(p, 'width', '\\linewidth')));
      const x = ALIGN[param(p, 'align', 'justify')] ?? 'X';
      // A natural first column (label-column's l) is an \hbox: a list, statement or code block in it stops at "Something's
      // wrong--perhaps a missing \item" (\addvspace outside vertical mode), and a row span there, \multirow{n}{=}, takes \linewidth,
      // the whole line. A table whose first-column cells hold either keeps that column an X column. A first cell spanning columns is
      // a \multicolumn p-box and holds blocks safely; a cell under a span from above is no first cell.
      const blocks = (c: { readonly attrs?: { readonly [name: string]: unknown } | null; readonly content?: readonly { readonly type: string }[] }): boolean =>
        Number(c.attrs?.['rowspan'] ?? 1) > 1 || (c.content ?? []).some((child) => child.type !== 'paragraph');
      let cover = 0;
      let wraps = false;
      for (const row of node.content ?? []) {
        if (cover > 0) {
          cover--;
          continue;
        }
        const c = row.content?.[0];
        if (c === undefined || Number(c.attrs?.['colspan'] ?? 1) > 1) continue;
        if (blocks(c)) {
          wraps = true;
          break;
        }
      }
      const first = wraps ? 'X' : param(p, 'firstColumn', 'X');
      const letters = Array.from({ length: g.columns }, (_, i) => (i === 0 && first !== 'X' ? first : x));
      const sep = p['vrules'] === false ? '' : '|';
      const rows = ruledRows(rowLines(g), param(p, 'rules', 'all'), hasHeader(node), undefined, g);
      return floated(node, withSetup(p, `\\begin{tabularx}{${param(p, 'width', '\\linewidth')}}{${sep}${letters.join(sep)}${sep}}\n${rows.join('\n')}\n\\end{tabularx}`), context);
    },
  };
};

export default realize;
