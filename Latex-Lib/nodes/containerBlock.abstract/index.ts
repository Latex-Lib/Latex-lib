/**
 * containerBlock/abstract's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './abs.kernel/handler.ts';
import way1 from './abs.abstract-pkg/handler.ts';
import way2 from './abs.class-native/handler.ts';
import way3 from './abs.aa-structured/handler.ts';
import way4 from './abs.front-held/handler.ts';
import way5 from './abs.heading/handler.ts';
import way6 from './abs.ieee-indextext/handler.ts';
import way7 from './abs.ieeeaccess/handler.ts';
import way8 from './abs.keywords/handler.ts';
import way9 from './abs.tikzposter-block/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'abs.kernel': way0,
  'abs.abstract-pkg': way1,
  'abs.class-native': way2,
  'abs.aa-structured': way3,
  'abs.front-held': way4,
  'abs.heading': way5,
  'abs.ieee-indextext': way6,
  'abs.ieeeaccess': way7,
  'abs.keywords': way8,
  'abs.tikzposter-block': way9,
};
