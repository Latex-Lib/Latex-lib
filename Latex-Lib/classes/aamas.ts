import { defineClass } from '../schema/class.ts';
import acmart from './acmart.ts';

/**
 * AAMAS 2027's class (the aamas setting, batch 3: `\documentclass[sigconf]{aamas}`), the pinned
 * testing-pipeline/settings/classes/files/aamas.cls ('2026/06/27 v2.19', sha256 e88c8e3e...), read from its source, not yet
 * measured by the class probe. It is acmart.cls v2.19 under another name (`\ProvidesClass{aamas}`, l.40): beside the
 * mirror's acmart v2.20 it differs in 186 lines, all in the copyright modes (ifaamas, l.1939), the running heads
 * (`\submissionType`, l.1730-1738, 3146-3160, 3244-3258) and the name, and loads the same packages in the same way: amsart
 * (l.288), natbib (l.306), hyperref with bookmarksnumbered and unicode (l.528), xcolor with prologue (l.594), geometry (l.622),
 * caption and float (l.876), unicode-math under XeTeX (l.786-794) and balance at the end of the preamble (l.125-128,
 * 3534-3546). It defines the same theorem environments (l.3452ff), acks (l.3558) and margin floats (l.943), refuses a
 * redefined `\section` the same way (l.3616-3636: titlesec) and has the same two-argument `\@starttoc` (l.484: tocloft).
 *
 * So it is class.acmart's facts with its own name, file and layout, and builds on class.acmart (as emulateapj builds on
 * class.aastex for the revtex code they share): acmart's key rules (ACM's list policy, the theorem ways' denies, the
 * class-native ways' `only`) hold for the same code. Its name is "aamas", the setting's class, the only profile of that name,
 * so it is keyed by it. The page turns two-column at `\maketitle` in sigconf, as acmart's does, so the layout has two
 * columns: keys that need one column (`classes.oneColumn`: cols.paracol, tbl.longtable) are unfit here.
 */
export default defineClass({
  ...acmart,
  id: 'class.aamas',
  name: "aamas",
  base: 'class.acmart',
  targetEngine: "untested",
  preloads: [...acmart.preloads, { pkg: "balance" }],
  // sigconf: letter paper (614.295pt) with 54pt inner and outer margins and a 2pc column gap (l.648-654), so
  // \textwidth = 506.295pt and each column 241.1475pt; 9pt type (l.271-272).
  layout: { columns: 2, textwidth: "506.295pt", fontsize: "9pt" },
  files: [{ path: "aamas.cls", sha256: "e88c8e3e5fd1e39f93a2a4fa5b664e125b67487996b4236668206acf5c70ca7e" }],
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/aamas.cls', line: '40 (\\ProvidesClass{aamas}), 288 (amsart), 306 (natbib), 528 (hyperref), 594 (xcolor), 622 (geometry), 876 (caption, float)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/aamas.cls', line: '271-272, 648-654 (sigconf 9pt, geometry)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/aamas.cls', line: '484 (\\@starttoc#1#2), 3616-3636 (\\section redefinition errors)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/aamas.cls', line: '125-128, 3534-3546 (balance)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/aamas.json', line: '1' },
    ...acmart.evidence,
  ],
});
