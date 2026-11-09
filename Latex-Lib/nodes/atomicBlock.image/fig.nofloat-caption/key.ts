import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fig.nofloat-caption',
    node: 'atomicBlock/image',
    description:
      "A captioned, numbered image with no float, where the class has none: tikzposter's \\begin{tikzfigure}[caption] \\includegraphics… \\end{tikzfigure} inside a block, or, under the minimal class, a centred image with a hand-numbered caption under it, {\\small Figure~\\thefigure: …}.",
    writes: '\\begin{tikzfigure}[…] \\label{…} \\includegraphics[width=…]{…} \\end{tikzfigure}',
    ctan: ['tikzposter', 'graphics'],
    features: ['centered', 'captioned', 'scaled', 'class-styled', 'small-type', 'box-safe'],
    params: {
      form: { type: 'enum', values: ['tikzfigure', 'handset'], default: 'tikzfigure', description: "tikzposter's tikzfigure, or a hand-numbered caption under a centred image (minimal)" },
      name: { type: 'string', default: 'Figure', description: "handset: the word before the number" },
      captionSize: { type: 'tex', default: '\\small', description: 'handset: the caption line\'s size command; \\small is provided where the class lacks it' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'graphicx' },
    ],
    // The handset form makes the figure counter where the class lacks it (minimal), guarded by \@ifundefined.
    defines: [{ name: 'counter:figure', when: { form: 'handset' } }],
    requiresWhen: [
      { when: { form: 'tikzfigure' }, requires: ['env:tikzfigure'] },
    ],
    only: ['class.tikzposter', 'class.minimal'],
    onlyWhen: [
      {
        when: { form: 'tikzfigure' },
        classes: ['class.tikzposter'],
        reason: "tikzfigure is tikzposter's environment; elsewhere \"Environment tikzfigure undefined\"",
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0429-ndpvt-web-latex-document-skill/assets/templates/poster.tex', line: '11, 229' }],
      },
      {
        when: { form: 'handset' },
        classes: ['class.minimal'],
        reason: 'the hand-set caption is for a class with no figure float or \\caption (minimal); a class that has them takes fig.graphicx',
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.minimal/main.tex', line: '223-227' }],
      },
    ],
    targetEngine: 'yes',
  }),
);
