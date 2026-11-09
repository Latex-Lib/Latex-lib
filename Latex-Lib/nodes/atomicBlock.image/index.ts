/**
 * atomicBlock/image's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './fig.graphicx/handler.ts';
import way1 from './fig.float/handler.ts';
import way2 from './fig.wrapfig/handler.ts';
import way3 from './fig.floatrow/handler.ts';
import way4 from './fig.adjustbox/handler.ts';
import way5 from './fig.rotating/handler.ts';
import way6 from './fig.svg/handler.ts';
import w_fig_acm_teaser from './fig.acm-teaser/handler.ts';
import w_fig_caption_only from './fig.caption-only/handler.ts';
import w_fig_class_float from './fig.class-float/handler.ts';
import w_fig_margin from './fig.margin/handler.ts';
import w_fig_nofloat_caption from './fig.nofloat-caption/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'fig.graphicx': way0,
  'fig.float': way1,
  'fig.wrapfig': way2,
  'fig.floatrow': way3,
  'fig.adjustbox': way4,
  'fig.rotating': way5,
  'fig.svg': way6,
  'fig.acm-teaser': w_fig_acm_teaser,
  'fig.caption-only': w_fig_caption_only,
  'fig.class-float': w_fig_class_float,
  'fig.margin': w_fig_margin,
  'fig.nofloat-caption': w_fig_nofloat_caption,
};
