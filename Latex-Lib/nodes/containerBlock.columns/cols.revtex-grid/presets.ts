/**
 * cols.revtex-grid's presets, from revtex4-2's and aastex701's sources and the APS and AIP samples.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const REVTEX = 'Latex Related Research/Latex-lib-main/Source/0908-aip-conference-proceedings';

export const PRESETS = {
  'by-count': {
    description: 'The grid by the block: one column across the page (widetext), two or three in \\twocolumngrid, then back to the grid it found.',
    features: ['page-columns'],
    params: {},
    evidence: [
      { kind: 'source', file: `${REVTEX}/tex/latex/revtex/revtex4-2.cls`, line: '4409-4428 (\\do@columngrid, \\start@column), 4448, 4511 (\\onecolumngrid, \\twocolumngrid), 7399-7470 (widetext)' },
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '4114, 4177 (\\onecolumngrid, \\twocolumngrid), 13453 (widetext)' },
      {
        kind: 'compile',
        reproducer:
          "a widetext block, then two grid blocks one straight after the other (\\LibGridSave \\twocolumngrid … \\LibGridBack twice), then a paragraph, \\typeout of \\thepagegrid and \\pagegrid@col in each: mlt 2 in both blocks, then one 1 after them under revtex4-2 [aps,preprint] and aastex701, mlt 2 throughout under [aps,reprint] and [aip,jcp,reprint]; all four typeset with no error (ZeroTeX-NG, class-examples' typeset-dir, 2026-11-07)",
      },
    ],
  },
  widetext: {
    description: 'A one-column block set across both columns of a reprint page (\\begin{widetext}); other blocks stay in the page\'s columns.',
    writes: '\\begin{widetext} … \\end{widetext}',
    features: ['page-columns'],
    params: { mode: 'widetext' },
    evidence: [solution('0908-aip-conference-proceedings', '47'), { kind: 'source', file: `${REVTEX}/doc/latex/revtex/sample/aip/aipsamp.tex`, line: '310-324' }, { kind: 'source', file: `${REVTEX}/doc/latex/revtex/sample/aps/apstemplate.tex`, line: '92-94' }],
  },
  twocolumngrid: {
    description: 'A block of two columns on a one-column (preprint) page, \\twocolumngrid in place, then back to one column (\\onecolumngrid); one-column blocks stay as they are.',
    writes: '\\LibGridSave \\twocolumngrid … \\LibGridBack',
    features: ['page-columns'],
    params: { mode: 'twocolumngrid' },
    evidence: [{ kind: 'source', file: `${REVTEX}/tex/latex/revtex/revtex4-2.cls`, line: '2661-2665 (the class\'s own \\onecolumngrid … \\twocolumngrid switch), 4511-4512 (\\twocolumngrid; \\twocolumn undefined)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
