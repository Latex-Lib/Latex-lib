/**
 * ack.llncs-credits's presets: LNCS's credits environment, under llncs and under ECCV's style on it.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source/0712-llncs';

export const PRESETS = {
  llncs: {
    description:
      "LNCS's credits at the end of the paper: \\begin{credits}, then \\subsubsection{\\ackname} (or \\discintname for the disclosure of interests) as a small bold run-in head, the text in small type, \\end{credits}.",
    features: ['class-styled', 'run-in-head', 'bold-head', 'small-type'],
    params: {},
    evidence: [
      solution('0712-llncs', '51'),
      { kind: 'source', file: `${SOURCE}/llncs.cls`, line: '81 (\\ackname), 91 (\\discintname), 216-228 (credits)' },
      { kind: 'source', file: `${SOURCE}/llncsdoc.tex`, line: '341-358' },
      { kind: 'source', file: `${SOURCE}/history.txt`, line: '10-17' },
      {
        kind: 'compile',
        reproducer:
          "ZeroTeX-NG (XeTeX, MiKTeX's llncs 2025/02/25 v2.26), class-examples/typeset-dir.ts, 2026-11-07: \\documentclass[runningheads]{llncs}, a title, then three credits blocks as this way prints them (\\ackname with a \\label, \\discintname, and an escaped title 'Ethics \\& approval\\_1.'): ok, 1 page",
      },
    ],
  },
  eccv: {
    description:
      "ECCV's acknowledgements, the same credits environment of the llncs class its style runs on: \\begin{credits} \\subsubsection{\\ackname} … \\end{credits}.",
    features: ['class-styled', 'run-in-head', 'bold-head', 'small-type'],
    params: {},
    evidence: [
      { kind: 'source', file: `${SOURCE}/llncs.cls`, line: '216-228' },
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/eccv.sty (commit 791fe5b)', line: '109-113 (stops unless the class is llncs)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
