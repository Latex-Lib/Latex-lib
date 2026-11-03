import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'code.listings',
    node: 'code/code',
    description:
      'listings: \\begin{lstlisting}[style=lib, language=Python, caption={…}, label=…] … \\end{lstlisting}, its look in one \\lstdefinestyle (basicstyle, keywordstyle, commentstyle, stringstyle, numbers, frame, backgroundcolor, breaklines, columns, tabsize, captionpos); escaped LaTeX between (*@ and @*). 157 templates.',
    ctan: ['listings'],
    features: ['syntax-highlighting', 'line-numbers', 'framed', 'background', 'colored', 'escape-latex', 'captioned'],
    params: {
      font: { type: 'tex', default: '\\ttfamily\\small', description: "the code's font (basicstyle)" },
      keywordStyle: { type: 'tex', default: '\\bfseries', description: 'keywords (keywordstyle)' },
      commentStyle: { type: 'tex', default: '\\itshape', description: 'comments (commentstyle)' },
      stringStyle: { type: 'tex', default: '', description: "strings (stringstyle); ''" },
      numbers: { type: 'enum', values: ['none', 'left', 'right'], default: 'none', description: 'line numbers (numbers)' },
      numberStyle: { type: 'tex', default: '\\tiny', description: "the line numbers' style (numberstyle)" },
      frame: { type: 'enum', values: ['none', 'single', 'lines', 'tb', 'leftline'], default: 'none', description: 'a frame (frame)' },
      background: { type: 'color', default: '', description: "a background colour (backgroundcolor); ''" },
      breaklines: { type: 'boolean', default: true, description: 'long lines broken (breaklines)' },
      columns: { type: 'enum', values: ['fixed', 'flexible', 'fullflexible'], default: 'fixed', description: 'character spacing (columns)' },
      tabsize: { type: 'number', default: 8, description: "a tab's width in spaces (tabsize)" },
      captionPos: { type: 'enum', values: ['t', 'b'], default: 't', description: 'the caption above or below (captionpos)' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'listings' },
      { pkg: 'xcolor' },
    ],
    deny: [
      { class: 'class.tikzposter', reason: "a poster's content sits in \\block{title}{content}, a macro argument, where verbatim text cannot go", evidence: [{ kind: 'solution', file: 'Solution/0436-jacobs-landscape-poster.md', lines: 'class' }] },
    ],
    // Read verbatim: not where its body is read as an argument (a table cell, tabularx's or tblr's body, a tabbing field, the
    // class-native abstract's \abstract{…}). General's code survives a cell only in its captured form (code.ts), which a library
    // handler does not have.
    needs: { verbatim: true, argument: false },
    zerotex: 'yes',
  }),
);
