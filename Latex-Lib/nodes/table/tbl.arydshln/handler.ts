/**
 * tbl.arydshln: dashed rules in a tabular. \hdashline between rows,
 * ;{dash/gap} (or :) between columns, \dashlinedash and \dashlinegap for
 * the dash shape; solid \hline at the edges when asked. array and longtable
 * are loaded first, so a later load of array cannot undo arydshln's patches
 * and a longtable finds them adapted to it.
 * CTAN: https://ctan.org/pkg/arydshln (section 2)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { columnSpec, floated, gridOf, ruledRows, rowLines, spanning, withSetup } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const [dash, gap] = [param(p, 'dash'), param(p, 'gap')];
  // arydshln 1.76 (2019) ends a tabular with \endarray $\egroup, as array did before v2.6, and lets \endtabular* be that
  // (arydshln.sty l.499-500). array 2.7b no longer opens maths in \@tabular (array.sty l.340-362: \hbox\bgroup, and
  // \endtabular is \endarray\egroup), and the kernel's first aid for arydshln redefines \endtabular only
  // (latex2e-first-aid-for-external-files.ltx l.272-287), so \endtabular* still ends with a stray $: every tabular*, and so
  // every tabularx (tabularx.sty l.112 sets its last pass with \csname endtabular*\endcsname), stopped at "Extra }, or
  // forgotten $" in a document holding this way (run 41584963423: 439 of 441 tbl.tabularx branches in documents with
  // tbl.arydshln, 0 of 7,087 elsewhere; amsart.A d94bf1e8c3bcc3309b18c result f7a8aa7957 l.213 \end{tabularx}). \endtabular*
  // is made the first aid's \endtabular again, a no-op where \endtabular still holds the $.
  const declarations = [
    '\\expandafter\\let\\csname endtabular*\\endcsname\\endtabular',
    ...(dash === '' ? [] : [`\\setlength{\\dashlinedash}{${dash}}`]),
    ...(gap === '' ? [] : [`\\setlength{\\dashlinegap}{${gap}}`]),
  ];
  return {
    // array before arydshln: a later \RequirePackage{array} (awesomebox, tabularx, nicematrix, another table way's aligned columns)
    // is then a no-op and cannot put back the array internals arydshln patched (copy's batch-3b run: 80 of 80 fit branches whose
    // log loads array after arydshln stop at 'Illegal pream-token (;)' or \adl@hline, report.A 86 of 86, e.g. dcf918d94336db5017f17
    // result d2cba02525; with array or colortbl first, 0 own errors in 42 documents, 59 branches). colortbl patches array itself,
    // so array first does not help there: the key keeps tbl.colortbl apart.
    // longtable before arydshln too: arydshln adapts longtable only when longtable is already loaded, and a longtable loaded after
    // it runs arydshln's row and rule code with no row state ('Undefined control sequence' in \adl@@cr … \adl@rowsL, \adl@vlineL,
    // \adl@vlineR). With array first arydshln is in force in every document holding this way: in the copy's batch-3b article,
    // amsart, report and scrartcl A runs, 95 of the 168 documents with arydshln in force and longtable after it carried those errors
    // on their longtable branches, 0 of the 103 with longtable first (article.A d726f2f8b00cf6df968e0, result 1c7b69896ed8,
    // tbl.longtable@repeat-header l.377). An unused longtable costs nothing.
    preamble: () => ({ packages: ['\\usepackage{array}', '\\usepackage{longtable}', '\\usepackage{arydshln}'], declarations }),
    emit: (node, content, context) => {
      // arydshln's \multicolumn is not \long: the spanning cells `gridOf` writes keep \par out of it (`spanning`), and draw the
      // dashed column rule the table draws (;{2pt/3pt}) when it has one.
      const g = gridOf(node, content, spanning(p['vertical'] !== false ? ';{2pt/3pt}' : ''));
      const edge = param(p, 'outer', 'dashed') === 'solid' ? '\\hline' : '\\hdashline';
      const rows = ruledRows(rowLines(g), 'all', false, { top: edge, mid: '\\hdashline', bottom: edge, between: '\\hdashline' }, g);
      const spec = columnSpec(param(p, 'colspec', 'equal'), g.columns, p['vertical'] !== false, ';{2pt/3pt}');
      return floated(node, withSetup(p, `\\begin{tabular}{${spec}}\n${rows.join('\n')}\n\\end{tabular}`), context);
    },
  };
};

export default realize;
