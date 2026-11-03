import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.header',
    node: 'table_header',
    description:
      "A header cell: as a table cell, its text in the header font (bold, General's), on a shade when one is set.",
    ctan: ['multirow', 'colortbl'],
    features: ['bold-head', 'smallcaps-head', 'background'],
    params: {
      font: { type: 'tex', default: '\\bfseries', description: "the header text's font" },
      shade: { type: 'color', default: '', description: "a background for every header cell (\\cellcolor); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'multirow' },
      { pkg: 'xcolor' },
      { pkg: 'colortbl' },
    ],
    // As a table cell gives (tbl.multirow; General's GENERAL_GIVES table_header).
    gives: { breakable: false, floats: false, footnotes: false, argument: true },
    zerotex: 'untested',
  }),
);
