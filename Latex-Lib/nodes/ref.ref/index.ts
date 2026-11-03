/**
 * ref/ref's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './xref.kernel/handler.ts';
import way1 from './xref.hyperref/handler.ts';
import way2 from './xref.cleveref/handler.ts';
import way3 from './xref.varioref/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'xref.kernel': way0,
  'xref.hyperref': way1,
  'xref.cleveref': way2,
  'xref.varioref': way3,
};
