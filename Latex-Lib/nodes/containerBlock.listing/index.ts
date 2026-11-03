/**
 * containerBlock/listing's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './list.kernel/handler.ts';
import way1 from './list.enumitem/handler.ts';
import way2 from './list.paralist/handler.ts';
import way3 from './list.enumerate-pkg/handler.ts';
import way4 from './list.scrextend/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'list.kernel': way0,
  'list.enumitem': way1,
  'list.paralist': way2,
  'list.enumerate-pkg': way3,
  'list.scrextend': way4,
};
