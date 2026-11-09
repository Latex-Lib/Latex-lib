import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'doc.ieee',
    node: 'doc',
    description:
      "IEEE's preamble switches: IEEEtran's \\IEEEoverridecommandlockouts, which lifts conference mode's lockout of \\thanks, \\IEEEPARstart, \\IEEEpubid and the biographies; ieeeconf's \\overrideIEEEmargins, the RAS printer margins; and IEEE Access's end-of-document mark \\EOD, run at \\end{document} through the enddocument hook before the class checks for it.",
    writes: '\\IEEEoverridecommandlockouts \\overrideIEEEmargins | \\AddToHook{enddocument}[latexlib/eod]{\\EOD} \\DeclareHookRule{enddocument}{latexlib/eod}{before}{…}',
    ctan: ['ieeetran'],
    features: ['class-styled'],
    params: {
      overrideLockouts: { type: 'boolean', default: false, description: '\\IEEEoverridecommandlockouts: restores \\thanks, \\IEEEPARstart, \\IEEEpubid, \\IEEEmembership and the biographies in conference mode' },
      overrideMargins: { type: 'boolean', default: false, compat: true, description: "\\overrideIEEEmargins: ieeeconf's wider binding margin (ieeeconf only)" },
      endMark: { type: 'boolean', default: false, compat: true, description: "IEEE Access's \\EOD at \\end{document}, before the class's check that it ran (ieeeaccess only)" },
      classLabel: {
        type: 'string',
        default: 'ieeeaccess-latexlib',
        description: "the hook label of the class's own \\AtEndDocument, its file name: ieeeaccess-latexlib (the library's class), ieeeaccess for the publisher's file as it ships",
      },
    },
    presets: PRESETS,
    requiresWhen: [
      { when: { overrideLockouts: true }, requires: ['cmd:\\IEEEoverridecommandlockouts'] },
      { when: { overrideMargins: true }, requires: ['cmd:\\overrideIEEEmargins'] },
      { when: { endMark: true }, requires: ['cmd:\\EOD'] },
    ],
    only: ['class.ieeetran', 'class.ieeeconf-ras', 'class.ieeeaccess'],
    onlyWhen: [
      {
        when: { overrideMargins: true },
        classes: ['class.ieeeconf-ras'],
        reason: '\\overrideIEEEmargins is ieeeconf\'s own (ieeeconf.cls l.1188-1212); IEEEtran has no such command: "Undefined control sequence"',
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0223-ieee-ieeeconf/ieeeconf.cls', line: '1188-1212' }],
      },
      {
        when: { endMark: true },
        classes: ['class.ieeeaccess'],
        reason: "\\EOD is ieeeaccess's own (ieeeaccess.cls l.992), and the hook rule names its file's label",
        evidence: [{ kind: 'source', file: 'Template/templates/ieee-access/files/ieeeaccess.cls', line: '992, 1076-1086' }],
      },
    ],
    // Typeset ok (ZeroTeX-NG, 2026-11-07): conference under \documentclass[conference]{IEEEtran} with a \thanks in the title (the log's
    // "Overriding command lockouts"); ieeeconf-ras under ieeeconf.cls (Source/0223-ieee-ieeeconf) [letterpaper, 10 pt, conference];
    // access-end-mark under Template/templates/ieee-access/files/ieeeaccess.cls, both as ieeeaccess-latexlib.cls and as ieeeaccess.cls
    // with the matching classLabel, accessblue set in cmyk without spotcolor (the profile's XeTeX patch; spotcolor's \pdfobj stops
    // under XeTeX), graphicx and a \doi as the setting gives them. Without the \DeclareHookRule the class stops at "You have not
    // used the command \EOD": the preamble's hook code runs after the class's own \AtEndDocument.
    targetEngine: 'yes',
  }),
);
