/**
 * code/code's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './code.verbatim/handler.ts';
import way1 from './code.listings/handler.ts';
import way2 from './code.minted/handler.ts';
import way3 from './code.tcblisting/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'code.verbatim': way0,
  'code.listings': way1,
  'code.minted': way2,
  'code.tcblisting': way3,
};
