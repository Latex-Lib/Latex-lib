/**
 * front.aistats's presets: AISTATS's title block in its forms (the kit's sample_paper.tex and supplement.tex; the review,
 * accepted and preprint modes are the style's own options, not presets).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const KIT = 'Latex Related Research/Latex-lib-main/Source/0794-aistats';

export const PRESETS = {
  aistats: {
    description:
      "AISTATS's title block: \\runningtitle and \\runningauthor for the page heads, then \\twocolumn[ \\aistatstitle{…} \\aistatsauthor{A \\And B \\And C} \\aistatsaddress{… \\And … \\And …} ] across both columns, three authors to a row, each with their institution below.",
    features: ['class-styled', 'ruled', 'centered'],
    params: {},
    evidence: [
      solution('0794-aistats', '24, 38, 41'),
      { kind: 'source', file: `${KIT}/sample_paper.tex`, line: '37-57 (\\runningtitle, \\runningauthor, \\twocolumn[ \\aistatstitle \\aistatsauthor{ Author 1 \\And Author 2 \\And Author 3 } \\aistatsaddress{…} ])' },
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.aistats/main.tex', line: '44-45, 102-108 (the same form under aistats2027)' },
    ],
  },
  'shared-address': {
    description: "AISTATS's title block where consecutive authors of the same institution share one block, their names joined by \\and (printed \"and\") over one address.",
    writes: '\\runningtitle{…} \\runningauthor{…} \\twocolumn[ \\aistatstitle{…} \\aistatsauthor{… \\and … \\And …} \\aistatsaddress{… \\And …} ]',
    features: ['class-styled', 'ruled', 'centered'],
    params: { group: 'shared' },
    evidence: [{ kind: 'source', file: `${KIT}/aistats2026.sty`, line: '326, 372 (\\and inside a block prints "and"), 327-329, 373-375 (\\And starts the next block)' }],
  },
  'one-column': {
    description: "AISTATS's title block on a one-column page (\\onecolumn, then \\aistatstitle and the author rows), as the supplementary material is set.",
    writes: '\\runningtitle{…} \\runningauthor{…} \\onecolumn \\aistatstitle{…} \\aistatsauthor{… \\And …} \\aistatsaddress{… \\And …}',
    features: ['class-styled', 'ruled', 'centered'],
    params: { wrapper: 'onecolumn' },
    evidence: [{ kind: 'source', file: `${KIT}/supplement.tex`, line: '33 (\\runningtitle), 43-45 (\\onecolumn then \\aistatstitle)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
