/**
 * tbl.header-plain (table_header): a header cell in \textbf{…} with no
 * colortbl, for the classes that refuse it (class.emulateapj, whose brief
 * refuses tbl.header for colortbl and whose answer writes header cells in
 * \textbf by hand). A row span through multirow; no background.
 * CTAN: https://ctan.org/pkg/multirow
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { headerCell, headerPreamble, type Font } from './cell.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: (_params, _parentType, node) => headerPreamble(node),
    emit: (node, content) => headerCell(node, content, param(p, 'font', 'textbf') as Font, param(p, 'width', '=')),
  };
};

export default realize;
