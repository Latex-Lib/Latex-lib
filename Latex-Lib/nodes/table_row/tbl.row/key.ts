import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.row',
    node: 'table_row',
    description:
      "A table row: its cells then Flouest's row separator; the table way turns the rows into its own syntax.",
    ctan: ['latex-base'],
    features: [],
    presets: PRESETS,
    zerotex: 'untested',
  }),
);
