/**
 * note.notecolumn's presets, from the template that uses it (`node seed.ts note --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  margin: {
    description: "KOMA's note column in the margin, \\makenote*{…} (the template's \\makenote, starred): notes set beside the text and kept in step with it across pages.",
    features: ['margin-note', 'note-column'],
    params: {},
    evidence: [solution('0020-koma-script', '72')],
  },
  // The template's font is \raggedright\footnotesize\color{blue}. The colour is left out: scrlayer-notecolumn loads no colour package
  // (scrlayer-notecolumn.dtx l.307-313 only hooks color and xcolor), so with nothing else loading one \color was undefined when the
  // column was set from the .slnc file; and under XeTeX, which has one colour stack, it redefines \set@color as a warning, so the
  // blue never printed ("scrlayer-notecolumn Warning: unsupported change of color!", amsart.A e42df4baeb32; KOMA manual,
  // scrlayer-notecolumn-en.tex l.463-470).
  'colored-column': {
    description: 'A note column of its own, ragged footnote-size text (\\DeclareNewNoteColumn[font=\\raggedright\\footnotesize]{notes}; the template\'s \\color{blue} is left out: the note column cannot switch colour under XeTeX).',
    features: ['margin-note', 'note-column', 'small-type'],
    params: { column: 'notes', font: '\\raggedright\\footnotesize' },
    evidence: [solution('0020-koma-script', '84')],
  },
} as const satisfies { readonly [name: string]: Preset };
