import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.row',
    node: 'table_row',
    description:
      "A table row: its cells then Flouest's row separator; the table way turns the rows into its own syntax.",
    // The row prints no LaTeX of its own: its cells and Flouest's separators, which the table way prints as `… & … \\`.
    writes: '… & … \\\\',
    ctan: ['latex-base'],
    features: [],
    presets: PRESETS,
    targetEngine: 'untested',
  }),
);
