import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'code.tcblisting',
    node: 'code/code',
    description:
      "tcolorbox's listings library: the code in a box, \\begin{tcblisting}{listing only, title={…}, colback, colframe, left, width, listing options={language=…, basicstyle=…, numbers=…}} … \\end{tcblisting}; breakable through the breakable library. 20 templates.",
    writes: '\\begin{tcblisting}{listing only, code={\\LatexLibHeadOwnLine}, title={…}, …, listing options={basicstyle=…, language=…}} … \\end{tcblisting}',
    ctan: ['tcolorbox'],
    features: ['syntax-highlighting', 'framed', 'background', 'title-bar', 'line-numbers', 'breakable', 'colored', 'captioned'],
    params: {
      font: { type: 'tex', default: '\\ttfamily\\small', description: "the code's font (listing options: basicstyle)" },
      numbers: { type: 'enum', values: ['none', 'left', 'right'], default: 'none', description: 'line numbers (listing options: numbers)' },
      colback: { type: 'color', default: '', description: "the back colour; ''" },
      colframe: { type: 'color', default: '', description: "the frame colour; ''" },
      left: { type: 'dimen', default: '', description: "inner space at the left (left=, room for numbers); ''" },
      width: { type: 'string', default: '', description: "the box's width, centred; ''" },
      corners: { type: 'enum', values: ['rounded', 'sharp'], default: 'rounded', description: 'corners' },
      breakable: { type: 'boolean', default: false, compat: true, description: 'the box breaks across pages (the breakable library)' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'tcolorbox', libraries: ['listings'] },
      { pkg: 'tcolorbox', libraries: ['breakable'], when: { breakable: true } },
    ],
    deny: [
      { class: 'class.tikzposter', reason: "a poster's content sits in \\block{title}{content}, a macro argument, where verbatim text cannot go", evidence: [{ kind: 'solution', file: 'Solution/0436-jacobs-landscape-poster.md', lines: 'class' }] },
    ],
    givesWhen: [
      { when: { breakable: false }, gives: { breakable: false } },
    ],
    // Read verbatim: not where its body is read as an argument (code.listings' key says where).
    needs: { verbatim: true, argument: false },
    targetEngine: 'yes',
  }),
);
