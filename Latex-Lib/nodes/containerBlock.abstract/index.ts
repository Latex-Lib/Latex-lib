/**
 * containerBlock/abstract's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './abs.kernel/handler.ts';
import way1 from './abs.abstract-pkg/handler.ts';
import way2 from './abs.class-native/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'abs.kernel': way0,
  'abs.abstract-pkg': way1,
  'abs.class-native': way2,
};
