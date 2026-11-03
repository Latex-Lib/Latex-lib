/**
 * tbl.nicematrix: a key-value table. tabularray's \begin{tblr}{colspec={…},
 * hspan=minimal, hlines, vlines, hline{1,Z}={1pt}, row{1}={font=\bfseries},
 * row{even}={bg=…}} with spans by \SetCell[c=n]{c}, wrapped in their
 * columns; or nicematrix's \begin{NiceTabular}{…}[hvlines] (p-columns for
 * l, c, r) with \rowcolors in its \CodeBefore and spans by \Block{1-n}{…}.
 * CTAN: https://ctan.org/pkg/tabularray (chapters 2 and 3), https://ctan.org/pkg/nicematrix (sections 4 to 6)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { columnSpec, floated, gridOf, noPar, rowLines, withoutCellColour, withSetup } from '../node.ts';
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
        // \Block reads its text as an argument, so a cell's paragraph end is kept out of it too (`noPar`). Its text keeps its natural
        // width. Set in a \parbox of the span's share (batch 4's C5(b)), it still shipped right of the text block: the probe of
        // d8d9bc7a7d361b6b16f25's branches (staging article.A document db9e308a4b8819cd9ca3e, result 57d65009bc) put a span's
        // sentinel at x 570.1pt unmarked and 571.9pt marked, past the block's 479.3pt (oracle 4, natural: 584.8pt and 1062.3pt).
        // So the width nicematrix gives the block is not the outer \linewidth, and the parbox was dropped, as its gate said. A span
        // wider than its columns still sticks out with no Overfull report (47 only-outside cases in article.A, oracle 4).
        const g = gridOf(node, content, (n, cell) => `\\Block{1-${n}}{${noPar(cell)}}${' &'.repeat(n - 1)}`);
        // X columns share the width given by the width key (nicematrix, 8.3).
        const keys = [...(colspec === 'X' ? ['width=\\linewidth'] : []), ...(NICE_LINES[lines] === '' || NICE_LINES[lines] === undefined ? [] : [NICE_LINES[lines]])].join(',');
        const before = zebra === '' ? '' : `\\CodeBefore\n\\rowcolors{2}{${zebra}}{}\n\\Body\n`;
        // l, c and r are p-columns sharing the line, set ragged right, centred or ragged left (columnSpec; nicematrix loads array):
        // a natural column is as wide as its cell's paragraph.
        const letters = colspec === 'X' ? 'X'.repeat(g.columns) : columnSpec(colspec, g.columns, false);
        return floated(node, withSetup(p, `\\begin{NiceTabular}{${letters}}${keys === '' ? '' : `[${keys}]`}\n${before}${rowLines(g).join('\n')}\n\\end{NiceTabular}`), context);
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
