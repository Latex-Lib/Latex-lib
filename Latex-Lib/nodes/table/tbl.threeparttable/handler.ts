/**
 * tbl.threeparttable: \begin{threeparttable} \caption … tabular …
 * \end{threeparttable} in a table float, caption and notes kept to the
 * tabular's width (the line's, with the default equal columns); the
 * package options flushleft and para shape the tablenotes; \hline or
 * booktabs rules.
 * CTAN: https://ctan.org/pkg/threeparttable (the package's usage notes)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { captionAndLabel, columnSpec, gridOf, hasHeader, ruledRows, rowLines, setupLines } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const booktabs = param(p, 'rules', 'hline') === 'booktabs';
  const notes = param(p, 'notes', 'normal');
  return {
    // l, c, r and first-left set their p-columns' alignment with >{…\arraybackslash} (columnSpec): array.
    preamble: () => ({
      packages: [
        notes === 'normal' ? '\\usepackage{threeparttable}' : `\\usepackage[${notes}]{threeparttable}`,
        ...(booktabs ? ['\\usepackage{booktabs}'] : []),
        ...(param(p, 'colspec', 'equal') === 'equal' ? [] : ['\\usepackage{array}']),
      ],
    }),
    emit: (node, content, context) => {
      const g = gridOf(node, content);
      // The caption with its label (the table's own attr), or a label after \refstepcounter{table}; always [tbp] (`floated`).
      const labelled = captionAndLabel(node, context, '');
      const cap = labelled === '' ? '' : `${labelled}\n`;
      const rows = ruledRows(rowLines(g), 'header', hasHeader(node), booktabs ? { top: '\\toprule', mid: '\\midrule', bottom: '\\bottomrule', between: '' } : undefined);
      return `\\begin{table}[tbp]\n\\centering\n${setupLines(p).map((l) => `${l}\n`).join('')}\\begin{threeparttable}\n${cap}\\begin{tabular}{${columnSpec(param(p, 'colspec', 'equal'), g.columns, false)}}\n${rows.join('\n')}\n\\end{tabular}\n\\end{threeparttable}\n\\end{table}\n\n`;
    },
  };
};

export default realize;
