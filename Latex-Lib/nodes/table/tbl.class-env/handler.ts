/**
 * tbl.class-env: the table in the class's own form, one form per class family (`form`), each with the rows, spans and
 * header row every table way builds (`../node.ts`), the class's own rules and caption form, and nothing loaded:
 * - deluxetable (aastex701): \begin{deluxetable}{lc} \tablecaption{…} \tablehead{\colhead{…} & …} \startdata … \enddata,
 *   deluxetable* when `span`, \startlongtable before it when `long` (aastex701.cls l.8411-8420, 8527-8540, 11264-11385);
 * - longtab (aa): \longtab{\begin{longtable}…\end{longtable}}, which the class sets in one column at the end of the
 *   document (aa.cls l.1385-1422), \hline\hline over the header, the header repeated, as aa_example.tex l.329-345;
 * - ruledtabular (revtex4-2, its aip setting, aastex701): \begin{ruledtabular} around the tabular in a table float, the
 *   environment drawing the double rules and stretching the table to \hsize (revtex4-2.cls l.6901-6926; aastex701.cls l.6298);
 * - tbl (interact): \tbl{caption}{tabular} with the class's \toprule, \midrule, \bottomrule and \label last (interact.cls
 *   l.627-645, interactapasample.tex l.247-261, 279);
 * - cas (cas-sc, cas-dc): \begin{table}[width=…,cols=…,pos=…] and \begin{tabular*}{\tblwidth}, booktabs rules (cas-common.sty
 *   l.2070-2140; a bare [tbp] there is taken for the figure's position, l.2108-2116);
 * - mdpi: \begin{table}[H], \caption{…\label{…}}, \begin{tabularx}{\textwidth}{CC}, booktabs rules (mdpi template.tex l.223-237);
 * - copernicus: \tophline, \middlehline, \bottomhline (copernicus.cls l.2774-2777);
 * - oup (oup-authoring-template): \caption{…\label{…}}, a tabular (not the template's tabular*: see the case), the class's
 *   \toprule, \midrule, \botrule (oup-authoring-template.cls l.1910-1948, 1996-2080; its .tex l.258-271). The node has no notes,
 *   so no tablenotes;
 * - iopart: \begin{indented}\item[] around the tabular, \br, \mr, \br (iopart.cls l.912-938, through classes/iopart.ts);
 * - plos: | rules, \hline between rows, the template's \thickhline under the header row, \label last (plos_latex_template.tex
 *   l.107-122, 285-298).
 * Columns: `wrap` (default) gives every column a p-column sharing the line, as every table way does, so a cell wraps; `natural`
 * the templates' own l/c (cas L/C, plos's + rule) columns, as wide as their text. deluxetable always takes natural columns: the
 * class measures the table and turns one wider than 465pt sideways (aastex701.cls l.11346-11351), which a table of p-columns
 * sharing the 513pt line always is. mdpi always takes its C columns, which are tabularx X columns and wrap (mdpi.cls l.1714-1717).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { labelKey, param } from '../../protocol.ts';
import { columnSpec, gridOf, hasHeader, ruledRows, rowLines, spanning, tableAttr } from '../node.ts';
import key from './key.ts';

type Rules = { readonly top: string; readonly mid: string; readonly bottom: string; readonly between: string };
const BOOKTABS: Rules = { top: '\\toprule', mid: '\\midrule', bottom: '\\bottomrule', between: '' };

/** A natural spanning cell: centred, as wide as its text, keeping the left rule when it starts the row and its right one. */
const naturalSpan = (sep: string) => (n: number, cell: string, column = 0): string => `\\multicolumn{${n}}{${column === 0 ? sep : ''}c${sep}}{${cell}}`;

/** The first column left, the rest centred, as the class samples set them (`lcc`, cas `LCC`). */
const natural = (n: number, first = 'l', rest = 'c'): string => first + rest.repeat(Math.max(0, n - 1));

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const form = param(p, 'form', 'ruledtabular');
  const wrap = param(p, 'columns', 'wrap') !== 'natural';
  const size = param(p, 'fontSize');
  const star = p['span'] === true ? '*' : '';
  return {
    // Every form is the class's own: its environments, commands and the packages it preloads (longtable for aa, booktabs for
    // interact, cas and mdpi, tabularx and float for mdpi); the way prints no \usepackage.
    preamble: () => ({}),
    emit: (node, content, context) => {
      const caption = context !== undefined && context.trim() !== '' ? context.trim() : '';
      const label = labelKey(tableAttr(node, 'label'));
      const header = hasHeader(node);
      const below = node.attrs?.['captionPosition'] === 'bottom';
      const sized = (body: string): string => (size === '' ? body : `${size}\n${body}`);
      // The caption with \label after it (or inside it, `inside`); with no caption, the label after \refstepcounter{table}.
      const cap = (inside = false): string =>
        caption !== '' ? (inside ? `\\caption{${caption}${label === '' ? '' : `\\label{${label}}`}}` : `\\caption{${caption}}${label === '' ? '' : `\n\\label{${label}}`}`) : label === '' ? '' : `\\refstepcounter{table}\n\\label{${label}}`;
      const float = (open: string, close: string, body: string, captionLine: string, centering = true): string =>
        [open, ...(centering ? ['\\centering'] : []), ...(below ? [body, captionLine] : [captionLine, body]), close].filter((l) => l !== '').join('\n') + '\n\n';
      const tabular = (env: string, spec: string, rows: readonly string[], width = ''): string => `\\begin{${env}}${width === '' ? '' : `{${width}}`}{${spec}}\n${rows.join('\n')}\n\\end{${env}}`;

      switch (form) {
        case 'deluxetable': {
          const g = gridOf(node, content, naturalSpan(''));
          const lines = g.rows.map((fields) => fields.join(' & '));
          // \tablehead{} even with no header row: the class keeps the head globally (\pt@head), so a headless table after a headed
          // one printed the earlier table's head (probe aastex-deluxe, ZeroTeX-NG, 2026-11-07).
          const head = [`\\tablehead{${header && lines.length > 0 ? (g.rows[0] ?? []).map((f) => (f.startsWith('\\multicolumn') ? f : `\\colhead{${f}}`)).join(' & ') : ''}}`];
          const body = header ? lines.slice(1) : lines;
          // \tablecaption and \label before \tablehead (aastex701-sample.tex l.458-466); the class steps the counter itself at
          // \begin{deluxetable} and sets \@currentlabel (l.11299-11302), so a captionless label still refers to the table.
          return [
            ...(p['long'] === true ? ['\\startlongtable'] : []),
            `\\begin{deluxetable${star}}{${natural(g.columns)}}`,
            ...(size === '' ? [] : [`\\tabletypesize{${size}}`]),
            ...(caption === '' ? [] : [`\\tablecaption{${caption}}`]),
            ...(label === '' ? [] : [`\\label{${label}}`]),
            ...head,
            '\\startdata',
            // Rows joined by \\, none after the last: \startdata adds \crcr after them (l.11406), so a last \\ makes an empty row.
            body.join(' \\\\\n'),
            '\\enddata',
            `\\end{deluxetable${star}}`,
          ].join('\n') + '\n\n';
        }
        case 'longtab': {
          const g = gridOf(node, content, wrap ? spanning() : naturalSpan(''));
          const lines = rowLines(g);
          const spec = wrap ? columnSpec('equal', g.columns, false) : natural(g.columns);
          const first = caption !== '' ? `\\caption{${caption}}${label === '' ? '' : `\\label{${label}}`}\\\\` : label === '' ? '' : `\\label{${label}}\\\\`;
          const top = header && lines.length > 1 ? lines[0] ?? '' : '';
          const body = top === '' ? lines : lines.slice(1);
          // aa_example.tex l.329-345: the caption row, \hline\hline, the header, \hline, \endfirsthead; "continued." and the header
          // again, \endhead; \hline, \endfoot. longtable steps the table counter at its start, so the label needs no caption.
          const head = top === '' ? [first, '\\hline\\hline', '\\endfirsthead', ...(caption === '' ? [] : ['\\caption{continued.}\\\\']), '\\hline\\hline', '\\endhead'] : [first, '\\hline\\hline', top, '\\hline', '\\endfirsthead', ...(caption === '' ? [] : ['\\caption{continued.}\\\\']), '\\hline\\hline', top, '\\hline', '\\endhead'];
          return ['\\longtab{%', ...(size === '' ? [] : [size]), `\\begin{longtable}{${spec}}`, ...head, '\\hline', '\\endfoot', ...body, '\\end{longtable}}'].filter((l) => l !== '').join('\n') + '\n\n';
        }
        case 'mdpi': {
          const g = gridOf(node, content, spanning('', '\\textwidth'));
          const rows = ruledRows(rowLines(g), 'header', header, BOOKTABS);
          return float('\\begin{table}[H]', '\\end{table}', sized(tabular('tabularx', 'C'.repeat(g.columns), rows, '\\textwidth')), cap(true), false);
        }
        case 'tbl': {
          const g = gridOf(node, content, wrap ? spanning() : naturalSpan(''));
          const rows = ruledRows(rowLines(g), 'header', header, BOOKTABS);
          const t = tabular('tabular', wrap ? columnSpec('equal', g.columns, false) : natural(g.columns), rows);
          // \tbl{caption}{body} measures the body and centres it (interact.cls l.627-633); \label just before \end{table} (sample l.279).
          const body = caption !== '' ? `\\tbl{${caption}}{${sized(t)}}` : `{\\centering\n${sized(t)}\\par}${label === '' ? '' : '\n\\refstepcounter{table}'}`;
          return float(`\\begin{table${star}}[tbp]`, `\\end{table${star}}`, `${body}${label === '' ? '' : `\n\\label{${label}}`}`, '', false);
        }
        case 'cas': {
          const g = gridOf(node, content, wrap ? spanning('', '\\tblwidth') : naturalSpan(''));
          const rows = ruledRows(rowLines(g), 'header', header, BOOKTABS);
          const spec = wrap ? `@{\\extracolsep{\\fill}}${columnSpec('equal', g.columns, false)}` : `@{}${natural(g.columns, 'L', 'C')}@{}`;
          const pos = param(p, 'pos', 'tbp');
          return float(`\\begin{table${star}}[width=\\linewidth,cols=${g.columns},pos=${pos}]`, `\\end{table${star}}`, sized(tabular('tabular*', spec, rows, '\\tblwidth')), cap(), false);
        }
        case 'oup': {
          const g = gridOf(node, content, wrap ? spanning() : naturalSpan(''));
          const rows = ruledRows(rowLines(g), 'header', header, { top: '\\toprule', mid: '\\midrule', bottom: '\\botrule', between: '' });
          // A tabular, not the template's tabular*{\columnwidth}{@{\extracolsep\fill}…}: the contemporary layout (the template's
          // default) loads arydshln (oup-authoring-template.cls l.1977), and arydshln 1.76 breaks every tabular* on the engine's
          // LaTeX: "Extra }, or forgotten $" at \end{tabular*}, with \hline or the class's rules, under the class and under article
          // (probes oupdbg-a, oupdbg-c, arydshln-tabstar, ZeroTeX-NG, 2026-11-07). The wrapping p-columns fill the line by themselves.
          const spec = wrap ? columnSpec('equal', g.columns, false) : 'l'.repeat(g.columns);
          return float(`\\begin{table${star}}[tbp]`, `\\end{table${star}}`, sized(tabular('tabular', spec, rows)), cap(true), false);
        }
        case 'copernicus': {
          const g = gridOf(node, content, wrap ? spanning() : naturalSpan(''));
          const rows = ruledRows(rowLines(g), 'header', header, { top: '\\tophline', mid: '\\middlehline', bottom: '\\bottomhline', between: '' });
          return float(`\\begin{table${star}}[tbp]`, `\\end{table${star}}`, sized(tabular('tabular', wrap ? columnSpec('equal', g.columns, false) : natural(g.columns), rows)), cap());
        }
        case 'iopart': {
          const g = gridOf(node, content, wrap ? spanning() : naturalSpan(''));
          const rows = ruledRows(rowLines(g), 'header', header, { top: '\\br', mid: '\\mr', bottom: '\\br', between: '' });
          // Inside indented, \linewidth is the indented list's width, so the p-columns share it.
          const t = tabular('tabular', `@{}${wrap ? columnSpec('equal', g.columns, false) : natural(g.columns)}`, rows);
          return float(`\\begin{table${star}}[tbp]`, `\\end{table${star}}`, sized(`\\begin{indented}\n\\item[]${t}\n\\end{indented}`), cap(), false);
        }
        case 'plos': {
          const g = gridOf(node, content, wrap ? spanning('|') : naturalSpan('|'));
          const ruled = ruledRows(rowLines(g), 'all', header, { top: '\\hline', mid: '\\hline', bottom: '\\hline', between: '\\hline' }, g);
          // The template's heavy rule under the header row (plos_latex_template.tex l.296), where no row span crosses it.
          const rows = header && ruled[2] === '\\hline' ? ruled.map((r, i) => (i === 2 ? '\\thickhline' : r)) : ruled;
          const spec = wrap ? columnSpec('equal', g.columns, true) : g.columns === 1 ? '|l|' : `|l+${Array.from({ length: g.columns - 1 }, () => 'l').join('|')}|`;
          // The caption above, the label last, as the template writes them (l.285-298).
          const captionLine = caption === '' ? '' : `\\caption{${caption}}`;
          const t = sized(tabular('tabular', spec, rows));
          const labelled = label === '' ? '' : caption === '' ? `\\refstepcounter{table}\n\\label{${label}}` : `\\label{${label}}`;
          return float(`\\begin{table${star}}[tbp]`, `\\end{table${star}}`, `${t}${labelled === '' ? '' : `\n${labelled}`}`, captionLine);
        }
        default: {
          // ruledtabular: caption and label above, as revtex's samples write them (apssamp.tex l.460-470, aipsamp.tex l.339-355).
          const g = gridOf(node, content, wrap ? spanning() : naturalSpan(''));
          const lines = rowLines(g);
          const rows = header && lines.length > 1 ? [lines[0] ?? '', '\\hline', ...lines.slice(1)] : lines;
          const t = tabular('tabular', wrap ? columnSpec('equal', g.columns, false) : natural(g.columns), rows);
          return float(`\\begin{table${star}}[tbp]`, `\\end{table${star}}`, sized(`\\begin{ruledtabular}\n${t}\n\\end{ruledtabular}`), cap(), false);
        }
      }
    },
  };
};

export default realize;
