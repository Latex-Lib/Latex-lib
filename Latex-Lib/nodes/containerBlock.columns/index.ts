/**
 * containerBlock/columns's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './cols.multicol/handler.ts';
import way1 from './cols.paracol/handler.ts';
import way2 from './cols.vwcol/handler.ts';
import way3 from './cols.twocolumn-cmd/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'cols.multicol': way0,
  'cols.paracol': way1,
  'cols.vwcol': way2,
  'cols.twocolumn-cmd': way3,
};
