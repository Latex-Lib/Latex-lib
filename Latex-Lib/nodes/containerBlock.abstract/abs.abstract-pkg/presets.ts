/**
 * abs.abstract-pkg's presets, each from the templates that use it (`node seed.ts abs --rows`)
 * and the manual.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  'sans-small': {
    description: 'The abstract text in small sans-serif without an indent, the heading bold (\\abstracttextfont{\\sffamily\\small\\noindent\\ignorespaces}).',
    features: ['small-type', 'sans-serif', 'indented', 'centered'],
    // As 0188-elegantpaper's \abstracttextfont (\sffamily\small\noindent\ignorespaces): \noindent starts the abstract list
    // item's paragraph, so a statement first in a box there no longer meets the pending \item label ("missing \item": 149 article.A,
    // 150 report.A, e.g. d65487d0766fe4deb1df3 result da41c817e3 l.278; abs.kernel@unindented 0 of 293).
    params: { textFont: '\\normalfont\\sffamily\\small\\noindent\\ignorespaces' },
    evidence: [solution('0188-elegantpaper', '51')],
  },
  'run-in': {
    description: 'The heading run into the first line of the abstract (the runin option).',
    features: ['small-type', 'run-in-head', 'indented'],
    params: { runIn: true },
    evidence: [manual('abstract', 'package options: runin')],
  },
  'in-contents': {
    description: 'The abstract listed in the table of contents (addtotoc), set at the full width (\\absleftindent and \\absrightindent 0pt).',
    features: ['small-type', 'in-contents', 'centered'],
    params: { inContents: true, indent: '0pt' },
    evidence: [manual('abstract', 'package options: addtotoc; \\absleftindent, \\absrightindent')],
  },
} as const satisfies { readonly [name: string]: Preset };
