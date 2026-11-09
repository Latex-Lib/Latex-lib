/**
 * tbl.header-plain's presets. The bold one is what class.emulateapj's answer
 * writes by hand where tbl.header (colortbl) is refused; small capitals is
 * tbl.header's smallcaps look in its text-command form.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  bold: {
    description: 'A header cell in \\textbf{…} with no colortbl and no shade; a row span as \\multirow{n}{=}{…}.',
    features: ['bold-head', 'cell-spans'],
    params: {},
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/_answers/class.emulateapj.json', line: '32' },
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/_briefs/class.emulateapj.md', line: '401-404' },
      { kind: 'compile', reproducer: 'scratchpad/build/work/tbl.header-plain/emulateapj-bold (ZeroTeX-NG, 2026-11-07): \\documentclass{emulateapj}, a kernel p-column tabular with \\textbf header cells and a \\multirow{2}{=}{\\textbf{…}} header, ok' },
    ],
  },
  smallcaps: {
    description: 'A header cell in small capitals, \\textsc{…}, with no colortbl and no shade.',
    writes: '\\textsc{…} &',
    features: ['smallcaps-head', 'cell-spans'],
    params: { font: 'textsc' },
    evidence: [
      solution('0098-minimal-cv', '43'),
      { kind: 'compile', reproducer: 'scratchpad/build/work/tbl.header-plain/emulateapj-smallcaps (ZeroTeX-NG, 2026-11-07): \\documentclass{emulateapj}, \\textsc header cells, ok' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
