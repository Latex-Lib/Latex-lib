/**
 * tbl.margintable: Tufte-LaTeX's margin table, \begin{margintable}[offset] \caption{…} \label{…} \begin{tabular}…
 * \end{tabular} \end{margintable}, its p-columns sharing the margin's \linewidth (the class sets the float in a minipage of
 * \marginparwidth inside a \marginpar, tufte-common.def / xtufte-common.def l.1027-1058); or, with placement `full`, the
 * class's full-width table* (renewed by the class to span text and margin, xtufte-common.def l.1281-1285). Booktabs rules,
 * as the Tufte samples set their tables, or \hline, or none.
 * CTAN: https://ctan.org/pkg/tufte-latex
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { captionAndLabel, columnSpec, gridOf, hasHeader, ruledRows, rowLines, setupLines } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const rules = param(p, 'rules', 'booktabs');
  const full = param(p, 'placement', 'margin') === 'full';
  return {
    // l, c, r and first-left set their p-columns' alignment with >{…\arraybackslash} (columnSpec): array.
    // The margin table is a \marginpar, which runs the output routine without shipping a page: the limit is raised as
    // note.marginpar and note.class-margin raise it (batch 4 round 2: tufte-handout.A's margin notes stopped at "Output
    // loop---100 consecutive dead cycles"; the same mechanism, no failing cell of this way's own). Only raised, never lowered;
    // table* (`full`) is a float and needs none.
    preamble: () => {
      const packages = [...(rules === 'booktabs' ? ['\\usepackage{booktabs}'] : []), ...(param(p, 'colspec', 'equal') === 'equal' ? [] : ['\\usepackage{array}'])];
      const declarations = full ? [] : ['\\ifnum\\maxdeadcycles<1000 \\maxdeadcycles=1000 \\fi'];
      return { ...(packages.length === 0 ? {} : { packages }), ...(declarations.length === 0 ? {} : { declarations }) };
    },
    emit: (node, content, context) => {
      const g = gridOf(node, content);
      const rule = rules === 'booktabs' ? { top: '\\toprule', mid: '\\midrule', bottom: '\\bottomrule', between: '' } : { top: '\\hline', mid: '\\hline', bottom: '\\hline', between: '\\hline' };
      const rows = ruledRows(rowLines(g), rules === 'none' ? 'none' : 'header', hasHeader(node), rule, g);
      const tabular = `\\begin{tabular}{${columnSpec(param(p, 'colspec', 'equal'), g.columns, false)}}\n${rows.join('\n')}\n\\end{tabular}`;
      const cap = captionAndLabel(node, context);
      const below = node.attrs?.['captionPosition'] === 'bottom';
      const offset = param(p, 'offset');
      // The margin float takes an optional vertical offset ([-1.2ex] by default); table* takes a placement.
      const open = full ? '\\begin{table*}[tbp]' : `\\begin{margintable}${offset === '' ? '' : `[${offset}]`}`;
      const close = full ? '\\end{table*}' : '\\end{margintable}';
      const body = [...setupLines(p), tabular].join('\n');
      return [open, '\\centering', ...(below ? [body, cap] : [cap, body]), close].filter((l) => l !== '').join('\n') + '\n\n';
    },
  };
};

export default realize;
