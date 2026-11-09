import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'cols.cvcolumns',
    node: 'containerBlock/columns',
    description:
      "moderncv's own columns, \\begin{cvcolumns} \\cvcolumn{}{…} \\cvcolumn{}{…} \\end{cvcolumns}: side-by-side columns with empty heads, set by the class in a top-aligned tabular on the CV's main column, the blocks shared out across them in order; equal widths, or the last column half the width (\\cvcolumn[0.5]{}{…}). moderncv only.",
    writes: '\\begin{cvcolumns} \\cvcolumn[…]{…}{…} \\end{cvcolumns}',
    ctan: ['moderncv'],
    features: ['parallel-columns', 'unequal-widths', 'class-styled'],
    params: {
      widths: { type: 'enum', values: ['equal', 'wide-last'], default: 'equal', description: "the columns' widths: equal shares, or the last column 0.5 of the width and the rest sharing what is left" },
    },
    presets: PRESETS,
    loads: [],
    // \begin{cvcolumns} and \cvcolumn are the class's (moderncv.cls l.668, 728); no other class defines them.
    requires: ['env:cvcolumns'],
    only: ['class.moderncv'],
    // Each column's text is the third argument of \cvcolumn (a short macro, moderncv.cls l.728), stored and later set in a
    // \vtop inside a p-column of a tabular inside \cvitem (l.716-723, 745-750): an argument (no verbatim), a box that does not
    // break across pages, a tabular where a float cannot go and where \footnote's text is lost.
    gives: { columns: true, argument: true, floats: false, verbatim: false, footnotes: false, breakable: false, boxDepth: 1 },
    // Typeset on ZeroTeX-NG under moderncv (classic style): both presets, one to three columns, a list with a paragraph break in a
    // column, ok; the same document with the blank lines left in stops at "Paragraph ended before \cvcolumn was complete" (the
    // reason for \endgraf, blocks.ts).
    targetEngine: 'yes',
  }),
);
