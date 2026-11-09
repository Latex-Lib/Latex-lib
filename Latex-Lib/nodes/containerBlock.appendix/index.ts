/**
 * containerBlock/appendix's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './num.appendix/handler.ts';
import way1 from './num.appendices-env/handler.ts';
import way2 from './num.appendix-onecolumn/handler.ts';
import way3 from './num.cvpr-supplementary/handler.ts';
import way4 from './num.handset/handler.ts';
import way5 from './num.ieee-appendices/handler.ts';
import way6 from './num.mdpi-appendix/handler.ts';
import way7 from './num.unnumbered/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'num.appendix': way0,
  'num.appendices-env': way1,
  'num.appendix-onecolumn': way2,
  'num.cvpr-supplementary': way3,
  'num.handset': way4,
  'num.ieee-appendices': way5,
  'num.mdpi-appendix': way6,
  'num.unnumbered': way7,
};
