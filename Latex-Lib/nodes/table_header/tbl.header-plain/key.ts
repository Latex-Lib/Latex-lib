import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.header-plain',
    node: 'table_header',
    description:
      'A plain header cell with no colortbl: its text in \\textbf{…} (General\'s header font), a row span as \\multirow (multirow, which loads no array), no background shade, then the cell separator. For the classes that refuse colortbl and array, such as emulateapj on revtex4.',
    writes: '\\textbf{…} &',
    ctan: ['multirow'],
    features: ['bold-head', 'smallcaps-head', 'cell-spans'],
    params: {
      font: { type: 'enum', values: ['textbf', 'textsc', 'textit'], default: 'textbf', description: "the header text's font command (\\textbf; its declaration in a group when the cell holds several paragraphs)" },
      width: { type: 'enum', values: ['=', '*'], default: '=', description: "a row span's width: the column's (=, text wraps) or natural (*)" },
    },
    presets: PRESETS,
    // Only for a row span (headerPreamble); multirow.sty v2.x requires no package, so no array comes with it.
    loads: [{ pkg: 'multirow' }],
    // As a table cell gives (tbl.multirow, tbl.header; General's GENERAL_GIVES table_header).
    gives: { breakable: false, floats: false, footnotes: false, argument: true },
    targetEngine: 'yes',
  }),
);
