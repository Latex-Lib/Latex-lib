import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fig.graphicx',
    node: 'atomicBlock/image',
    description:
      'graphicx in a figure float: \\begin{figure}[htbp]\\centering\\includegraphics[width=…]{file}\\caption{…}\\label{…}\\end{figure}; figure* across two columns, the caption above or below, \\graphicspath for a folder, keepaspectratio under a height limit, or the image alone in the text. 467 templates.',
    ctan: ['graphics', 'latex-base'],
    features: ['floating', 'centered', 'captioned', 'scaled', 'full-width'],
    params: {
      placement: { type: 'string', default: 'htbp', description: "the float's placement letters (h, t, b, p, !); a node marked fixed uses h! (H with fig.float)" },
      unit: { type: 'enum', values: ['linewidth', 'textwidth', 'columnwidth'], default: 'linewidth', description: "the length the node's width fraction is of" },
      center: { type: 'boolean', default: true, description: 'the image centred (\\centering)' },
      captionAbove: { type: 'boolean', default: false, description: 'the caption above the image' },
      span: { type: 'boolean', default: false, description: 'figure* across both columns of a two-column page' },
      float: { type: 'boolean', default: true, compat: true, description: 'in a figure float; false sets the image in the text, uncaptioned' },
      maxHeight: { type: 'dimen', default: '', description: "a height the image must not exceed (height=…,keepaspectratio); ''" },
      graphicsPath: { type: 'string', default: '', description: "a folder images are looked up in (\\graphicspath); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'graphicx' },
    ],
    requires: [
      'env:figure',
    ],
    deny: [
      {
        class: 'class.beamer',
        reason: 'beamer has no figure*: "Environment figure* undefined", then "\\begin{document} ended by \\end{figure*}"',
        evidence: [{ kind: 'compile', cell: "testing-pipeline/out/results/8d9bfda92def (the copy's beamer.A run, document ddac9eb0ab723e907531d, fig.graphicx@wide: l.1485, l.1528; 5 beamer.A documents)" }],
        unless: { span: false },
      },
    ],
    // In a figure float unless float: false, and there it needs a place that takes floats: "Not in outer par mode" in a box (c609cddf12,
    // article.A run: General's tcolorbox statement > fig.graphicx@wide, l.432); @inline fails 0 of 497 directly under that statement.
    needsWhen: [{ when: { float: true }, needs: { floats: true } }],
    zerotex: 'yes',
  }),
);
