/**
 * paragraph/title's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './front.maketitle/handler.ts';
import way1 from './front.titling/handler.ts';
import way2 from './front.titlepage-env/handler.ts';
import way3 from './front.koma-title/handler.ts';
import way4 from './front.class-native/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'front.maketitle': way0,
  'front.titling': way1,
  'front.titlepage-env': way2,
  'front.koma-title': way3,
  'front.class-native': way4,
};
