import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'num.handset',
    node: 'containerBlock/appendix',
    description:
      'Appendices under the minimal class, which has no \\appendix and no sectioning: each a hand-set bold heading lettered by a library counter, \\refstepcounter{LatexLibAppendix}\\bigskip \\noindent{\\large\\bfseries Appendix A\\quad Title}\\par \\medskip, then the text; a label refers to the letter.',
    writes: '\\refstepcounter{LatexLibAppendix}\\bigskip \\noindent{\\large\\bfseries Appendix \\theLatexLibAppendix\\quad …}\\par \\label{…} \\medskip …',
    ctan: ['latex-base'],
    features: ['bold-head', 'lettered', 'appendix-prefix'],
    params: {
      name: { type: 'tex', default: 'Appendix', description: 'the word before each letter (LaTeX); the minimal class has no \\appendixname' },
    },
    presets: PRESETS,
    // The library's own counter, lettered A, B …, and \large as the template provides it (main.tex l.48): the minimal class
    // defines no size command but \normalsize (its profile defines nothing), so the way provides \large itself, as ack.block's
    // hand-set form does, and needs nothing of the class. \bigskip, \medskip, \bfseries, \refstepcounter and \Alph are the
    // kernel's.
    defines: ['cmd:\\large', 'counter:LatexLibAppendix'],
    only: ['class.minimal'],
    // Typeset ok on ZeroTeX-NG (2026-11-07) under minimal, two appendices and a \ref to the second, with and without hyperref.
    targetEngine: 'yes',
  }),
);
