import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'code.verbatim',
    node: 'code/code',
    description:
      "Verbatim code: the kernel's verbatim environment; fancyvrb's \\begin{Verbatim}[frame=…, numbers=…, fontsize=…, xleftmargin=…]; or alltt, where LaTeX commands still work so escapes print as LaTeX. 276 templates.",
    writes: '\\begin{verbatim} … \\end{verbatim} \\begin{center}…\\end{center}',
    ctan: ['latex-base', 'fancyvrb', 'alltt'],
    features: ['framed', 'line-numbers', 'ruled', 'indented', 'escape-latex', 'captioned'],
    params: {
      package: { type: 'enum', values: ['kernel', 'fancyvrb', 'alltt'], default: 'kernel', compat: true, description: "the environment: verbatim, fancyvrb's Verbatim, or alltt" },
      frame: { type: 'enum', values: ['none', 'single', 'lines', 'leftline', 'topline', 'bottomline'], default: 'none', description: 'fancyvrb: a frame (frame=)' },
      numbers: { type: 'enum', values: ['none', 'left', 'right'], default: 'none', description: 'fancyvrb: line numbers (numbers=)' },
      fontsize: { type: 'tex', default: '', description: "fancyvrb: the size (fontsize=); ''" },
      indent: { type: 'dimen', default: '', description: "fancyvrb: the left indent (xleftmargin=); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'fancyvrb', when: { package: 'fancyvrb' } },
      { pkg: 'alltt', when: { package: 'alltt' } },
    ],
    deny: [
      { class: 'class.tikzposter', reason: "a poster's content sits in \\block{title}{content}, a macro argument, where verbatim text cannot go", evidence: [{ kind: 'solution', file: 'Solution/0436-jacobs-landscape-poster.md', lines: 'class' }] },
    ],
    // Read verbatim: not where its body is read as an argument (code.listings' key says where).
    needs: { verbatim: true, argument: false },
    targetEngine: 'untested',
  }),
);
