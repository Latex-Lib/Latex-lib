import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { commandsOf, ELEGANTPAPER, JMLR } from './kinds.ts';
import { PRESETS } from './presets.ts';

const source = (file: string, line: string) => ({ kind: 'source', file, line }) as const;
const SOURCE = 'Latex Related Research/Latex-lib-main/Source';
const ELEGANT_CLS = source(`${SOURCE}/0188-elegantpaper/elegantpaper.cls`, '255-256');
const JMLR_DTX = source(`${SOURCE}/0662-jmlr/jmlr.dtx`, '1860-2004');
const MDPI_CLS = source('testing-pipeline/settings/classes/files/Definitions/mdpi.cls', '481, 511-522');
const ECCV_STY = source('eccv.sty (commit 791fe5b)', '249-255');

type Commands = readonly `cmd:\\${string}`[];
const required = (vocabulary: { readonly [kind: string]: string }): Commands => commandsOf(vocabulary).map((c) => `cmd:${c}` as `cmd:\\${string}`);

const base = minimal({
  id: 'xref.class-native',
  node: 'ref/ref',
  description:
    "The class's own reference commands, which print the target's name themselves: elegantpaper's \\figref{label} and \\tabref{label} (a bold 'Figure n'); jmlr's (PMLR's) \\figureref, \\tableref, \\sectionref, \\equationref, \\algorithmref, \\theoremref ... \\appendixref; or \\cref{label} (\\Cref) through the cleveref that eccv's style or the mdpi class loads itself, with no load of the way's own. The command is chosen by the node's name (Figure, Table, Section ...); a kind the class has no command for falls back to Name~\\ref{label}.",
  writes: '\\figref{…} \\tabref{…} | \\figureref{…} \\tableref{…} \\sectionref{…} \\equationref{…} … | \\cref{…}; …~\\ref{…}',
  ctan: ['elegantpaper', 'jmlr'],
  features: ['named-refs', 'class-styled'],
  params: {
    vocabulary: {
      type: 'enum',
      values: ['elegantpaper', 'jmlr', 'cleveref'],
      default: 'elegantpaper',
      compat: true,
      description: "whose commands: elegantpaper's \\figref and \\tabref, jmlr's \\…ref, or \\cref through the class's own cleveref (eccv, mdpi)",
    },
    cref: { type: 'enum', values: ['cref', 'Cref'], default: 'cref', description: 'with vocabulary cleveref: \\cref, or \\Cref (capitalised, at a sentence start)' },
  },
  presets: PRESETS,
  // No load: each command is the class's (or its style's). A way's own cleveref is refused under eccv and mdpi (their profiles'
  // forbids), which load it after the preamble.
  loads: [],
  requiresWhen: [
    { when: { vocabulary: 'elegantpaper' }, requires: required(ELEGANTPAPER) },
    // jmlr.dtx l.1926-2004; the jmlr-pmlr profile lists none of them yet (only \subfigref).
    { when: { vocabulary: 'jmlr' }, requires: required(JMLR) },
    // cleveref as eccv.sty (l.249-255) and mdpi.cls (l.481) load it; neither profile lists \cref yet.
    { when: { vocabulary: 'cleveref' }, requires: ['cmd:\\cref'] },
    { when: { vocabulary: 'cleveref', cref: 'Cref' }, requires: ['cmd:\\Cref'] },
  ],
  only: ['class.elegantpaper', 'class.jmlr-pmlr', 'class.eccv', 'class.mdpi'],
  onlyWhen: [
    { when: { vocabulary: 'elegantpaper' }, classes: ['class.elegantpaper'], reason: 'only elegantpaper defines \\figref and \\tabref', evidence: [ELEGANT_CLS] },
    { when: { vocabulary: 'jmlr' }, classes: ['class.jmlr-pmlr'], reason: 'only jmlr defines \\figureref, \\sectionref and the other \\…ref commands over its \\objectref', evidence: [JMLR_DTX] },
    {
      when: { vocabulary: 'cleveref' },
      classes: ['class.eccv', 'class.mdpi'],
      reason: 'eccv.sty and mdpi.cls load cleveref themselves, after the preamble; under another class \\cref needs a way that loads cleveref (xref.cleveref)',
      evidence: [ECCV_STY, MDPI_CLS],
    },
  ],
  targetEngine: 'yes',
});

export default defineKey({
  ...base,
  evidence: [
    ...base.evidence,
    ELEGANT_CLS,
    JMLR_DTX,
    source(`${SOURCE}/0662-jmlr/pmlr-sample.tex`, '145-181'),
    ECCV_STY,
    source('testing-pipeline/settings/classes/files/Definitions/mdpi.cls', '389-414, 481, 511-522'),
  ],
});
