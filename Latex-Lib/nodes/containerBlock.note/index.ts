/**
 * containerBlock/note's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './note.marginnote/handler.ts';
import way1 from './note.marginpar/handler.ts';
import way2 from './note.sidenotes/handler.ts';
import way3 from './note.todonotes/handler.ts';
import way4 from './note.notecolumn/handler.ts';
import way5 from './box.tcolorbox/handler.ts';
import way6 from './box.mdframed/handler.ts';
import way7 from './box.fancybox/handler.ts';
import way8 from './box.awesomebox/handler.ts';
import w_box_class_native from './box.class-native/handler.ts';
import w_box_exam_solution from './box.exam-solution/handler.ts';
import w_box_tikzposter from './box.tikzposter/handler.ts';
import w_note_class_margin from './note.class-margin/handler.ts';
import w_note_epigraph from './note.epigraph/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'note.marginnote': way0,
  'note.marginpar': way1,
  'note.sidenotes': way2,
  'note.todonotes': way3,
  'note.notecolumn': way4,
  'box.tcolorbox': way5,
  'box.mdframed': way6,
  'box.fancybox': way7,
  'box.awesomebox': way8,
  'box.class-native': w_box_class_native,
  'box.exam-solution': w_box_exam_solution,
  'box.tikzposter': w_box_tikzposter,
  'note.class-margin': w_note_class_margin,
  'note.epigraph': w_note_epigraph,
};
