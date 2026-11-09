/**
 * table_cell's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './tbl.multirow/handler.ts';
import w_tbl_cell_plain from './tbl.cell-plain/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'tbl.multirow': way0,
  'tbl.cell-plain': w_tbl_cell_plain,
};
