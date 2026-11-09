/**
 * front.elegantpaper's presets, from the class's own source and its sample papers.
 */
import type { Preset } from '../../../schema/params.ts';

const EP = 'Latex Related Research/Latex-lib-main/Source/0188-elegantpaper';

export const PRESETS = {
  elegantpaper: {
    description:
      "elegantpaper's title block: the bold \\LARGE title, the authors side by side, each with their affiliation lines and e-mail under the name, the \\institute line (or 'Corresponding author: e-mail'), the italic Version and Date lines with the class's labels, and the keywords at the abstract's end.",
    features: ['class-styled', 'centered'],
    params: {},
    evidence: [
      { kind: 'source', file: `${EP}/elegantpaper-en.tex`, line: '3-8 (\\title, \\author{Author1 \\\\ Institute1 \\and …}, \\institute{…}, \\version{0.12}, \\date{…}), 17 (\\maketitle), 21 (\\keywords{…} as the abstract\'s last line)' },
      { kind: 'source', file: `${EP}/elegantpaper.cls`, line: '101 (\\email), 249-254 (\\versiontext, \\updatetext, \\keywords), 276-277 (\\newtoks\\version, \\newtoks\\institute), 279-340 (\\maketitle, \\@maketitle)' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0200-elegantpaper-working-paper/main.tex', line: '23-28 (the same block: \\institute{Working Paper Series}, \\version{1.0}), 37 (\\keywords in the abstract)' },
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.elegantpaper/main.tex', line: '35-39 (\\institute{Corresponding author: \\email{…}}, \\version{0.1})' },
    ],
  },
  'keywords-after-title': {
    description: "elegantpaper's title block with the keywords line printed right under the title, for a paper with no abstract environment to end with it.",
    writes: '\\title{…} \\author{… \\\\ … \\\\ \\email{…} \\and …} \\institute{…} \\version{…} \\date{…} \\maketitle \\keywords{…, …}',
    features: ['class-styled', 'centered'],
    params: { keywords: 'after-title' },
    evidence: [{ kind: 'source', file: `${EP}/elegantpaper.cls`, line: '254 (\\keywords{…}: "\\vskip 2ex\\par\\noindent{\\bfseries Keywords: } #1", printed where it stands)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
