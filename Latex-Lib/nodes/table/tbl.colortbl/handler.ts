/**
 * tbl.colortbl: row colours through xcolor's table option (colortbl):
 * \rowcolors{start}{odd}{even} for stripes, \rowcolor{…} for a header band,
 * \arrayrulecolor for the rules' colour, \hline where asked.
 * CTAN: https://ctan.org/pkg/colortbl, https://ctan.org/pkg/xcolor (table option)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { columnSpec, floated, gridOf, hasHeader, ruledRows, rowLines, spanning, withSetup } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const [odd, even] = [param(p, 'odd'), param(p, 'even')];
  return {
    // colortbl loads array, so aligned p-columns (>{…\arraybackslash}) need nothing more.
    preamble: () => ({ packages: ['\\usepackage[table]{xcolor}'] }),
    emit: (node, content, context) => {
      const g = gridOf(node, content, spanning(p['vrules'] === true ? '|' : ''));
      const lines = rowLines(g);
      const headerColor = param(p, 'headerColor');
      const text = param(p, 'headerText');
      if (headerColor !== '' && hasHeader(node) && lines.length > 0) {
        const fields = g.rows[0] ?? [];
        // A spanning header field is a \multicolumn, which must come first in its cell: \color (not expandable) before it is
        // "Misplaced \omit". There the colour goes inside the span's p-box, after its \centering (`spanning`).
        lines[0] = `\\rowcolor{${headerColor}}${text === '' ? fields.join(' & ') : fields.map((f) => (f.startsWith('\\multicolumn') ? f.replace('}{\\centering ', `}{\\centering\\color{${text}} `) : `\\color{${text}}${f}`)).join(' & ')} \\\\`;
      }
      const rows = ruledRows(lines, param(p, 'rules', 'none'), hasHeader(node), undefined, g);
      const setup = [
        ...(odd === '' && even === '' ? [] : [`\\rowcolors{${typeof p['start'] === 'number' ? p['start'] : 2}}{${odd === '' ? 'white' : odd}}{${even === '' ? 'white' : even}}`]),
        ...(param(p, 'ruleColor') === '' ? [] : [`\\arrayrulecolor{${param(p, 'ruleColor')}}`]),
      ];
      return floated(node, withSetup(p, [...setup, `\\begin{tabular}{${columnSpec(param(p, 'colspec', 'equal'), g.columns, p['vrules'] === true)}}\n${rows.join('\n')}\n\\end{tabular}`].join('\n')), context);
    },
  };
};

export default realize;
