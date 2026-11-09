/**
 * cols.cvcolumns's presets, from moderncv's own template (Source/0196-moderncv/template.tex l.249-254, the References section:
 * two columns without a width and a third \cvcolumn[0.5]) and the class's definition (moderncv.cls l.653-750).
 */
import type { Preset } from '../../../schema/params.ts';

const TEMPLATE = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0196-moderncv/template.tex', line: '249-254' } as const;
const CLASS = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0196-moderncv/moderncv.cls', line: '653-750' } as const;

export const PRESETS = {
  equal: {
    description: "moderncv's columns of equal width side by side with empty heads, the blocks shared out in order (\\begin{cvcolumns} \\cvcolumn{}{…} \\cvcolumn{}{…} \\end{cvcolumns}).",
    writes: '\\begin{cvcolumns} \\cvcolumn{}{…} \\end{cvcolumns}',
    features: ['parallel-columns', 'class-styled'],
    params: {},
    evidence: [TEMPLATE, CLASS],
  },
  'wide-last': {
    description: "moderncv's columns with the last one half the width (\\cvcolumn[0.5]{}{…}) and the others sharing the rest, as the template's References section.",
    writes: '\\begin{cvcolumns} \\cvcolumn{}{…} \\cvcolumn[…]{}{…} \\end{cvcolumns}',
    features: ['parallel-columns', 'unequal-widths', 'class-styled'],
    params: { widths: 'wide-last' },
    evidence: [TEMPLATE, CLASS],
  },
} as const satisfies { readonly [name: string]: Preset };
