import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fig.float',
    node: 'atomicBlock/image',
    description:
      "float's [H]: the figure exactly where it is written, \\begin{figure}[H] … \\end{figure}; \\floatstyle{plain|plaintop|boxed|ruled} with \\restylefloat{figure} for the float's look. 88 templates.",
    writes: '\\begin{figure}[H] \\centering \\includegraphics[width=…]{…} \\caption{…} \\label{…} \\end{figure}',
    ctan: ['float'],
    features: ['here', 'centered', 'captioned', 'scaled', 'ruled', 'framed'],
    params: {
      style: { type: 'enum', values: ['plain', 'plaintop', 'boxed', 'ruled'], default: 'plain', description: "the float style (\\floatstyle); plain leaves the kernel's figure" },
      unit: { type: 'enum', values: ['linewidth', 'textwidth', 'columnwidth'], default: 'linewidth', description: "the length the node's width fraction is of" },
      center: { type: 'boolean', default: true, description: 'the image centred (\\centering)' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'graphicx' },
      { pkg: 'float' },
    ],
    requires: [
      'env:figure',
    ],
    deny: [
      {
        class: 'class.beamer',
        reason: "beamer's figure is no float: \\restylefloat{figure} (style ruled or boxed) makes it a float.sty float, which reads \\ftype@figure and float boxes beamer never sets up, so every \\begin{figure} of the document stopped at 'Missing number, treated as zero' and \\end{figure} at 'Undefined control sequence' (\\float@makebox); beamer's figure takes [H] and ignores it, so plain stays",
        evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/results/0759a3180ae9 (the copy\'s beamer.A run, document dbae85c04e7e414e00dfb, fig.float@boxed: l.283 \\begin{figure}[htbp] stops at \\ftype@figure; all 24 beamer.A documents whose image branches fail on it hold @ruled or @boxed)' }],
        unless: { style: 'plain' },
      },
    ],
    conflicts: [
      {
        way: 'fig.wrapfig',
        reason: "\\restylefloat{figure} (ruled, boxed) sends every figure \\caption to float.sty's \\float@caption, which needs \\@fs@capt, set only inside float.sty's own figure: a wrapfigure's caption stopped at 'Undefined control sequence' (\\@fs@capt). A way conflict holds for every preset, so plain is filed apart too",
        evidence: [{ kind: 'compile', cell: "testing-pipeline/out/results/5365589562cc (the copy's article.A run, document d3781496631b0ee7d1070: fig.wrapfig@left l.199-209, @right l.214; the same document in 14 pairs, 42 fit branches in index5)" }],
      },
      {
        way: 'fig.rotating',
        reason: "the same for a sidewaysfigure's caption (\\float@caption, \\@fs@capt undefined)",
        evidence: [{ kind: 'compile', cell: "testing-pipeline/out/results/5365589562cc (the copy's article.A run, document d3781496631b0ee7d1070: fig.rotating@sideways l.327, l.333)" }],
      },
      {
        way: 'fig.floatrow',
        reason: "the same for sidecap's SCfigure (fig.floatrow's sidecap presets), whose \\caption reaches float.sty's \\float@caption outside float.sty's figure: 'Undefined control sequence' in \\float@caption (\\@fs@capt); its floatrow presets load floatrow, which refuses float anyway",
        evidence: [{ kind: 'compile', cell: "run 41584963423 (GitHub, batch 1): book.A document d7a86ad42781a7f8f0544, result a3a4ce9a3b, l.151 \\end{SCfigure}, after fig.float@ruled's \\floatstyle{ruled}\\restylefloat{figure}; fig.floatrow@sidecap-outer in 14 pairs, 14 branches" }],
      },
    ],
    targetEngine: 'yes',
  }),
);
