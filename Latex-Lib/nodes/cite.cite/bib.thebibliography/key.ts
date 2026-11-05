import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.thebibliography',
    node: 'cite/cite',
    description:
      "The kernel's \\cite{key} against the hand-written list.",
    ctan: ['latex-base'],
    features: ['numeric-citations', 'hand-written'],
    params: {
      command: { type: 'enum', values: ['cite'], default: 'cite', description: 'the citation command' },
    },
    presets: PRESETS,
    // b28 (batch 2, round 2, GitHub run b27-39fa711): the classes whose \cite does not read a hand-written list.
    deny: [
      {
        class: 'class.elegantpaper',
        reason: "elegantpaper loads biblatex itself (elegantpaper.cls l.195-198), and biblatex's \\cite looks its keys up in biblatex's own data, never in the \\bibcite entries a hand-written \\bibitem writes to the .aux: every citation stays undefined ('Citation ... undefined'). The list itself (refContainer bib.thebibliography) still prints and keeps its 6 passing branches",
        evidence: [
          { kind: 'source', file: 'elegantpaper.cls (elegantpaper 2026/2/27 v0.12, MiKTeX snapshot 9766)', line: '195-198' },
          { kind: 'compile', cell: 'GitHub run b27-39fa711, elegantpaper.A: 199 of 204 not-denied branches fail, 193 at an undefined citation (document d1e34f2ae7d864c1f6e9f); no other cite way has an undefined citation there' },
        ],
      },
    ],
    zerotex: 'untested',
  }),
);
