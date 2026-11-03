/**
 * tbl.multirow (table_cell): the cell's text, \cellcolor for its background
 * (colortbl), \multirow{n}{width}{…} for a row span (multirow), then
 * Flouest's cell separator.
 * CTAN: https://ctan.org/pkg/multirow, https://ctan.org/pkg/colortbl
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { cell, cellPreamble } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: (_params, _parentType, node) => cellPreamble(node),
    emit: (node, content) => cell(node, content, false, { width: param(p, 'width', '=') }),
  };
};

export default realize;
