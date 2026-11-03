/**
 * table's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './tbl.tabular/handler.ts';
import way1 from './tbl.tabularx/handler.ts';
import way2 from './tbl.longtable/handler.ts';
import way3 from './tbl.booktabs/handler.ts';
import way4 from './tbl.colortbl/handler.ts';
import way5 from './tbl.nicematrix/handler.ts';
import way6 from './tbl.threeparttable/handler.ts';
import way7 from './tbl.tabbing/handler.ts';
import way8 from './tbl.arydshln/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'tbl.tabular': way0,
  'tbl.tabularx': way1,
  'tbl.longtable': way2,
  'tbl.booktabs': way3,
  'tbl.colortbl': way4,
  'tbl.nicematrix': way5,
  'tbl.threeparttable': way6,
  'tbl.tabbing': way7,
  'tbl.arydshln': way8,
};
