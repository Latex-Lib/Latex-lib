import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { solution } from '../../evidence.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fig.graphicx',
    node: 'atomicBlock/image',
    description:
      'graphicx in a figure float: \\begin{figure}[htbp]\\centering\\includegraphics[width=…]{file}\\caption{…}\\label{…}\\end{figure}; figure* across two columns, the caption above or below, \\graphicspath for a folder, keepaspectratio under a height limit, or the image alone in the text. Under acmart and the classes built on it (acmsmall, acmtog, sigplan, the VLDB class), \\Description{…} after the caption gives the figure the text description ACM asks of every image (describe). Under the letter class, which has no figure float or counter, the image alone in the text, centred and unlabelled. 467 templates.',
    writes: '\\begin{figure}[…] \\centering \\includegraphics[width=…]{…} \\caption{…} \\label{…} \\end{figure}',
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
      describe: { type: 'boolean', default: false, description: "acmart's \\Description{…} in the float after the caption, its text the node's data.description, else the caption (acmart and the classes built on it only)" },
      numberInline: { type: 'boolean', default: true, compat: true, description: 'alone in the text, its label numbered as a figure (\\refstepcounter{figure}\\label{…}); false drops the label, for a class with no figure counter (letter)' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'graphicx' },
    ],
    // The figure float, and the figure counter an inline image's label steps, are the class's: every class but letter has them.
    // Floating, or numbering an inline image, needs env:figure; an inline image with no label (numberInline: false) needs
    // nothing of the class, so the way runs under letter (Letter.md l.110-116: no figure environment or counter; l.196: the image
    // "emitted without a figure environment", caption and label dropped).
    requiresWhen: [
      { when: { float: true }, requires: ['env:figure'] },
      { when: { numberInline: true }, requires: ['env:figure'] },
      // acmart's \Description[short]{long} (acmart.dtx l.4134), checked at the figure's end (l.4173-4185).
      { when: { describe: true }, requires: ['cmd:\\Description'] },
    ],
    onlyWhen: [
      {
        when: { describe: true },
        classes: ['class.acmart', 'class.acmart-acmsmall', 'class.acmart-acmtog', 'class.acmart-sigplan', 'class.vldb'],
        reason:
          "\\Description is acmart's (\\newcommand\\Description[2][]{\\global\\@Description@presenttrue\\ignorespaces}, acmart.dtx l.4134): it only sets the switch the class reads at \\end{figure} to warn of an image without description (l.4179-4185); no other class defines it, so elsewhere it stops at \"Undefined control sequence\"",
        evidence: [
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0665-acmart/acmart.dtx', line: '1460-1480 (\\Description documented: in every figure, teaserfigure or marginfigure), 4134, 4173-4185' },
          solution('0665-acmart', '73'),
        ],
      },
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
    targetEngine: 'yes',
  }),
);
