/**
 * para.kernel's presets, from the templates' paragraph spacing (`node seed.ts sp --rows`:
 * sp.parskip-pkg, sp.lengths).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  class: {
    description: "A paragraph as the class sets it (indented first line, no space between), indented by \\hspace* for each indent step; an empty one keeps its line with \\strut.",
    features: ['indented'],
    params: {},
    evidence: [solution('0003-ucsmonograph', '43')],
  },
  'space-between': {
    description: 'Paragraphs separated by space instead of indented, by the parskip package (\\usepackage{parskip}).',
    features: [],
    params: { separation: 'parskip' },
    evidence: [solution('0012-basic-academic-journal-article', '38'), solution('0014-daniel-wambua-cv', '36')],
  },
  'space-and-indent': {
    description: 'Space between paragraphs and an indent too (\\usepackage[skip=10pt plus1pt, indent=40pt]{parskip}).',
    features: ['indented'],
    params: { separation: 'parskip', skip: '10pt plus1pt', indent: '40pt' },
    evidence: [solution('0026-exam-lite', '33')],
  },
  'no-indent': {
    description: 'No first-line indent and no space between paragraphs (\\setlength{\\parindent}{0pt}).',
    features: [],
    params: { separation: 'lengths', indent: '0pt', skip: '0pt' },
    evidence: [solution('0018-fhj-script', '63'), solution('0006-gsemthesis', '53')],
  },
} as const satisfies { readonly [name: string]: Preset };
