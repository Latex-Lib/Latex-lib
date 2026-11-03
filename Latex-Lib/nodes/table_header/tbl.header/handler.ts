/**
 * tbl.header (table_header): a header cell as the table cell prints it, its
 * text in the header font (bold, General's), on a shade when one is set.
 * CTAN: https://ctan.org/pkg/multirow, https://ctan.org/pkg/colortbl
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { cell, cellPreamble } from '../../table_cell/node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: (_params, _parentType, node) => cellPreamble(node, param(p, 'shade')),
    emit: (node, content) => cell(node, content, true, { font: param(p, 'font', '\\bfseries'), shade: param(p, 'shade') }),
  };
};

export default realize;
