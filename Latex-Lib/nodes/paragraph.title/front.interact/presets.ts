/**
 * front.interact's presets, from Taylor & Francis' Interact sample (interactapasample.tex) and its Solution file.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SAMPLE = 'Latex Related Research/Latex-lib-main/Source/0207-tandf-interact/interactapasample.tex';

export const PRESETS = {
  interact: {
    description:
      "The Interact title block: \\articletype, \\title, one \\author{\\name{…}\\affil{…}} with affiliation letters and the corresponding author's CONTACT \\thanks, \\received, \\maketitle, then the keywords and code environments.",
    features: ['class-styled'],
    params: { anonymous: false },
    evidence: [solution('0207-tandf-interact', '24, 43-46'), { kind: 'source', file: SAMPLE, line: '39-56' }],
  },
  anonymous: {
    description: "The Interact title block for double-blind review: \\maketitle between \\title and \\author, so the authors' names and affiliations are not printed.",
    writes: '\\articletype{…} \\title{…} \\received{…} \\maketitle \\author{\\name{…} \\affil{…}} \\begin{keywords} …; … \\end{keywords}',
    features: ['class-styled'],
    params: { anonymous: true },
    evidence: [{ kind: 'source', file: SAMPLE, line: '105-106 (\\maketitle between \\title and \\author for an anonymous version)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
