/**
 * front.frontiers's presets: Frontiers' title block as its template writes it (one form; the journal and the reference style are
 * the class line's, FrontiersinHarvard or FrontiersinVancouver).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SRC = 'Latex Related Research/Latex-lib-main/Source/0757-frontiers';

export const PRESETS = {
  frontiers: {
    description:
      "Frontiers' title block: \\keyFont, \\firstAuthorLast, \\Authors (names with affiliation numbers and the corresponding author's star), \\Address, \\corrAuthor and \\corrEmail defined in the preamble, then \\title[running title]{…} \\author[\\firstAuthorLast]{\\Authors} \\address{} \\correspondance{} \\extraAuth{…} \\maketitle under the Frontiers logo and a rule, in Helvetica; the keywords in bold at the end of the abstract.",
    features: ['class-styled', 'sans-serif', 'ruled'],
    params: {},
    evidence: [
      solution('0757-frontiers', '23, 46, 47, 49'),
      { kind: 'source', file: `${SRC}/frontiers.tex`, line: '28-39 (\\keyFont, \\firstAuthorLast, \\Authors, \\Address, \\corrAuthor, \\corrEmail), 48-58 (\\title[…] \\author[\\firstAuthorLast]{\\Authors} \\address{} \\correspondance{} \\extraAuth{} \\maketitle), 70-71 (keywords)' },
      { kind: 'source', file: `${SRC}/FrontiersinHarvard.cls`, line: '232-248 (running heads), 395-411 (\\title, \\author, \\address, \\correspondance, \\extraAuth), 475-509 (\\@maketitle)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
