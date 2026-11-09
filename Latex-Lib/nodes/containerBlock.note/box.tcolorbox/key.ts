import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'box.tcolorbox',
    node: 'containerBlock/note',
    description:
      'tcolorbox: the note as a box in the text, \\begin{tcolorbox}[title={Note}, colback=…, colframe=…] … \\end{tcolorbox}; fonttitle, arc, boxrule, sharp corners, a left bar (leftrule), a filled panel, the breakable library to split across pages and skins for drop shadow; as wide as the line it starts on (\\linewidth or its width, less a paragraph \\leftskip). 101 templates.',
    writes: '\\begin{tcolorbox}[title={…}, …] … \\end{tcolorbox}',
    ctan: ['tcolorbox'],
    features: ['framed', 'background', 'title-bar', 'rounded-corners', 'left-rule', 'breakable', 'shadow', 'colored'],
    params: {
      style: { type: 'enum', values: ['framed', 'left-bar', 'filled'], default: 'framed', description: 'a frame all round, a bar at the left only, or a filled panel with its frame in the back colour' },
      title: { type: 'boolean', default: true, description: "the note's title in bold above its text (or as the box's title)" },
      colback: { type: 'color', default: '', description: "the back colour (colback=); '' keeps tcolorbox's; an xcolor colour; 'tone' stands for the note's tone colour (info blue, tip green, warning amber), also inside an expression (tone!10!white)" },
      colframe: { type: 'color', default: '', description: "the frame and title-bar colour (colframe=); ''; an xcolor colour; 'tone' stands for the note's tone colour (info blue, tip green, warning amber), also inside an expression (tone!10!white)" },
      coltitle: { type: 'color', default: '', description: "the title's colour (coltitle=); ''" },
      titleFont: { type: 'tex', default: '', description: "the title's font (fonttitle=); ''" },
      boxrule: { type: 'dimen', default: '', description: "the frame's thickness (boxrule=); ''" },
      barWidth: { type: 'dimen', default: '3pt', description: "left-bar style: the bar's width (leftrule=)" },
      corners: { type: 'enum', values: ['rounded', 'sharp'], default: 'rounded', description: 'rounded corners (arc=) or sharp corners' },
      arc: { type: 'dimen', default: '', description: "the corners' radius (arc=); ''" },
      shadow: { type: 'boolean', default: false, description: 'a drop shadow (enhanced, drop shadow; the skins library)' },
      breakable: { type: 'boolean', default: false, compat: true, description: 'the box breaks across pages (the breakable library)' },
      width: { type: 'string', default: '', description: "the box's width (width=0.9\\linewidth); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'tcolorbox' },
      { pkg: 'tcolorbox', libraries: ['breakable'], when: { breakable: true } },
      { pkg: 'tcolorbox', libraries: ['skins'], when: { shadow: true } },
      { pkg: 'xcolor' },
    ],
    gives: { floats: false, boxDepth: 1 },
    givesWhen: [
      { when: { breakable: false }, gives: { breakable: false } },
    ],
    // A box as wide as \linewidth (or its width param): below cols.vwcol, which fits only paragraph lines to its columns,
    // it comes out 172.7 or 345.4pt over (copy batch-3b, oracle 4: 0 of 60 fit article.A branches with it below vwcol
    // pass, report.A 0 of 62, amsart.A 0 of 60; e.g. d9df9f18b47c9149aacd3 result 857359f33c l.287, 172.7pt).
    needs: { paragraph: true },
    targetEngine: 'yes',
  }),
);
