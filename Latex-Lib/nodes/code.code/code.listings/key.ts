import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'code.listings',
    node: 'code/code',
    description:
      'listings: \\begin{lstlisting}[style=lib, language=Python, caption={…}, label=…] … \\end{lstlisting}, its look in one \\lstdefinestyle (basicstyle, keywordstyle, commentstyle, stringstyle, numbers, frame, backgroundcolor, breaklines, columns, tabsize, captionpos); escaped LaTeX between (*@ and @*). Or (style none, LIPIcs only) the class keeps its own \\lstset look: no \\lstdefinestyle, no style= key, no \\usepackage{listings}. 157 templates.',
    writes: '\\begin{lstlisting}[style=lib, language=…, escapeinside={(*@}{@*)}, caption={…}, label=…] … (*@…@*) … \\end{lstlisting}; \\lstdefinestyle{lib}{…}',
    ctan: ['listings'],
    features: ['syntax-highlighting', 'line-numbers', 'framed', 'background', 'colored', 'escape-latex', 'captioned', 'class-styled'],
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
      // 'none' (lipics): the class's own \lstset stays the look, so no \lstdefinestyle, no style= key and no \usepackage{listings}
      // (the class preloads it); every look parameter above is then unused.
      style: { type: 'enum', values: ['lib', 'none'], default: 'lib', compat: true, description: "the look: the way's \\lstdefinestyle{lib} from the parameters above, or none, keeping the class's own \\lstset (lipics)" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'listings', when: { style: 'lib' } },
      { pkg: 'xcolor', when: { style: 'lib' } },
    ],
    // With no style of its own the way loads nothing: the class must have loaded listings (lipics-v2021 does, its profile's preloads).
    requiresWhen: [{ when: { style: 'none' }, requires: ['pkg:listings'] }],
    onlyWhen: [
      {
        when: { style: 'none' },
        classes: ['class.lipics'],
        reason:
          "the class's own listing look is kept only where the class loads listings and sets it, and asks that it not be overridden: LIPIcs preloads listings with its small monospaced light-grey default and its checklist protects that styling; elsewhere listings' bare defaults print (or listings is not loaded at all)",
        evidence: [
          { kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '73-75' },
          { kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '105' },
          { kind: 'source', file: 'template-lib-based-automation/Latex-Lib/classes/lipics.ts', line: '20 (preloads listings)' },
        ],
      },
    ],
    deny: [
      { class: 'class.tikzposter', reason: "a poster's content sits in \\block{title}{content}, a macro argument, where verbatim text cannot go", evidence: [{ kind: 'solution', file: 'Solution/0436-jacobs-landscape-poster.md', lines: 'class' }] },
    ],
    // Read verbatim: not where its body is read as an argument (a table cell, tabularx's or tblr's body, a tabbing field, the
    // class-native abstract's \abstract{…}). General's code survives a cell only in its captured form (code.ts), which a library
    // handler does not have.
    needs: { verbatim: true, argument: false },
    // The lipics preset (style none) is not typeset under lipics: lipics-v2021.cls was not found by this checkout's engine (the
    // class setting carries no files). Its body, a bare lstlisting with no style= key under a preloaded listings and an \lstset,
    // typeset ok under article (2026-11-07, Latex-Lib builder probe).
    targetEngine: 'yes',
  }),
);
