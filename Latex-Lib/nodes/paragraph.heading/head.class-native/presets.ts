/**
 * head.class-native's presets, each from the templates that use it (`node seed.ts head --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  class: {
    description: "The class's own heading look, untouched: fonts, spacing and numbering as the class sets them (acmart, llncs, IEEEtran, ltxdoc, a thesis class's \\@startsection).",
    features: ['class-styled'],
    params: {},
    evidence: [solution('0061-cascadilla-proceedings-project', '34'), solution('0125-eurographics', '40'), solution('0159-deutschesmuseum', '43'), solution('0179-simplecv', '33')],
  },
  amsbook: {
    description:
      "amsbook's own heading look with sections numbered within chapters, 1.1, 1.2 … (\\numberwithin{section}{chapter} in the preamble, amsmath's, which the class loads itself).",
    writes: '\\section[…]{…} \\label{…}; \\numberwithin{section}{chapter}',
    features: ['class-styled', 'numbered-within'],
    params: { sectionWithinChapter: true },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0260-amsproc/doc/amsbook-template.tex', line: '56-57' },
      { kind: 'requirement', file: 'Template/template-requirement/AMS_Amsbook.md', line: '58' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
