import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'cols.twocolumn-cmd',
    node: 'containerBlock/columns',
    description:
      "The kernel's \\twocolumn and \\onecolumn: the block starts a page in two columns and the next page returns to the column mode, gap and rule it found (one column only where the page was one); \\columnsep from the node and \\columnseprule for a rule. 44 templates. revtex4-2 and aastex have neither (their own \\onecolumngrid/\\twocolumngrid switch in place).",
    ctan: ['latex-base'],
    features: ['page-columns', 'page-break-before', 'column-rule'],
    params: {
      rule: { type: 'dimen', default: '', description: "a rule between the columns (\\columnseprule); ''" },
      returnToOne: { type: 'boolean', default: true, description: 'back to one column after the block (\\onecolumn, a new page)' },
    },
    presets: PRESETS,
    deny: [
      {
        class: 'class.revtex4-2',
        reason: "revtex4-2 has no \\twocolumn or \\onecolumn: its page grid (ltxgrid, built into the class) sets both to \\@undefined, so each stops at 'Undefined control sequence' and the block stays in the class's own columns. revtex4-2 switches the grid in place with \\onecolumngrid and \\twocolumngrid (no new page) and spans both columns with widetext; under reprint the page is already two columns",
        evidence: [
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0908-aip-conference-proceedings/tex/latex/revtex/revtex4-2.cls', line: '4449' },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0908-aip-conference-proceedings/tex/latex/revtex/revtex4-2.cls', line: '4512' },
          { kind: 'compile', cell: 'testing-pipeline/out/results/075be2a2008f (revtex4-2-aps.A run, document deb9f4d33be5269c775c7: Undefined control sequence at l.36 \\twocolumn and l.38 \\onecolumn, then at every block; 0 of 843 cols.twocolumn-cmd branches pass in that run, in 34 documents; article.A passes 776 of 1,859)' },
        ],
      },
      {
        class: 'class.aastex',
        reason: "aastex701 is built on revtex's page grid (ltxgrid) and sets \\onecolumn and \\twocolumn to \\@undefined the same way; it switches the grid in place with \\onecolumngrid and \\twocolumngrid",
        evidence: [
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0563-aastex/aastex701.cls', line: '4115' },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0563-aastex/aastex701.cls', line: '4178' },
        ],
      },
    ],
    gives: { columns: true },
    zerotex: 'untested',
  }),
);
