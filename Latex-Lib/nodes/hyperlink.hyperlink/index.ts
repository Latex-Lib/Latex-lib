/**
 * hyperlink/hyperlink's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './meta.hyperref/handler.ts';
import way1 from './meta.url/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'meta.hyperref': way0,
  'meta.url': way1,
};
