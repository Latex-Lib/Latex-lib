import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'cols.tikzposter',
    node: 'containerBlock/columns',
    description:
      "tikzposter's columns of blocks on a poster, \\begin{columns} \\column{0.33} \\block{…}{…} … \\column{0.34} … \\end{columns}, at the poster's top level: the blocks shared out across the columns in order, anything that is not already a \\block wrapped in an untitled \\block{}{…}; equal widths, a wider middle column (0.3/0.4/0.3), or a list of fractions. The column gap is the class option colspace, not printed. tikzposter only.",
    writes: '\\begin{columns} \\column{…} \\block{…}{…} … \\column{…} … \\end{columns}',
    ctan: ['tikzposter'],
    features: ['parallel-columns', 'unequal-widths'],
    params: {
      widths: {
        type: 'string',
        default: 'equal',
        description: "the columns' widths as fractions of the poster: 'equal', 'wide-middle' (three columns: 0.3, 0.4, 0.3), or a comma list such as '0.25,0.5,0.25' (equal where its length is not the node's count)",
      },
    },
    presets: PRESETS,
    // tikzposter.cls defines the columns environment and \column (the profile's vocabulary names \column); not the kernel's.
    requires: ['env:columns', 'cmd:\\column'],
    only: ['class.tikzposter'],
    // Each block's body is a macro argument set in a TikZ node: no floats, no verbatim, and a footnote in it is lost; a column
    // never breaks. The columns stand at the poster's top level, never in another columns block or in a block.
    gives: { columns: true, argument: true, floats: false, verbatim: false, footnotes: false, breakable: false },
    needs: { columns: false, maxBoxDepth: 0 },
    targetEngine: 'yes',
  }),
);
