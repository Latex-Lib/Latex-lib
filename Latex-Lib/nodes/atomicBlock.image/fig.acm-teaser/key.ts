import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fig.acm-teaser',
    node: 'atomicBlock/image',
    description:
      "acmart's teaser figure: \\begin{teaserfigure}\\includegraphics[width=\\textwidth]{…}\\caption{…}\\Description{…}\\label{…}\\end{teaserfigure}, the image across the page between the authors and the abstract. The class stores it and prints it from \\maketitle, so it is written before \\maketitle (acmart and the classes built on it: acmsmall, acmtog, sigplan, AAMAS).",
    writes: '\\begin{teaserfigure} \\includegraphics[width=\\textwidth]{…} \\caption{…} \\Description{…} \\label{…} \\end{teaserfigure}',
    ctan: ['acmart'],
    features: ['captioned', 'full-width', 'class-styled'],
    params: {
      scaled: { type: 'boolean', default: false, description: "the node's width fraction of \\textwidth, centred; false sets it at the full text width, as ACM's samples do" },
      describe: { type: 'boolean', default: true, description: "\\Description{…} after the caption: the node's data.description, else the caption" },
    },
    presets: PRESETS,
    loads: [{ pkg: 'graphicx' }],
    // teaserfigure collects its body (\Collect@Body\@saveteaser, acmart.dtx l.6450-6458) into \@teaserfigures, which only
    // \maketitle's \@mkteasers prints (l.6623, 7710-7721): written after \maketitle it is on no page, so the class holds it for
    // \maketitle (the profile's heldByMaketitle, before), and a title way that owns maketitle must run after it. The front ways
    // write \maketitle where the title node stands, so the image node must come before the title node in the document.
    requires: ['env:teaserfigure'],
    requiresWhen: [{ when: { describe: true }, requires: ['cmd:\\Description'] }],
    only: ['class.acmart', 'class.acmart-acmsmall', 'class.acmart-acmtog', 'class.acmart-sigplan', 'class.aamas'],
    // The body is read as an argument (\Collect@Body) and set later inside \maketitle's title box; like a figure, it stands
    // where floats may (a front-matter part, written in the document body, not in a box).
    needs: { floats: true },
    // Typeset on ZeroTeX-NG under acmart sigconf (both presets, before \maketitle, no 'image without description' warning;
    // this builder's case, 2026-11-07); aamas.cls has no setting with files here, so AAMAS is read from its source only.
    targetEngine: 'yes',
  }),
);

