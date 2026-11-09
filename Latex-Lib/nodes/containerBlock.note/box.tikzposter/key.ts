import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'box.tikzposter',
    node: 'containerBlock/note',
    description:
      "tikzposter's own boxes for a note, drawn by the poster's theme: a poster block \\block[titleleft, roundedcorners=…]{title}{…}, a titled \\innerblock[…]{title}{…} inside a block, an untitled \\coloredbox[bgcolor=…, fgcolor=…]{…} inside a block, or tikzposter's callout \\note[width=…, targetoffsetx=…, targetoffsety=…, rotate=…]{…} pinned to the block before it.",
    writes: '\\block[…]{…}{…} | \\innerblock[…]{…}{…} | \\coloredbox[…]{…} | \\note[…]{…}',
    ctan: ['tikzposter'],
    features: ['class-styled', 'title-bar', 'framed', 'background', 'rounded-corners', 'colored', 'connector-line'],
    params: {
      form: {
        type: 'enum',
        values: ['block', 'innerblock', 'coloredbox', 'callout'],
        default: 'block',
        compat: true,
        description: "the box: a poster block, an inner block (inside a block), a coloured box (inside a block, untitled), or tikzposter's \\note callout pinned to the block before it",
      },
      title: { type: 'boolean', default: true, description: "the note's title: the block's or inner block's title, or a bold first line in a coloured box or a callout" },
      titleAlign: { type: 'enum', values: ['theme', 'left', 'center', 'right'], default: 'theme', description: "a block's or inner block's title placement (titleleft, titlecenter, titleright); theme keeps the block style's" },
      roundedCorners: { type: 'string', default: '', description: "roundedcorners=, the corners' radius as a number (tikzposter's unit, 16 in Simple poster); '' keeps the style's" },
      lineWidth: { type: 'dimen', default: '', description: "linewidth=, the frame's width (a block, inner block or coloured box); ''" },
      bodyWidthScale: { type: 'string', default: '', description: "bodywidthscale=, a block's or inner block's body width as a fraction of its own (0.6); ''" },
      bgColor: { type: 'color', default: '', description: "a coloured box's back (bgcolor=); ''; an xcolor colour or expression; 'tone' stands for the note's tone colour (tone!15)" },
      fgColor: { type: 'color', default: '', description: "a coloured box's text colour (fgcolor=); ''; 'tone' stands for the note's tone colour" },
      width: { type: 'dimen', default: '', description: "a callout's width (width=); ''" },
      targetOffsetX: { type: 'dimen', default: '', description: "a callout's horizontal offset from the block it points at (targetoffsetx=); ''" },
      targetOffsetY: { type: 'dimen', default: '', description: "a callout's vertical offset from the block it points at (targetoffsety=); ''" },
      rotate: { type: 'string', default: '', description: "a callout's rotation in degrees (rotate=); ''" },
    },
    presets: PRESETS,
    // tikzposter loads xcolor itself (its profile's preloads); the tone's colour is defined with \definecolor, the box's
    // colours with \colorlet, and no package is printed.
    loads: [],
    requires: ['cmd:\\block'],
    requiresWhen: [
      { when: { form: 'innerblock' }, requires: ['cmd:\\innerblock'] },
      { when: { form: 'coloredbox' }, requires: ['cmd:\\coloredbox'] },
      { when: { form: 'callout' }, requires: ['cmd:\\note'] },
    ],
    only: ['class.tikzposter'],
    // The content is a macro argument set in a TikZ node (the class profile: "content sits in macro arguments, so no floats and
    // no verbatim"), as cols.tikzposter's columns give: no verbatim, no float, no footnote, no break.
    gives: { argument: true, verbatim: false, floats: false, footnotes: false, breakable: false, boxDepth: 1 },
    // Typeset ok under tikzposter (ZeroTeX-NG, 2026-11-07): every preset, at the top level and in a cols.tikzposter column, with
    // each option the params give (titleleft, titlecenter, roundedcorners, linewidth, bodywidthscale, bgcolor, fgcolor, width,
    // targetoffsetx, targetoffsety, rotate).
    targetEngine: 'yes',
  }),
);
