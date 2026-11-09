import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'head.class-native',
    node: 'paragraph/heading',
    description:
      "The class's own heading looks: the kernel commands with nothing restyled and nothing loaded, as acmart, llncs, IEEEtran or a thesis class's \\@startsection want them; under amsbook, optionally with sections numbered within chapters (\\numberwithin{section}{chapter}). 274 templates.",
    // The same LaTeX as head.kernel's: the class's own sectioning commands, which this way leaves untouched.
    writes: '\\section[…]{…} \\label{…}',
    ctan: ['latex-base'],
    features: ['class-styled', 'numbered-within'],
    params: {
      sectionWithinChapter: {
        type: 'boolean',
        default: false,
        description: 'sections numbered within chapters, 1.1, 1.2 … (\\numberwithin{section}{chapter}, amsmath\'s, which amsbook loads itself)',
      },
    },
    presets: PRESETS,
    requires: [
      'counter:{kind}',
    ],
    // amsmath's \numberwithin on the class's chapter counter: amsbook preloads amsmath, and the class is the only one the form is for.
    requiresWhen: [{ when: { sectionWithinChapter: true }, requires: ['pkg:amsmath', 'counter:chapter'] }],
    onlyWhen: [
      {
        when: { sectionWithinChapter: true },
        classes: ['class.amsbook'],
        reason:
          "\\numberwithin is amsmath's, which amsbook loads itself (and the AMS asks not to load again); under a class without amsmath preloaded it stops at \"Undefined control sequence\", and one without chapters has no counter to number within",
        evidence: [
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0260-amsproc/doc/amsbook-template.tex', line: '56-57' },
          { kind: 'requirement', file: 'Template/template-requirement/AMS_Amsbook.md', line: '58' },
        ],
      },
    ],
    // Below cols.vwcol a heading comes out at the full text width (172.7pt over in a 0.5 column): 0 of 561 library headings there pass but
    // head.sectsty@smallcaps's \subparagraph (55 of 59), run-in titles that never print (their footnote sibling's sentinel is missing).
    // Copy batch-3b, 5 pairs; e.g. d165d94f2adcdc3093699 result 82adbd1a35 l.150, an unmarked \section* 172.7pt over.
    needs: { paragraph: true },
    // The amsbook preset typeset ok on ZeroTeX-NG (2026-11-07): \thesection 1.1 after \chapter, 1 without the line. The way stays untested.
    targetEngine: 'untested',
  }),
);
