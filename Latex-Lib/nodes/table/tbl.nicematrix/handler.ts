/**
 * tbl.nicematrix: a key-value table. tabularray's \begin{tblr}{colspec={…},
 * hspan=minimal, hlines, vlines, hline{1,Z}={1pt}, row{1}={font=\bfseries},
 * row{even}={bg=…}} with spans by \SetCell[c=n]{c}, wrapped in their
 * columns; or nicematrix's \begin{NiceTabular}{…}[hvlines] (p-columns for
 * l, c, r) with \rowcolors in its \CodeBefore and spans as \multicolumn
 * paragraphs of their columns' share.
 * CTAN: https://ctan.org/pkg/tabularray (chapters 2 and 3), https://ctan.org/pkg/nicematrix (sections 4 to 6)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { columnSpec, floated, gridOf, rowLines, spanning, withoutCellColour, withSetup } from '../node.ts';
import key from './key.ts';

const TBLR_LINES: { readonly [l: string]: readonly string[] } = {
  all: ['hlines', 'vlines'],
  horizontal: ['hlines'],
  outer: ['hline{1,Z}={0.8pt}'],
  three: ['hline{1,Z}={1pt}', 'hline{2}={0.5pt}'],
  inner: ['hline{2-Y}={0.4pt}', 'vline{2-Y}={0.4pt}'],
  none: [],
};
const NICE_LINES: { readonly [l: string]: string } = { all: 'hvlines', horizontal: 'hlines', inner: 'hvlines-except-borders', outer: '', three: '', none: '' };

/**
 * A tblr cell's text. A leading \cellcolor goes (`withoutCellColour`): tabularray paints no colortbl colour, so the shade never
 * showed (18 tbl.nicematrix@tblr-zebra verdicts with tbl.header@shaded in the copy's index4). Braced when it holds an & or a \\ of
 * its own: tabularray splits the body it read at those outside braces, and a nested environment (General's aligned or cases rows,
 * a nested tbl.tabbing, raw LaTeX) does not protect them.
 */
const tblrCell = (cell: string): string => {
  const text = withoutCellColour(cell);
  return /(?<!\\)&|\\\\/u.test(text) ? `{${text}}` : text;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const nice = param(p, 'package', 'tabularray') === 'nicematrix';
  const lines = param(p, 'lines', 'all');
  const zebra = param(p, 'zebra');
  return {
    preamble: () => ({ packages: [nice ? '\\usepackage{nicematrix}' : '\\usepackage{tabularray}', ...(zebra === '' ? [] : ['\\usepackage{xcolor}'])] }),
    emit: (node, content, context) => {
      const colspec = param(p, 'colspec', 'X');
      if (nice) {
        // A span is a paragraph of its columns' share, as every other table way's (`spanning`, General's formula; no rule in the
        // spec, since nicematrix draws the rules): a `\multicolumn`, which NiceTabular supports (nicematrix.sty 7.11d
        // `\__nicematrix_multicolumn:nnn`). Its preamble is built as a cell's, so under `no-cell-nodes` its box goes in by TeX
        // (below), and the span joins the blocks that the rules nicematrix draws itself (hvlines, hvlines-except-borders) do not
        // cross (`\g__nicematrix_pos_of_blocks_seq`). It was `\Block{1-n}{…}` until b23 (TC1-NICE): a block keeps its text's natural
        // width, a span wider than its columns sticking out with no Overfull report, and nicematrix draws it after the array as a
        // PGF node (`\__nicematrix_draw_blocks:`), which the driver moves into place unseen by TeX's `\pdfsavepos` (below). A row
        // or cell leaf whose cell spans (the sample's group row, "Group 1: morning runs") held its sentinel there: in GitHub run
        // r2-461ed0e, 1,550 nice-hvlines and nice-zebra row and cell branches failed first on a sentinel right of the text block
        // (1,516 on nothing else; article.A d10561ac265ccdcb9d7c6, b8d90fbfea754d8c68696.0 at x 740.1pt, the block ending at
        // 479.3pt), unmarked ones 20 to 290pt out though their text fits, marked ones 470 to 800pt, a 600pt line of marked runs.
        // And since the host kept a table leaf's runs out of such a span (O1, host.ts), 1,084 marked NiceTabular leaves failed
        // only on the runs' pieces in one column's cell (16 and 31.6pt over in setup B). Batch 4's C5(b) had set the span in a
        // `\parbox` of its share and dropped it, because the probe (staging article.A db9e308a4b8819cd9ca3e, result 57d65009bc)
        // put its sentinel at x 570.1pt: that reading was the PGF node's, not the page's. GitHub probe b23-1 (run 41775212344),
        // d10561ac265ccdcb9d7c6 under article.A and article.B, both presets: no nicematrix message and no TeX error, the four row
        // sentinels inside the block (x 207 to 473pt), and the 16pt Overfull \hbox of the runs in one column's cell gone.
        const g = gridOf(node, content, spanning());
        // no-cell-nodes: each cell's box goes in by TeX (nicematrix's `\__nicematrix_node_cell_inactive:`, `\box_use_drop:N`), not
        // as a PGF node at the cell's base (`\pgfnode{rectangle}{base}`, inner sep 0: the same place on the page). xdvipdfmx moves a
        // node's box by the node's translation (pgfsys-dvipdfmx.def `\pgfsys@hboxsynced`: `pdf:btrans`), which TeX never sees, so a
        // `\pdfsavepos` in a cell (the pipeline's sentinel) read a place half the cell's width right of the real one. In run
        // 41584963423, 2,343 nice-hvlines and nice-zebra verdicts failed only on a sentinel right of the block (A 1,818, B 525), and
        // 2,330 of them (A 1,818, B 512) lie within the 10pt tolerance once that half width is taken off (article.A
        // d0bb6b22f845b272c2039, result 9f58a1b8d717: x 514.0pt against the block's 479.3pt, a 103pt cell; unmarked, no overfull
        // box). Only dotted lines (\Cdots and the like), corners, \SubMatrix, trees and the medium and large nodes need the cell
        // nodes, and this way writes none of them; hvlines, a `\multicolumn` span and the \CodeBefore use the row and column nodes (nicematrix.sty
        // 7.11d: the key's errors, `no-cell-nodes` in the Global keys; its manual gives it to speed compilation up). X columns share
        // the width given by the width key (nicematrix, 8.3).
        const keys = ['no-cell-nodes', ...(colspec === 'X' ? ['width=\\linewidth'] : []), ...(NICE_LINES[lines] === '' || NICE_LINES[lines] === undefined ? [] : [NICE_LINES[lines]])].join(',');
        const before = zebra === '' ? '' : `\\CodeBefore\n\\rowcolors{2}{${zebra}}{}\n\\Body\n`;
        // l, c and r are p-columns sharing the line, set ragged right, centred or ragged left (columnSpec; nicematrix loads array):
        // a natural column is as wide as its cell's paragraph.
        const letters = colspec === 'X' ? 'X'.repeat(g.columns) : columnSpec(colspec, g.columns, false);
        return floated(node, withSetup(p, `\\begin{NiceTabular}{${letters}}[${keys}]\n${before}${rowLines(g).join('\n')}\n\\end{NiceTabular}`), context);
      }
      const g = gridOf(node, content, (n, cell) => `\\SetCell[c=${n}]{c} ${tblrCell(cell)}${' &'.repeat(n - 1)}`, tblrCell);
      const inner = [
        // l, c and r are X columns set left, centred or right (X[l]): a natural tblr column is an \hbox, where a list or statement
        // in a cell stops at "missing \item", and as wide as its cell's paragraph.
        `colspec={${(colspec === 'X' ? 'X' : `X[${colspec}]`).repeat(g.columns)}}`,
        // A span's text wraps in the width of the columns it spans; by default tabularray widens them to the text's natural width
        // (article.A, oracle 4: 404.5pt past the line in 51 of 52 marked tblr-grid branches).
        'hspan=minimal',
        ...(TBLR_LINES[lines] ?? []),
        ...(p['headerBold'] === true ? ['row{1}={font=\\bfseries}'] : []),
        ...(zebra === '' ? [] : [`row{even}={bg=${zebra}}`]),
      ];
      return floated(node, withSetup(p, `\\begin{tblr}{${inner.join(', ')}}\n${rowLines(g).join('\n')}\n\\end{tblr}`), context);
    },
  };
};

export default realize;
