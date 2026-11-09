/**
 * containerBlock/customLatex's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './custom.raw/handler.ts';
import way1 from './custom.imsart-localdefs/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'custom.raw': way0,
  'custom.imsart-localdefs': way1,
};
