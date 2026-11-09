import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.multirow',
    node: 'table_cell',
    description:
      "A table cell: its text (blank lines as \\par), \\cellcolor for a background (colortbl), \\multirow{n}{=}{…} for a row span (multirow; * for natural width), then Flouest's cell separator.",
    writes: '\\multirow{…}{=}{\\cellcolor[HTML]{…} …}',
    ctan: ['multirow', 'colortbl'],
    features: ['cell-spans', 'background'],
    params: {
      width: { type: 'enum', values: ['=', '*'], default: '=', description: "a row span's width: the column's (=, text wraps) or natural (*)" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'multirow' },
      { pkg: 'xcolor' },
      { pkg: 'colortbl' },
    ],
    // As General's cells give (contexts.ts GENERAL_GIVES table_cell): a cell is a box (a float or a longtable in it is 'Not in outer
    // par mode'), a footnote in a tabular is lost, and its text is read as an argument or set in a box (\multirow{n}{=}{…}, a span's
    // \multicolumn, tabularx's body), so a library code way (verbatim) cannot sit below it.
    gives: { breakable: false, floats: false, footnotes: false, argument: true },
    targetEngine: 'untested',
  }),
);
