/**
 * front.center-block's presets, each from the templates that set their title by hand in a center environment.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  generic: {
    description: 'A hand-set title banner centred at the top of the first page, no \\maketitle: the title huge and bold, the authors large under it, then the affiliations, the e-mails and any extra lines.',
    features: ['centered', 'bold-head'],
    params: {},
    evidence: [
      { kind: 'source', file: `${SOURCE}/0526-a0poster/a0.tex`, line: '20-29 (\\begin{center} {\\Large a0poster}\\\\[0.5cm] … \\vspace{1cm} … authors (\\ttfamily e-mail) … \\end{center}, no \\maketitle)' },
      solution('0526-a0poster', '45-47'),
    ],
  },
  a0poster: {
    description: "A poster's banner under a0poster: the title in a0poster's \\veryHuge bold, the authors \\huge, the affiliations \\Large, the e-mails in typewriter, 1cm and 2ex apart.",
    writes: '\\begin{center} {\\veryHuge\\bfseries …\\par} \\vspace{1cm} {\\huge … , …\\par} \\vspace{2ex} {\\Large \\textsuperscript{n}…\\par} {\\normalsize\\ttfamily …\\par} \\end{center}',
    features: ['centered', 'bold-head'],
    params: { titleFont: '\\veryHuge\\bfseries', authorFont: '\\huge', affilFont: '\\Large', titleGap: '1cm', authorGap: '2ex' },
    evidence: [
      { kind: 'source', file: `${SOURCE}/0496-flowfram/samples/sample-poster.tex`, line: '3, 48-56 (\\documentclass[a0]{a0poster}; \\begin{center} \\bfseries\\veryHuge title \\vskip1cm \\huge author \\vskip2ex \\normalsize \\url{…} \\end{center}, no \\maketitle)' },
      { kind: 'source', file: `${SOURCE}/0526-a0poster/a0poster.cls`, line: '158-170 (\\tiny … \\Huge redefined; \\veryHuge, \\VeryHuge, \\VERYHuge new, 74.3pt to 107pt)' },
    ],
  },
  ctex: {
    description: "A Chinese homework or report head under a ctex class: the title in \\zihao{1} bold, the subtitle \\large, then the authors and the course and student lines in the body size, 5pt apart.",
    writes: '\\begin{center} {\\zihao{1}\\bfseries …\\par} \\vspace{5pt} {\\large …\\par} \\vspace{5pt} {… , …\\par} \\vspace{5pt} {… \\quad …\\par} \\end{center}',
    features: ['centered', 'bold-head'],
    params: { titleFont: '\\zihao{1}\\bfseries', authorFont: '', affilFont: '', emailFont: '\\ttfamily', titleGap: '5pt', authorGap: '5pt' },
    evidence: [
      { kind: 'source', file: `${SOURCE}/0958-ecnu-homework/main.tex`, line: '34-40 (\\begin{center} {\\zihao{1}\\color{ecnu}\\bfseries title\\par} \\vspace{5pt} {\\large subtitle\\par} \\vspace{5pt} {course\\quad name\\quad student number\\par} \\end{center})' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
