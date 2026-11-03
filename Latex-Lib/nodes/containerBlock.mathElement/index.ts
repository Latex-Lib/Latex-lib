/**
 * The theorem node's ways: way id to handler. A handler turns its parameters
 * (a preset, with any adapt a parent sets) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import amsthm from './thm.amsthm/handler.ts';
import classNative from './thm.class-native/handler.ts';
import kernel from './thm.kernel/handler.ts';
import mdframed from './thm.mdframed/handler.ts';
import ntheorem from './thm.ntheorem/handler.ts';
import tcolorbox from './thm.tcolorbox/handler.ts';
import thmtools from './thm.thmtools/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'thm.amsthm': amsthm,
  'thm.class-native': classNative,
  'thm.kernel': kernel,
  'thm.mdframed': mdframed,
  'thm.ntheorem': ntheorem,
  'thm.tcolorbox': tcolorbox,
  'thm.thmtools': thmtools,
};
