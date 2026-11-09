/**
 * note.class-margin's presets, each from the templates and class sources that use it.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'tufte-marginnote': {
    description: "Tufte's unnumbered margin note, \\marginnote{…}, in the class's small ragged margin type beside its line, the title in bold.",
    writes: '\\marginnote{{\\bfseries …\\par} …}',
    features: ['margin-note', 'class-styled'],
    params: {},
    evidence: [
      solution('0793-xtufte', '23'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0793-xtufte/doc/sample-book.tex', line: '523 (\\marginnote{…})' },
    ],
  },
  'tufte-sidenote': {
    description: "Tufte's numbered side note, \\sidenote{…}, numbered with the footnotes, its mark in the text and the note in the margin.",
    writes: '\\sidenote{{\\bfseries …\\par} …}',
    features: ['margin-note', 'class-styled', 'numbered', 'superscript'],
    params: { form: 'sidenote' },
    evidence: [
      solution('0793-xtufte', '65'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0825-tufte-essay/main.tex', line: '23, 41, 83 (\\sidenote{…})' },
    ],
  },
  'koma-marginline': {
    description: "KOMA-Script's margin note, \\marginline{…}: a \\marginpar set ragged right in the right margin and ragged left in the left one, the title in bold.",
    writes: '\\marginline{{\\bfseries …\\par} …}',
    features: ['margin-note', 'class-styled'],
    params: { form: 'marginline' },
    evidence: [
      solution('0020-koma-script', '35, 72'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0020-koma-script/doc/common-marginpar-de.tex', line: '59-76' },
    ],
  },
  'jlreq-sidenote': {
    description: "jlreq's numbered side note, \\sidenote{…}, sharing the footnote counter, its mark in the text in the footnote's style (needs the class option sidenote_length).",
    writes: '\\sidenote{{\\bfseries …\\par} …}',
    features: ['margin-note', 'class-styled', 'numbered'],
    params: { form: 'jlreq' },
    evidence: [solution('0529-jlreq', '24'), { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0529-jlreq/README.md', line: '36-40' }],
  },
} as const satisfies { readonly [name: string]: Preset };
