import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.cell-plain',
    node: 'table_cell',
    description:
      "A plain table cell, as the kernel's tabular takes it: its text (blank lines as \\par) then Flouest's cell separator, with no \\cellcolor (colortbl) and no \\multirow (multirow), so it loads no package. A background is dropped and a row span's text stays in its first row; a column span is written by the table as \\multicolumn{n}{…}{…}. For classes that refuse colortbl or multirow, such as emulateapj on revtex4.",
    // The cell prints only its text; the `&` around it and a column span's \multicolumn are the table way's (table/node.ts gridOf).
    writes: '… & \\multicolumn{…}{…}{…} & …',
    ctan: ['latex-base'],
    features: [],
    presets: PRESETS,
    // As General's cells give (contexts.ts GENERAL_GIVES table_cell), as tbl.multirow does: a cell is a box, a footnote in a
    // tabular is lost, and a span's text is read as \multicolumn's argument.
    gives: { breakable: false, floats: false, footnotes: false, argument: true },
    // Typeset ok on ZeroTeX-NG (2026-11-07) under emulateapj (revtex4, no array) and article: a kernel tabular of p-columns with
    // these cells, an empty \strut cell, a \par in a cell and the table's \multicolumn span (work/tbl.cell-plain/{emulateapj,article}).
    targetEngine: 'yes',
  }),
);
