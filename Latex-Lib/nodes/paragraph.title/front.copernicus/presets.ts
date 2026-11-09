/**
 * front.copernicus's presets: Copernicus Publications' one title block (template.tex l.85-126, the same for every journal
 * the class serves; the journal is a class option).
 */
import type { Preset } from '../../../schema/params.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source/0195-copernicus';

export const PRESETS = {
  copernicus: {
    description:
      "Copernicus's title block: \\title, one \\Author[affiliation numbers][email]{given}{surname} per author (the email on the corresponding author), \\affil[n]{…} per affiliation, \\deceased and \\equalcontrib notes, \\correspondence, the required \\runningtitle and \\runningauthor, \\keywords, then \\maketitle; the abstract after it.",
    features: ['class-styled'],
    params: {},
    evidence: [
      { kind: 'source', file: `${SOURCE}/template.tex`, line: '85-126 (\\title, \\Author[][EMAIL]{}{} for the correspondence author, \\affil[]{ADDRESS}, the \\deceased and \\equalcontrib notes, \\runningtitle, \\runningauthor, \\maketitle, then the abstract)' },
      { kind: 'source', file: `${SOURCE}/copernicus.cls`, line: '551-553, 603 (\\@runtest), 1583-1657 (\\author, \\affil), 1659-1680 (\\deceased, \\equalcontrib), 1683-1742 (\\Author), 2606-2624 (\\@corresp, \\correspondence), 2671-2676 (\\keywords), 2692-2695 (\\runningauthor, \\runningtitle)' },
      { kind: 'solution', file: 'Solution/0195-copernicus.md', lines: '50-51' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
