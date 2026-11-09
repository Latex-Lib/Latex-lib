/**
 * front.icml's presets: ICML's one title block, as the kit's example_paper.tex writes it (icml2026.zip; the anonymous
 * submission, which hides the authors, is the style's own option, not a preset).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const EXAMPLE = 'Latex Related Research/Latex-lib-main/Source/0461-icml/example_paper.tex';
const STY = 'Latex Related Research/Latex-lib-main/Source/0461-icml/icml2026.sty';

export const PRESETS = {
  icml: {
    description:
      "ICML's title block: \\icmltitlerunning for the running head, then \\twocolumn[ \\icmltitle, \\icmlsetsymbol{equal}{*}, the icmlauthorlist of \\icmlauthor{name}{equal,aff1,…}, \\icmlaffiliation per affiliation, \\icmlcorrespondingauthor, \\icmlkeywords, \\vskip 0.3in ] and \\printAffiliationsAndNotice, the footnote of numbered affiliations, correspondence and notice.",
    features: ['class-styled', 'centered', 'ruled'],
    params: {},
    evidence: [
      solution('0461-icml', '23, 52-53'),
      { kind: 'source', file: EXAMPLE, line: '58-60 (\\icmltitlerunning), 64-110 (\\twocolumn[ … ] with the whole block), 112-124 (\\printAffiliationsAndNotice{} or {\\icmlEqualContribution})' },
      { kind: 'source', file: STY, line: '353-404 (\\icmltitlerunning, \\icmltitle), 426-502 (icmlauthorlist, \\icmlauthor, \\icmlsetsymbol, \\icmlaffiliation, \\icmlcorrespondingauthor, \\icmlEqualContribution), 519-550 (\\printAffiliationsAndNotice, \\icmlkeywords)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
