import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'cols.revtex-grid',
    node: 'containerBlock/columns',
    description:
      "revtex4-2's and aastex701's own page grid, switched in place with no new page: a one-column block spans the page in \\begin{widetext} … \\end{widetext} (across both columns of a reprint page), a two- or three-column block is set in \\twocolumngrid and then returns to the grid it found (\\onecolumngrid on a one-column preprint page). The class's \\twocolumn and \\onecolumn are undefined under ltxgrid, so cols.twocolumn-cmd cannot run there. revtex4-2 (APS, AIP) and aastex.",
    writes: '\\begin{widetext} … \\end{widetext} | \\LibGridSave \\twocolumngrid … \\LibGridBack',
    ctan: ['revtex'],
    features: ['page-columns'],
    params: {
      mode: {
        type: 'enum',
        values: ['auto', 'widetext', 'twocolumngrid'],
        default: 'auto',
        description: 'both switches by the block (auto), only widetext for one-column blocks (a reprint template), or only \\twocolumngrid for blocks of two or three (a preprint template)',
      },
    },
    presets: PRESETS,
    // revtex4-2.cls l.4448, 4511 (\newcommand\onecolumngrid, \twocolumngrid), l.7465-7469 (widetext); aastex701.cls l.4114, 4177, 13453.
    requires: ['env:widetext', 'cmd:\\onecolumngrid', 'cmd:\\twocolumngrid'],
    only: ['class.revtex4-2', 'class.revtex4-2-aip', 'class.aastex'],
    gives: { columns: true },
    // \onecolumngrid and \twocolumngrid act through the output routine on the main vertical list (\do@output@MVL), and widetext
    // on a two-column page runs both: in a box, an argument or another columns block they cannot reach the page.
    needs: { columns: false, argument: false, maxBoxDepth: 0 },
    targetEngine: 'yes',
  }),
);
