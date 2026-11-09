/**
 * math.linenomath's presets, from the templates that use it.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual } from '../../evidence.ts';

const AGU = 'Latex Related Research/Latex-lib-main/Source/0040-agu/April 16 2019/agujournaltemplate.tex';

export const PRESETS = {
  agu: {
    description: "AGU's manuscript: every display in linenomath* so its lines are numbered with the text, numbering turned on by \\linenumbers in the preamble.",
    writes: '\\linenumbers; \\begin{linenomath*} \\begin{equation} … \\label{…} \\end{equation} \\end{linenomath*}',
    features: ['numbered', 'unnumbered', 'aligned', 'multiline', 'line-numbers'],
    params: { lineNumbers: true },
    evidence: [{ kind: 'source', file: AGU, line: '22 (\\linenumbers), 208-214 and 296-301 (linenomath* around equation)' }],
  },
  'wrap-only': {
    description: 'Displays in linenomath* under a class that numbers lines itself (AGU in draft, CoRL in submission): no \\linenumbers of its own.',
    features: ['numbered', 'unnumbered', 'aligned', 'multiline', 'line-numbers'],
    params: {},
    evidence: [manual('lineno', 'linenomath and linenomath*: numbering the lines of displayed equations'), { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0040-agu/April 16 2019/agujournal2019.cls', line: '102 (lineno), 709 (\\linenumbers)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
