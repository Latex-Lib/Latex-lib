/**
 * ack.copernicus's presets: Copernicus' statements and acknowledgements after the text and the appendices.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source/0195-copernicus';

export const PRESETS = {
  copernicus: {
    description:
      "Copernicus' back matter: \\begin{acknowledgements} … \\end{acknowledgements}, or the statement command the title names (\\authorcontribution{…}, \\competinginterests{…} …), or \\specialsection{title}{…}, each a small run-in block with an italic label, after \\noappendix has closed the appendix.",
    features: ['class-styled', 'unnumbered', 'run-in-head', 'small-type'],
    params: {},
    evidence: [
      solution('0195-copernicus', '55-56, 59'),
      { kind: 'source', file: `${SOURCE}/template.tex`, line: '135, 160-172, 181, 199-207' },
      { kind: 'source', file: `${SOURCE}/copernicus.cls`, line: '1410-1433 (statement names), 1745-1750 (\\theolds, \\appendix), 1833-1842 (\\noappendix), 2823-2874 (\\generateCommand, statement commands, \\ifx\\thesection\\theolds\\else\\noappendix\\fi, \\specialsection), 2876-2883 (acknowledgements)' },
      {
        kind: 'compile',
        reproducer:
          "ZeroTeX-NG (XeTeX), class-examples/typeset-dir.ts, 2026-11-07, on a scratch copy of the research's copernicus.cls 10.1.35 (not the pinned 10.1.34) patched as the pinned copy is (\\cop@pdfoutput 1, no \\pdfpageattr, neither inputenc nor ucharacters): \\documentclass[acp,manuscript]{copernicus}, \\appendix and a section, then \\authorcontribution, \\financialsupport with a \\label, \\specialsection and acknowledgements with a \\label, each after the guard: ok, 1 page. The guard left secnumdepth at 3 outside the appendix and set it to 0 (\\noappendix) inside it",
      },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
