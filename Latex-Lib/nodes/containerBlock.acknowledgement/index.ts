/**
 * containerBlock/acknowledgement's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './ack.kernel/handler.ts';
import way1 from './ack.class-native/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'ack.kernel': way0,
  'ack.class-native': way1,
};
