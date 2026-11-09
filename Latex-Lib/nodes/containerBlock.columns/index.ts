/**
 * containerBlock/columns's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './cols.multicol/handler.ts';
import way1 from './cols.paracol/handler.ts';
import way2 from './cols.vwcol/handler.ts';
import way3 from './cols.twocolumn-cmd/handler.ts';
import way4 from './cols.beamer-columns/handler.ts';
import way5 from './cols.cvcolumns/handler.ts';
import way6 from './cols.fullwidth/handler.ts';
import way7 from './cols.revtex-grid/handler.ts';
import way8 from './cols.tikzposter/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'cols.multicol': way0,
  'cols.paracol': way1,
  'cols.vwcol': way2,
  'cols.twocolumn-cmd': way3,
  'cols.beamer-columns': way4,
  'cols.cvcolumns': way5,
  'cols.fullwidth': way6,
  'cols.revtex-grid': way7,
  'cols.tikzposter': way8,
};
