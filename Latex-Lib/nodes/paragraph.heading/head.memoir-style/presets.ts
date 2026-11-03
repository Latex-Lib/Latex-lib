/**
 * head.memoir-style's presets, each from the templates that use it (`node seed.ts head --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  ell: {
    description: "memoir's ell chapter style (\\chapterstyle{ell}): the number in the margin beside a rule, the title ragged; sections as memoir sets them.",
    features: ['chapter-opening', 'ruled', 'numbered'],
    params: { chapterStyle: 'ell' },
    evidence: [solution('0201-nova-thesis-starter', '86')],
  },
  veelo: {
    description: "memoir's veelo chapter style: a large number in a black block at the outer edge, the title flush right.",
    features: ['chapter-opening', 'flush-right', 'numbered'],
    params: { chapterStyle: 'veelo' },
    evidence: [solution('0587-c-i-p-h-e-r-phinished', '41'), solution('0764-abntex2', '79')],
  },
  'madsen-colored': {
    description: "memoir's madsen chapter style with the title font redefined, \\renewcommand{\\chaptitlefont}{\\normalfont\\Huge\\bfseries\\color{…}}.",
    features: ['chapter-opening', 'ruled', 'colored', 'bold-head', 'numbered'],
    params: { chapterStyle: 'madsen', font: '\\normalfont\\bfseries', scale: 'kernel', color: 'blue!50!black' },
    evidence: [solution('0901-makyo-building-a-book', '45')],
  },
  'sans-sections': {
    description: 'Sans-serif bold section heads one size up, ragged right (\\setsecheadstyle{\\huge\\sffamily\\raggedright}, \\setsubsecheadstyle{\\LARGE…}), the default chapter style.',
    features: ['sans-serif', 'bold-head', 'numbered'],
    params: { font: '\\sffamily\\bfseries\\raggedright', scale: 'larger' },
    evidence: [solution('0740-gandalfsaxe-laursens-xelatex-thesis-temp', '88'), solution('0512-formation-latex-ul', '76')],
  },
  tight: {
    description: 'No space before or after section heads (\\setbeforesecskip{0pc}, \\setaftersecskip{0pc}), numbered to the subsection.',
    features: ['compact-spacing', 'bold-head', 'numbered'],
    params: { beforeSkip: '0pc', afterSkip: '0pc', numberDepth: 'subsection' },
    evidence: [solution('0510-uspatent', '48'), solution('0003-ucsmonograph', '66')],
  },
  pedersen: {
    description: "memoir's pedersen chapter style: the title in italics with the number in a large coloured block at the right; sections hang their numbers in the margin (\\hangsecnum).",
    features: ['chapter-opening', 'italic-head', 'hang-head', 'numbered'],
    params: { chapterStyle: 'pedersen', hangNumbers: true },
    evidence: [solution('0185-memhfixc', '55')],
  },
} as const satisfies { readonly [name: string]: Preset };
