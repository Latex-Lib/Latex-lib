/**
 * doc.frontiers-manuscript's presets, from Frontiers' template.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  manuscript: {
    description: "Frontiers' manuscript form: one column from the first page, numbered from 1, \\AtBeginDocument{\\onecolumn\\firstpage{1}}, as the template opens its body.",
    writes: '\\AtBeginDocument{\\onecolumn\\firstpage{…}}',
    features: ['class-styled'],
    params: { columns: 'one', firstPage: 1 },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0757-frontiers/frontiers.tex', line: '45-46' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0757-frontiers/FrontiersinHarvard.cls', line: '266-283, 308-310, 903' },
      solution('0757-frontiers', '33, 35'),
    ],
  },
  'two-column': {
    description: "Frontiers' two-column page, the class's own, with the first page's number set: \\AtBeginDocument{\\firstpage{1}}.",
    writes: '\\AtBeginDocument{\\firstpage{…}}',
    features: ['class-styled'],
    params: { columns: 'two', firstPage: 1 },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0757-frontiers/FrontiersinHarvard.cls', line: '266-275, 903' }],
  },
} as const satisfies { readonly [name: string]: Preset };
