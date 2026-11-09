import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fig.margin',
    node: 'atomicBlock/image',
    description:
      "Tufte's margin figure: \\begin{marginfigure}[offset] \\includegraphics[width=\\linewidth]{…} \\caption{…} \\label{…} \\end{marginfigure}, the image and its caption set in the outer margin beside the text, numbered with the figures; the offset moves it up or down (tufte-handout, tufte-book).",
    writes: '\\begin{marginfigure} \\includegraphics[width=\\linewidth]{…} \\caption{…} \\label{…} \\end{marginfigure}',
    ctan: ['tufte-latex'],
    features: ['margin-note', 'captioned', 'scaled', 'class-styled'],
    params: {
      offset: { type: 'dimen', default: '', description: "how far the figure is moved down (up when negative) from the line it is anchored to; '' keeps the class's -1.2ex" },
    },
    presets: PRESETS,
    loads: [{ pkg: 'graphicx' }],
    // tufte-common.def: \newenvironment{marginfigure}[1][-1.2ex]{\begin{@tufte@margin@float}[#1]{figure}}, a minipage of
    // \marginparwidth in an lrbox set by \marginpar, after a \FloatBarrier that keeps the figure numbers in order
    // (xtufte-common.def l.1027-1050, the same code). acmart has a marginfigure of its own (acmart.dtx l.4320), a different
    // environment with no offset argument, so the way is for the Tufte classes only.
    requires: ['env:marginfigure'],
    only: ['class.tufte-handout', 'class.tufte-book'],
    // \marginpar is a float: "Not in outer par mode" in a box, a float or a list item's argument; "Float(s) lost" in columns.
    needs: { floats: true, argument: false },
    // Typeset on ZeroTeX-NG under tufte-handout and tufte-book with nols (both presets, no overfull box; this builder's cases,
    // 2026-11-07).
    targetEngine: 'yes',
  }),
);
