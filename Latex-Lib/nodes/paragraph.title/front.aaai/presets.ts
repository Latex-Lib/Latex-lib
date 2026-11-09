/**
 * front.aaai's presets: AAAI's one title block, with the author list on as many lines as it fills or broken after every
 * few authors (AAAI's AuthorKit, anonymous-submission-latex-2026.tex; the submission mode, which hides the authors, is the
 * style's own option, not a preset).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const KIT = 'Latex Related Research/Latex-lib-main/Source/0703-aaai/AnonymousSubmission/LaTeX/anonymous-submission-latex-2026.tex';
const STY = 'Latex Related Research/Latex-lib-main/Source/0031-nhatkhangcs-overleaf-comments/examples/aaai/aaai2027.sty (2027/05/04)';

export const PRESETS = {
  aaai: {
    description:
      "AAAI's title block: \\title, the authors joined by commas with \\equalcontrib, \\corresponding and \\textsuperscript{\\rm 1,\\rm 2} affiliation numbers, \\affiliations with the numbered affiliations and a closing line of e-mails, then the style's \\maketitle.",
    features: ['class-styled'],
    params: {},
    evidence: [
      solution('0703-aaai', '25, 49-50'),
      { kind: 'source', file: KIT, line: '94-126 (\\title, \\author with \\textsuperscript{\\rm 1} and \\equalcontrib, \\affiliations ending in the e-mail), 143-156 (several authors and affiliations), 166 (\\maketitle)' },
      { kind: 'source', file: STY, line: '98-127 (\\maketitle), 128 (\\affiliations), 130-206 (\\@maketitle; \\equalcontrib l.139-146, \\corresponding l.147-155)' },
    ],
  },
  'line-breaks': {
    description: "AAAI's title block with the author list broken onto a new line after every three authors (a \\\\ after the comma), as the style's instructions break a long list.",
    writes: '\\title{…} \\author{…, …, …,\\\\ …} \\affiliations{\\textsuperscript{\\rm 1}…\\\\ …@…} \\maketitle',
    features: ['class-styled'],
    params: { lineBreakEvery: 3 },
    evidence: [{ kind: 'source', file: KIT, line: '97-106 (\\\\ after an author and its comma), 486-491 (AuthorThree\\textsuperscript{\\rm 3},\\\\), 508 (break the author list with \\\\)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
