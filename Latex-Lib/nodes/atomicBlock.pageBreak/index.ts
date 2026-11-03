/**
 * atomicBlock/pageBreak's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './pg.break/handler.ts';
import way1 from './pg.afterpage/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'pg.break': way0,
  'pg.afterpage': way1,
};
