import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'abs.tikzposter-block',
    node: 'containerBlock/abstract',
    description:
      "The abstract as a tikzposter block: \\block{Abstract}{…}, the class's titled box with the heading in its title bar, drawn in the current column (or across the poster), optionally with the title flush left (titleleft), rounded corners (roundedcorners=…) or a frame line width (linewidth=…). tikzposter has no abstract environment.",
    writes: '\\block{Abstract}{…}',
    ctan: ['tikzposter'],
    features: ['class-styled', 'title-bar'],
    params: {
      name: { type: 'string', default: 'Abstract', description: "the block's title, in its title bar" },
      titleleft: { type: 'boolean', default: false, description: "\\block's titleleft option: the title flush left in the title bar (the theme centres it)" },
      roundedcorners: { type: 'string', default: '', description: "\\block's roundedcorners= option: the radius of the block's corners, a number (16); empty for the theme's" },
      linewidth: { type: 'dimen', default: '', description: "\\block's linewidth= option: the block's frame line, a length (0pt for none: a bare 0 stops at \\block with 'Illegal unit of measure'); empty for the theme's" },
    },
    presets: PRESETS,
    // The class's \block (tikzposter.cls: \newcommand\block[3][]). Its profile does not list it yet (reported as a profile change).
    requires: ['cmd:\\block'],
    only: ['class.tikzposter'],
    // The body is \block's argument, set in a TikZ node: read as an argument (no verbatim), no float, no footnote, one box that never
    // breaks across pages (the class profile: "content sits in macro arguments, so no floats and no verbatim").
    gives: { argument: true, verbatim: false, floats: false, footnotes: false, breakable: false },
    // Typeset ok on ZeroTeX-NG (2026-11-07), both presets under tikzposter[a0paper] (the mirror's tikzposter.cls), the block inside
    // \begin{columns}\column{0.5} after front.tikzposter's \maketitle, and on its own outside the columns.
    targetEngine: 'yes',
  }),
);
