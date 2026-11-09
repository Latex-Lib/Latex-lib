/**
 * abs.heading's presets, each from the templates that write their abstract as a heading and its text, with no abstract environment.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SRC = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  section: {
    description: "The abstract as an unnumbered section, \\section*{Abstract} and its text, as PLOS's template writes it (and \\section*{Author summary} for a second abstract node with its own heading).",
    writes: '\\section*{Abstract} …',
    features: ['unnumbered', 'bold-head', 'block-head'],
    params: { form: 'kernel', level: 'section', name: 'Abstract' },
    evidence: [solution('0862-plos', '49'), { kind: 'source', file: `${SRC}/0862-plos/plos_latex_template.tex`, line: '238, 250' }],
  },
  chapter: {
    description: 'The abstract as an unnumbered chapter of a book, report or thesis, \\chapter*{Abstract} on a page of its own, not in the contents.',
    writes: '\\chapter*{Abstract} …',
    features: ['unnumbered', 'chapter-opening', 'page-break-before'],
    params: { form: 'kernel', level: 'chapter', name: 'Abstract' },
    evidence: [solution('0741-clean-thesis', '55'), { kind: 'source', file: `${SRC}/0741-clean-thesis/main.tex`, line: '82' }],
  },
  'chapter-in-contents': {
    description: 'The abstract as an unnumbered chapter listed in the table of contents, \\chapter*{Abstract} \\addcontentsline{toc}{chapter}{Abstract}.',
    writes: '\\chapter*{Abstract} \\addcontentsline{toc}{chapter}{Abstract} …',
    features: ['unnumbered', 'chapter-opening', 'page-break-before', 'in-contents'],
    params: { form: 'kernel', level: 'chapter', name: 'Abstract', inContents: true },
    evidence: [solution('0134-maehr-uzh-ma-thesis', '26')],
  },
  'chapter-zh': {
    description: 'The Chinese abstract as an unnumbered chapter, \\chapter*{摘要}, as ctexrep and ctexbook theses write it.',
    writes: '\\chapter*{摘要} …',
    features: ['unnumbered', 'chapter-opening', 'page-break-before'],
    params: { form: 'kernel', level: 'chapter', name: '摘要' },
    evidence: [solution('0578-monetjoe-latex-paper-templates', '53'), { kind: 'source', file: `${SRC}/0578-monetjoe-latex-paper-templates/finalversion.tex`, line: '115-129' }],
  },
  koma: {
    description: "The abstract as KOMA-Script's unnumbered chapter in the contents, \\addchap{Abstract} (scrbook, scrreprt).",
    writes: '\\addchap{Abstract} …',
    features: ['unnumbered', 'chapter-opening', 'page-break-before', 'in-contents', 'class-styled'],
    params: { form: 'koma', level: 'chapter', name: 'Abstract', inContents: true },
    evidence: [solution('0800-valentjn-thesis-arxiv', '75'), { kind: 'source', file: `${SRC}/0800-valentjn-thesis-arxiv/tex/document/abstract.tex`, line: '1' }],
  },
  'run-in': {
    description: 'The abstract as one small-type paragraph opening with a bold run-in label, {\\small\\noindent\\textbf{Abstract.} …\\par}, as a note or memo on the minimal class sets it.',
    writes: '{\\small\\noindent\\textbf{Abstract.} …\\par}',
    features: ['run-in-head', 'bold-head', 'small-type'],
    params: { form: 'runin', name: 'Abstract', punctuation: '.' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.minimal/main.tex', line: '136-142' }],
  },
} as const satisfies { readonly [name: string]: Preset };
