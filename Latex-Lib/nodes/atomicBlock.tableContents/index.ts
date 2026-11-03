/**
 * atomicBlock/tableContents's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './toc.kernel/handler.ts';
import way1 from './toc.tocloft/handler.ts';
import way2 from './toc.titletoc/handler.ts';
import way3 from './toc.etoc/handler.ts';
import way4 from './toc.koma/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'toc.kernel': way0,
  'toc.tocloft': way1,
  'toc.titletoc': way2,
  'toc.etoc': way3,
  'toc.koma': way4,
};
