/**
 * paragraph/heading's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './head.kernel/handler.ts';
import way1 from './head.titlesec/handler.ts';
import way2 from './head.sectsty/handler.ts';
import way3 from './head.koma-fonts/handler.ts';
import way4 from './head.memoir-style/handler.ts';
import way5 from './head.fncychap/handler.ts';
import way6 from './head.class-native/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'head.kernel': way0,
  'head.titlesec': way1,
  'head.sectsty': way2,
  'head.koma-fonts': way3,
  'head.memoir-style': way4,
  'head.fncychap': way5,
  'head.class-native': way6,
};
