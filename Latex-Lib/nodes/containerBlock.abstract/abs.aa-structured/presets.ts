/**
 * abs.aa-structured's preset, from A&A's kit and the research's Solution file for it.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const CLS = 'testing-pipeline/settings/classes/files/aa.cls';
export const KIT = 'Latex Related Research/Latex-lib-main/Source/0411-aanda/aa_example.zip!aa_example.tex';

export const PRESETS = {
  structured: {
    description:
      "A&A's structured abstract: the five arguments \\abstract{context}{aims}{methods}{results}{conclusions}, printed by \\maketitle under the run-in headings Context. Aims. Methods. Results. Conclusions. (Context and Conclusions only when given), from the abstract's labelled paragraphs.",
    features: ['class-styled', 'run-in-head'],
    params: {},
    evidence: [solution('0411-aanda', '42'), { kind: 'source', file: KIT, line: '75-91' }, { kind: 'source', file: CLS, line: '479-483, 814-837, 1145-1168' }],
  },
} as const satisfies { readonly [name: string]: Preset };
