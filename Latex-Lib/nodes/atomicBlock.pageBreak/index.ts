/**
 * atomicBlock/pageBreak's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './pg.break/handler.ts';
import way1 from './pg.afterpage/handler.ts';
import w_pg_matter from './pg.matter/handler.ts';
import w_pg_numbering from './pg.numbering/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'pg.break': way0,
  'pg.afterpage': way1,
  'pg.matter': w_pg_matter,
  'pg.numbering': w_pg_numbering,
};
