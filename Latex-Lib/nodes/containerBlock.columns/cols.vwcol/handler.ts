/**
 * cols.vwcol: \begin{vwcol}[widths={…}, sep=…, rule=…] … \end{vwcol},
 * columns of chosen widths that paragraph text flows through (no floats, no
 * displays, no lists or statements, no verbatim, no footnotes); a 0.4pt rule
 * only when the node asks for one.
 * CTAN: https://ctan.org/pkg/vwcol
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { dataOf, param } from '../../protocol.ts';
import { countOf, gapOf } from '../node.ts';
import key from './key.ts';

const WIDTHS: { readonly [style: string]: { readonly [count: number]: string } } = {
  equal: { 1: '1', 2: '0.5,0.5', 3: '0.33,0.33,0.34' },
  'wide-first': { 1: '1', 2: '0.6,0.4', 3: '0.5,0.25,0.25' },
  'wide-last': { 1: '1', 2: '0.4,0.6', 3: '0.25,0.25,0.5' },
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({ packages: ['\\usepackage{vwcol}'] }),
    // vwcol guesses the column height and retries 5 times by default; text with tall inline boxes needs more
    // ("The estimated number of lines is greater than 5 lines too small, so I gave up").
    // vwcol draws a 0.4pt rule unless told otherwise and warns when sep is below it ("'sep' must be greater than or equal to
    // 'rule'": 1,482 times in article.A, every vwcol at Flouest's gap 0, each box 0.4pt over). General draws one only when asked
    // (columns.ts: data.rule), and the template passes rule=0pt (0112-sizuhe, apa-sizuhe.cls:189).
    emit: (node, content) => `\\begin{vwcol}[widths={${(WIDTHS[param(p, 'widths', 'equal')] ?? WIDTHS['equal'] ?? {})[countOf(node)] ?? '0.5,0.5'}}, sep=${gapOf(node)}, rule=${dataOf(node)['rule'] === true ? '0.4pt' : '0pt'}, maxrecursion=50]\n${content.trim()}\n\\end{vwcol}\n\n`,
  };
};

export default realize;
