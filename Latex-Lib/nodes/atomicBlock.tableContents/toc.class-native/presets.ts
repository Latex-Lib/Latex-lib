/**
 * toc.class-native's presets: memoir's starred contents and its own hooks, and beamer's options.
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source';
const MEMOIR = `${SOURCE}/0185-memhfixc/memoir.dtx`;

export const PRESETS = {
  'memoir-starred': {
    description: "memoir's starred contents, \\tableofcontents*, which does not list itself; memoir's own look (bold chapter entries without leaders, dotted leaders below them).",
    features: ['class-styled', 'dot-leaders'],
    params: {},
    evidence: [
      solution('0755-ntnu-article-based-phd-thesis', '23, 57'),
      { kind: 'source', file: `${SOURCE}/0755-ntnu-article-based-phd-thesis/main.tex`, line: '54 (\\tableofcontents*)' },
      { kind: 'source', file: MEMOIR, line: '19895 (\\newlistof{tableofcontents}{toc}{\\contentsname}), 19711-19745 (the starred form adds no contents line)' },
    ],
  },
  'memoir-thesis': {
    description: "A thesis's memoir contents: bold chapter entries and page numbers with dot leaders on every level, plain section entries, the contents, the list of figures and the list of tables each starred and followed by \\clearpage.",
    writes: '\\tableofcontents* \\clearpage \\listoffigures* \\clearpage \\listoftables* \\clearpage; \\renewcommand{\\cftchapterdotsep}{\\cftdotsep} \\renewcommand{\\cftchapterfont}{…} \\renewcommand{\\cftsectionfont}{…}',
    features: ['class-styled', 'dot-leaders', 'lists-of-floats'],
    params: { leaders: 'all', chapterFont: '\\bfseries', sectionFont: '\\normalfont', lists: 'both', after: 'clearpage' },
    evidence: [
      solution('0420-lodour-wisc-thesis-template', '23, 49'),
      { kind: 'source', file: `${SOURCE}/0420-lodour-wisc-thesis-template/thesis.sty`, line: '206-247 (\\printtoctitle, \\cftchapterfont, \\cftsectionfont, \\cftsectionleader as \\cftdotfill{…}), 369-377 (contents and lists, each followed by \\clearpage; unstarred there, the tables listed before the figures)' },
    ],
  },
  'memoir-indents': {
    description: "memoir's contents with the entries' indents and number widths set per level (\\cftsetindents{section}{0em}{2.6em}, …), only sections and subsections listed (\\settocdepth{subsection}).",
    writes: '\\settocdepth{…} \\tableofcontents*; \\cftsetindents{…}{…}{…}',
    features: ['class-styled', 'dot-leaders', 'flat-contents'],
    params: { indents: 'section:0em:2.6em, subsection:2.6em:3.2em', depth: 2 },
    evidence: [
      { kind: 'source', file: MEMOIR, line: '20344 (\\cftsetindents{entry}{indent}{numwidth}), 20868-20877 (memoir\'s own: \\cftsetindents{section}{1.5em}{2.3em} …), 21338-21350 (\\settocdepth)' },
      manual('memoir', 'The Memoir Class, chapter 9 (Contents lists): \\cftsetindents and \\settocdepth'),
    ],
  },
  'beamer-hide-subsections': {
    description: "beamer's contents listing sections only, \\tableofcontents[hideallsubsections], in the frame it stands in (beamer prints no heading).",
    writes: '\\tableofcontents[hideallsubsections]',
    features: ['class-styled', 'flat-contents'],
    params: { form: 'beamer', options: 'hideallsubsections' },
    evidence: [
      { kind: 'source', file: `${SOURCE}/0974-metropolis/main.tex`, line: '21 (\\tableofcontents[hideallsubsections])' },
      { kind: 'source', file: `${SOURCE}/0132-sjtug-sjtubeamer/main.tex`, line: '183 (\\tableofcontents[hideallsubsections])' },
      solution('0132-sjtug-sjtubeamer', '30, 47'),
    ],
  },
  'beamer-outline-frame': {
    description: "beamer's contents on a frame of its own, \\begin{frame}{Outline} \\tableofcontents[sectionstyle=show,subsectionstyle=show/shaded/hide] \\end{frame}.",
    writes: '\\begin{frame}{…} \\tableofcontents[…] \\end{frame}',
    features: ['class-styled'],
    params: { form: 'beamer', options: 'sectionstyle=show,subsectionstyle=show/shaded/hide', frame: true, frameTitle: 'Outline' },
    evidence: [
      { kind: 'source', file: `${SOURCE}/0005-cococo2000-ict-beamer/main.tex`, line: '73-75 (an untitled frame holding \\tableofcontents[sectionstyle=show,subsectionstyle=show/shaded/hide,subsubsectionstyle=show/shaded/hide])' },
      { kind: 'source', file: `${SOURCE}/0176-presentations/beamer-demo.tex`, line: '4 (\\begin{frame}{Übersicht} \\tableofcontents[part=1,pausesections] \\end{frame})' },
      solution('0005-cococo2000-ict-beamer', '23, 50'),
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
