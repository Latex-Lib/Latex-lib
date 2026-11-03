import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'head.class-native',
    node: 'paragraph/heading',
    description:
      "The class's own heading looks: the kernel commands with nothing restyled and nothing loaded, as acmart, llncs, IEEEtran or a thesis class's \\@startsection want them. 274 templates.",
    ctan: ['latex-base'],
    features: ['class-styled'],
    presets: PRESETS,
    requires: [
      'counter:{kind}',
    ],
    // Below cols.vwcol a heading comes out at the full text width (172.7pt over in a 0.5 column): 0 of 561 library headings there pass but
    // head.sectsty@smallcaps's \subparagraph (55 of 59), run-in titles that never print (their footnote sibling's sentinel is missing).
    // Copy batch-3b, 5 pairs; e.g. d165d94f2adcdc3093699 result 82adbd1a35 l.150, an unmarked \section* 172.7pt over.
    needs: { paragraph: true },
    zerotex: 'untested',
  }),
);
