/**
 * ack.kernel's presets, from the templates whose acknowledgements are an
 * unnumbered heading (`node seed.ts head --rows`, `node seed.ts front --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  section: {
    description: 'Acknowledgements as an unnumbered section, \\section*{Acknowledgements}, then the text.',
    features: ['unnumbered'],
    params: {},
    evidence: [solution('0012-basic-academic-journal-article', '71')],
  },
  'chapter-in-contents': {
    description: 'An unnumbered chapter that still reaches the contents (\\chapter*{Acknowledgements}, \\addcontentsline{toc}{chapter}{…}), as theses put it in the front matter.',
    writes: '\\chapter*{Acknowledgements} \\addcontentsline{toc}{chapter}{Acknowledgements} …',
    features: ['unnumbered', 'in-contents'],
    params: { level: 'chapter', inContents: true },
    evidence: [solution('0180-simple-thesis-dissertation', '60'), solution('0006-gsemthesis', '51')],
  },
  chapter: {
    description: 'An unnumbered chapter, \\chapter*{…}, kept out of the contents.',
    writes: '\\chapter*{Acknowledgements} …',
    features: ['unnumbered'],
    params: { level: 'chapter' },
    evidence: [solution('0201-nova-thesis-starter', '82')],
  },
  subsubsection: {
    description: 'An unnumbered third-level heading, \\subsubsection*{Acknowledgements}, then the text, as AISTATS asks for the acknowledgements before the references.',
    writes: '\\subsubsection*{Acknowledgements} …',
    features: ['unnumbered'],
    params: { level: 'subsubsection' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0794-aistats/sample_paper.tex', line: '280-282' },
      solution('0794-aistats', '56'),
      { kind: 'requirement', file: 'Template/template-requirement/AISTATS.md', line: '46' },
    ],
  },
  'subsubsection-acknowledgments': {
    description: "An unnumbered third-level heading spelt the American way, \\subsubsection*{Acknowledgments}, then the text: ICLR's 'Use unnumbered third level headings for the acknowledgments', and TMLR's and COLM's kits.",
    writes: '\\subsubsection*{Acknowledgments} …',
    features: ['unnumbered'],
    params: { level: 'subsubsection', title: 'Acknowledgments' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0596-iclr/iclr2026_conference.tex', line: '397-403' },
      { kind: 'requirement', file: 'Template/template-requirement/TMLR.md', line: '56-58, 85' },
    ],
  },
  paragraph: {
    description: 'A run-in paragraph heading, \\paragraph{Acknowledgements}, the text following on the same line.',
    writes: '\\paragraph{Acknowledgements} …',
    features: ['unnumbered', 'run-in-head'],
    params: { level: 'paragraph', starred: false },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0398-simple-article/main.tex', line: '143' }, solution('0398-simple-article', '53')],
  },
} as const satisfies { readonly [name: string]: Preset };
