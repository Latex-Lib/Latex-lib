/**
 * tbl.longtable: \begin{longtable}{spec} … \end{longtable}, a table that
 * breaks across pages, not a float; its caption the first row, the header
 * row repeated with \endfirsthead and \endhead, a "continued" line with
 * \endfoot and \endlastfoot; \hline or booktabs rules.
 * CTAN: https://ctan.org/pkg/longtable
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { captionAndLabel, columnSpec, crossed, gridOf, hasHeader, rowLines, setupLines, spanning } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const rules = param(p, 'rules', 'hline');
  const [top, mid, bottom] = rules === 'booktabs' ? ['\\toprule', '\\midrule', '\\bottomrule'] : rules === 'hline' ? ['\\hline', '\\hline', '\\hline'] : ['', '', ''];
  return {
    // l, c, r and first-left set their p-columns' alignment with >{…\arraybackslash} (columnSpec): array.
    preamble: () => ({ packages: ['\\usepackage{longtable}', ...(rules === 'booktabs' ? ['\\usepackage{booktabs}'] : []), ...(param(p, 'colspec', 'equal') === 'equal' ? [] : ['\\usepackage{array}'])] }),
    emit: (node, content, context) => {
      const g = gridOf(node, content, spanning(p['vrules'] !== false ? '|' : ''));
      // The caption row with its label (the table's own attr, `tableAttr`); a label with no caption goes after
      // \refstepcounter{table} on the line before the table, as General writes it.
      const captioned = context !== undefined && context.trim() !== '';
      const cap = captioned ? `${captionAndLabel(node, context, '')} \\\\` : '';
      const before = captioned ? '' : captionAndLabel(node, undefined, '');
      const lines = rowLines(g);
      const header = hasHeader(node) && p['repeatHeader'] !== false && lines.length > 1 ? lines[0] : undefined;
      const body = header === undefined ? lines : lines.slice(1);
      // Between body rows only the segments a row span does not cross (`crossed`); body row i is grid row i, or i+1 under a header.
      const offset = header === undefined ? 0 : 1;
      const between = rules === 'hline' ? body.flatMap((l, i) => (i === 0 ? [l] : [crossed('\\hline', g, offset + i - 1), l].filter((x) => x !== ''))) : body;
      const head = header === undefined
        ? [cap, top, '\\endfirsthead']
        : [cap, top, header, mid, '\\endfirsthead', ...(p['continued'] === true ? [`\\multicolumn{${g.columns}}{l}{${cap === '' && before === '' ? '' : '\\tablename\\ \\thetable{} '}(continued)} \\\\`] : []), top, header, mid, '\\endhead'];
      const foot = p['continued'] === true ? [mid, `\\multicolumn{${g.columns}}{r}{(continued on the next page)} \\\\`, '\\endfoot', bottom, '\\endlastfoot'] : [bottom, '\\endlastfoot'];
      const all = [...setupLines(p), before, `\\begin{longtable}{${columnSpec(param(p, 'colspec', 'equal'), g.columns, p['vrules'] !== false)}}`, ...head, ...foot, ...between, '\\end{longtable}'];
      return `${all.filter((l) => l !== '').join('\n')}\n\n`;
    },
  };
};

export default realize;
