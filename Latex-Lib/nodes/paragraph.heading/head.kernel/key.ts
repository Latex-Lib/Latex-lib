import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { NUMBERING } from '../node.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'head.kernel',
    node: 'paragraph/heading',
    description:
      "The kernel's sectioning commands, \\part to \\subparagraph: \\section[short]{Title}, starred when unnumbered, with its \\label. The class's look; only the numbering can change, its depth (\\setcounter{secnumdepth}) and a chapter's or section's number style. The way 496 of the research's templates use.",
    writes: '\\section[…]{…} \\label{…}',
    ctan: ['latex-base'],
    features: ['numbered', 'unnumbered', 'lettered', 'bold-head', 'hang-head'],
    params: {
      ...NUMBERING,
    },
    presets: PRESETS,
    requires: [
      'counter:{kind}',
    ],
    // Below cols.vwcol a heading comes out at the full text width (172.7pt over in a 0.5 column): 0 of 561 library headings there pass but
    // head.sectsty@smallcaps's \subparagraph (55 of 59), run-in titles that never print (their footnote sibling's sentinel is missing).
    // Copy batch-3b, 5 pairs; e.g. d165d94f2adcdc3093699 result 82adbd1a35 l.150, an unmarked \section* 172.7pt over.
    needs: { paragraph: true },
    targetEngine: 'untested',
  }),
);
