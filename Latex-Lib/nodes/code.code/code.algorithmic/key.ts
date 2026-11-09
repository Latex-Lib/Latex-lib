import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'code.algorithmic',
    node: 'code/code',
    description:
      "Pseudo-code in the algorithms bundle (algorithm.sty and algorithmic.sty): the code block as a ruled 'Algorithm n' float, \\begin{algorithm}[tb] \\caption{…} \\label{…} \\begin{algorithmic}[1] \\STATE … \\end{algorithmic} \\end{algorithm}, as the ICML, IJCAI and AAAI templates write it. Each line is one \\STATE; a line given as escaped LaTeX prints as written, so \\FOR{…}, \\IF{…}, \\ELSE, \\ENDIF, \\WHILE{…} and \\REPEAT … \\UNTIL{…} keep the structure. Line numbers ([1]) optional.",
    writes: '\\begin{algorithm}[tb] \\caption{…} \\label{…} \\begin{algorithmic} \\STATE … \\end{algorithmic} \\end{algorithm}',
    ctan: ['algorithms'],
    features: ['floating', 'captioned', 'ruled', 'line-numbers', 'escape-latex'],
    params: {
      lineNumbers: { type: 'boolean', default: false, description: 'every line numbered (\\begin{algorithmic}[1])' },
      placement: { type: 'string', default: 'tb', description: "the float's placement ([tb]); '' gives none (the float's default, htbp)" },
      // ICML's style loads both itself (icml2026.sty l.121-122): false prints no \usepackage and needs the class's environments.
      loadPackages: { type: 'boolean', default: true, compat: true, description: "the way loads algorithm and algorithmic itself; false relies on the class's (icml2026.sty)" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'algorithm', when: { loadPackages: true } },
      { pkg: 'algorithmic', when: { loadPackages: true } },
    ],
    // With the packages loaded by the way, the environments come with them; without, the class must define them (class.icml does,
    // through its preloads: icml.ts env:algorithm, env:algorithmic).
    requiresWhen: [{ when: { loadPackages: false }, requires: ['env:algorithm', 'env:algorithmic'] }],
    // A float (float.sty's \newfloat{algorithm}, algorithm.sty l.62-74): it needs a place that takes floats, not a box or an argument.
    needs: { floats: true, argument: false },
    // Typeset ok on ZeroTeX-NG (2026-11-07, Latex-Lib builder probe): icml under article with \usepackage[accepted]{icml2025} (the
    // ICML 2025 kit's icml2025.sty, algorithm.sty, algorithmic.sty; the profile pins icml2026.sty, not in this checkout), with no
    // \usepackage of the way's; ijcai ([1], two floats, one empty: a lone \STATE) under article with ijcai26.sty and hyperref,
    // the way's two \usepackage lines printed; \ref to each label resolved.
    targetEngine: 'yes',
  }),
);
