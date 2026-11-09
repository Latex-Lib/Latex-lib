import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'cols.fullwidth',
    node: 'containerBlock/columns',
    description:
      "Tufte-LaTeX's full-width area for a one-column columns block, \\begin{fullwidth} … \\end{fullwidth}: the text runs across the text block and the wide margin (tufte-handout, tufte-book). A block of two or three columns prints as one full-width column, or, with split multicol, as \\begin{multicols}{n} inside the full-width area.",
    writes: '\\begin{fullwidth} … \\end{fullwidth}',
    ctan: ['tufte-latex'],
    features: ['full-width', 'class-styled'],
    params: {
      split: { type: 'enum', values: ['one', 'multicol'], default: 'one', description: "a block of two or three columns: one full-width column, or multicol's columns inside the full-width area" },
    },
    presets: PRESETS,
    loads: [{ pkg: 'multicol' }],
    // fullwidth is the class's (tufte-common.def; xtufte-common.def l.1293); both profiles define env:fullwidth.
    requires: ['env:fullwidth'],
    only: ['class.tufte-handout', 'class.tufte-book'],
    // multicol refuses floats and marginpars in its columns ("Floats and marginpars not allowed inside `multicols' environment!"),
    // and the class's \footnote, \sidenote and \marginnote are marginpars (tufte-common.def v3.5.2 l.1001-1082).
    givesWhen: [{ when: { split: 'multicol' }, gives: { columns: true, floats: false, footnotes: false } }],
    // Typeset on ZeroTeX-NG under tufte-handout and tufte-book (both with nols, their setting): both presets, a sidenote before
    // the block, ok.
    targetEngine: 'yes',
  }),
);
