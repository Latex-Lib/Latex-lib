import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'code.minted',
    node: 'code/code',
    description:
      'minted: \\begin{minted}{python} … \\end{minted}, highlighted by Pygments; \\usemintedstyle{…} and \\setminted{frame, fontsize, linenos, breaklines, bgcolor, autogobble, tabsize}. Needs shell escape and Python, which the target engine does not have. 37 templates.',
    writes: '\\begin{minted}{…} … \\end{minted} \\begin{center}…\\end{center}; \\setminted{…}',
    ctan: ['minted'],
    features: ['syntax-highlighting', 'line-numbers', 'framed', 'background', 'colored', 'external-tool'],
    params: {
      style: { type: 'enum', values: ['default', 'colorful', 'lovelace', 'autumn', 'friendly', 'tango', 'manni', 'monokai', 'emacs', 'vs', 'xcode', 'bw'], default: 'default', description: 'the Pygments style (\\usemintedstyle)' },
      frame: { type: 'enum', values: ['none', 'single', 'lines', 'leftline', 'topline', 'bottomline'], default: 'none', description: 'a frame (frame=)' },
      fontsize: { type: 'tex', default: '', description: "the code's size (fontsize=); ''" },
      linenos: { type: 'boolean', default: false, description: 'line numbers (linenos)' },
      breaklines: { type: 'boolean', default: true, description: 'long lines broken (breaklines)' },
      background: { type: 'color', default: '', description: "a background colour (bgcolor=); ''" },
      autogobble: { type: 'boolean', default: false, description: 'common leading spaces removed (autogobble)' },
      tabsize: { type: 'number', default: 8, description: "a tab's width (tabsize=)" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'minted' },
      { pkg: 'xcolor' },
    ],
    deny: [
      { class: 'class.tikzposter', reason: "a poster's content sits in \\block{title}{content}, a macro argument, where verbatim text cannot go", evidence: [{ kind: 'solution', file: 'Solution/0436-jacobs-landscape-poster.md', lines: 'class' }] },
    ],
    // Read verbatim: not where its body is read as an argument (code.listings' key says where).
    needs: { verbatim: true, argument: false },
    targetEngine: 'no',
  }),
);
