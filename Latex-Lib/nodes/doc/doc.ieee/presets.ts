/**
 * doc.ieee's presets, each from the templates that use it.
 */
import type { Preset } from '../../../schema/params.ts';

export const PRESETS = {
  // IEEE's conference template: \documentclass[conference]{IEEEtran} \IEEEoverridecommandlockouts, for a funding \thanks.
  conference: {
    description: "IEEEtran in conference mode with its command lockouts lifted, \\IEEEoverridecommandlockouts, so a \\thanks (a funding note) prints in the first column's foot.",
    writes: '\\IEEEoverridecommandlockouts',
    features: ['class-styled'],
    params: { overrideLockouts: true },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0859-ieeetran-compsoc-conference/IEEE-conference-template-062824.tex', line: '2' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0743-ieeetran-journal/IEEEtran/bare_conf.tex', line: '345-348' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0743-ieeetran-journal/IEEEtran/IEEEtran.cls', line: '6230-6289' },
    ],
  },
  // The IEEE Robotics and Automation Society's ieeeconf template: both switches after the class line.
  'ieeeconf-ras': {
    description: "ieeeconf (IEEE RAS conferences) with its lockouts lifted and its printer margins: \\IEEEoverridecommandlockouts \\overrideIEEEmargins.",
    writes: '\\IEEEoverridecommandlockouts \\overrideIEEEmargins',
    features: ['class-styled'],
    params: { overrideLockouts: true, overrideMargins: true },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0223-ieee-ieeeconf/root.tex', line: '9, 12' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0223-ieee-ieeeconf/ieeeconf.cls', line: '1188-1212, 4570-4580' },
    ],
  },
  // IEEE Access: the rotated end mark the class insists on.
  'access-end-mark': {
    description: "IEEE Access's end-of-document mark: \\EOD, the class's rotated bullet, run at \\end{document} before the class checks that it was used.",
    writes: '\\AddToHook{enddocument}[latexlib/eod]{\\EOD} \\DeclareHookRule{enddocument}{latexlib/eod}{before}{…}',
    features: ['class-styled', 'flush-right'],
    params: { endMark: true },
    evidence: [
      { kind: 'source', file: 'Template/templates/ieee-access/files/ieeeaccess.cls', line: '992 (\\EOD), 1076-1086 (\\AtEndDocument check)' },
      { kind: 'source', file: 'Template/templates/ieee-access/starter.tex', line: '359' },
      { kind: 'requirement', file: 'Template/template-requirement/IEEE_Access.md', line: '38' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
