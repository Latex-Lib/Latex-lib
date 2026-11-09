/**
 * tbl.inline: a tabular set in the text, with no float and no caption: \begin{center} \begin{tabular}{…} \toprule …
 * \bottomrule \end{tabular} \end{center}, or flush left. For a class with no table float or counter (letter: Letter.md
 * l.118-122, "No caption is possible") and for a place that takes no float (a tikzposter \block, whose content is a macro
 * argument: jacobs-landscape-poster main.tex l.62-71). The caption and the label are dropped: there is no counter to
 * number them. The columns are p-columns sharing the line (\linewidth: the block's width in a poster), as every table
 * way's; booktabs rules, \hline rules or none; | rules where asked.
 * CTAN: https://ctan.org/pkg/latex-base (usrguide), https://ctan.org/pkg/booktabs
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { columnSpec, gridOf, hasHeader, ruledRows, rowLines, setupLines, spanning } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const rules = param(p, 'rules', 'booktabs');
  const vrules = p['vrules'] === true;
  return {
    // l, c, r and first-left set their p-columns' alignment with >{…\arraybackslash} (columnSpec): array.
    preamble: () => {
      const packages = [...(rules === 'booktabs' ? ['\\usepackage{booktabs}'] : []), ...(param(p, 'colspec', 'equal') === 'equal' ? [] : ['\\usepackage{array}'])];
      return packages.length === 0 ? {} : { packages };
    },
    emit: (node, content) => {
      const g = gridOf(node, content, spanning(vrules ? '|' : ''));
      const rule = rules === 'booktabs' ? { top: '\\toprule', mid: '\\midrule', bottom: '\\bottomrule', between: '' } : { top: '\\hline', mid: '\\hline', bottom: '\\hline', between: '\\hline' };
      const rows = ruledRows(rowLines(g), rules === 'none' ? 'none' : 'header', hasHeader(node), rule, g);
      const tabular = `\\begin{tabular}{${columnSpec(param(p, 'colspec', 'equal'), g.columns, vrules)}}\n${rows.join('\n')}\n\\end{tabular}`;
      const body = [...setupLines(p), tabular].join('\n');
      // center: the kernel's centred display (a list, so it adds space above and below, as the poster's table has); left: a
      // paragraph of its own, flush left. Either keeps the size and \arraystretch inside its own group.
      return param(p, 'align', 'center') === 'left' ? `{\\par\\noindent\n${body}\\par}\n\n` : `\\begin{center}\n${body}\n\\end{center}\n\n`;
    },
  };
};

export default realize;
