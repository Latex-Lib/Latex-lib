import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'head.ieee-raise',
    node: 'paragraph/heading',
    description:
      "IEEEtran's Computer Society journal form ([journal,compsoc]) of the first section: its heading raised into the space under the title area with \\IEEEraisesectionheading{\\section{…}\\label{…}}, as IEEE's compsoc sample writes the Introduction; every later heading the class's own \\section, \\subsection... with its \\label.",
    // The emit writes each \section as \LatexLibRaiseFirstSection{\section{…}\label{…}}, which is \IEEEraisesectionheading{…} on
    // its first use and the bare heading after (handler.ts): the skeleton below is what it typesets as.
    writes: '\\IEEEraisesectionheading{\\section{…}\\label{…}} … \\section[…]{…} \\label{…}',
    ctan: ['ieeetran'],
    features: ['class-styled', 'numbered', 'sans-serif', 'hang-head'],
    presets: PRESETS,
    // \IEEEraisesectionheading is IEEEtran.cls l.5527 (V1.8a, every format); class.ieeetran's defines, which compsoc copies, lack it yet.
    requires: [
      'counter:{kind}',
      'cmd:\\IEEEraisesectionheading',
    ],
    only: ['class.ieeetran-compsoc'],
    // As head.class-native: below cols.vwcol a heading comes out at the full text width.
    needs: { paragraph: true },
    // Typeset ok on ZeroTeX-NG (2026-11-07) under [journal,compsoc]{IEEEtran}: \maketitle with \IEEEtitleabstractindextext, the
    // first \section raised and labelled, a \subsection and \subsubsection, then two \section headings printed plain. As in the
    // class, the paragraph after the raised heading is indented (\@afterheading's \@nobreaktrue stays inside the \parbox); the
    // compsoc sample opens it with \IEEEPARstart.
    targetEngine: 'yes',
  }),
);
