/**
 * containerBlock/blockMath's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './math.kernel/handler.ts';
import way1 from './math.amsmath/handler.ts';
import way2 from './math.mathtools/handler.ts';
import way3 from './math.ieeeeqnarray/handler.ts';
import way4 from './math.linenomath/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'math.kernel': way0,
  'math.amsmath': way1,
  'math.mathtools': way2,
  'math.ieeeeqnarray': way3,
  'math.linenomath': way4,
};
