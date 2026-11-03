/**
 * footnoteAnchor/footnoteAnchor's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './fn.kernel/handler.ts';
import way1 from './fn.footmisc/handler.ts';
import way2 from './fn.endnotes/handler.ts';
import way3 from './fn.bigfoot/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'fn.kernel': way0,
  'fn.footmisc': way1,
  'fn.endnotes': way2,
  'fn.bigfoot': way3,
};
