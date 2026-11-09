/**
 * containerBlock/acknowledgement's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './ack.kernel/handler.ts';
import way1 from './ack.class-native/handler.ts';
import way2 from './ack.block/handler.ts';
import way3 from './ack.bmhead/handler.ts';
import way4 from './ack.class-command/handler.ts';
import way5 from './ack.copernicus/handler.ts';
import way6 from './ack.llncs-credits/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'ack.kernel': way0,
  'ack.class-native': way1,
  'ack.block': way2,
  'ack.bmhead': way3,
  'ack.class-command': way4,
  'ack.copernicus': way5,
  'ack.llncs-credits': way6,
};
