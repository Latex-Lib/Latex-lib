/**
 * tbl.booktabs: \toprule, \midrule under a header row, \bottomrule, no
 * vertical rules; \heavyrulewidth and \lightrulewidth for their weights,
 * \addlinespace between body rows.
 * CTAN: https://ctan.org/pkg/booktabs
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { columnSpec, floated, gridOf, hasHeader, ruledRows, rowLines, withSetup } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = [
    ...(param(p, 'heavyRule') === '' ? [] : [`\\setlength{\\heavyrulewidth}{${param(p, 'heavyRule')}}`]),
    ...(param(p, 'lightRule') === '' ? [] : [`\\setlength{\\lightrulewidth}{${param(p, 'lightRule')}}`]),
  ];
  return {
    // l, c, r and first-left set their p-columns' alignment with >{…\arraybackslash} (columnSpec): array.
    preamble: () => ({ packages: ['\\usepackage{booktabs}', ...(param(p, 'colspec', 'equal') === 'equal' ? [] : ['\\usepackage{array}'])], ...(declarations.length === 0 ? {} : { declarations }) }),
    emit: (node, content, context) => {
      const g = gridOf(node, content);
      const between = p['rowSpace'] === true ? '\\addlinespace' : '';
      const lines = rowLines(g);
      const rows = ruledRows(lines, between === '' ? 'header' : 'all', hasHeader(node), { top: '\\toprule', mid: '\\midrule', bottom: '\\bottomrule', between });
      // With row spacing, the header still takes its \midrule.
      const body = between === '' || !hasHeader(node) ? rows : rows.map((r, i) => (i === 2 ? '\\midrule' : r));
      return floated(node, withSetup(p, `\\begin{tabular}{${columnSpec(param(p, 'colspec', 'equal'), g.columns, false)}}\n${body.join('\n')}\n\\end{tabular}`), context);
    },
  };
};

export default realize;
