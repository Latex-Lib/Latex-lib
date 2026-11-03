import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'box.mdframed',
    node: 'containerBlock/note',
    description:
      'mdframed: the note in a frame that splits across pages, \\begin{mdframed}[frametitle={Note}, linecolor=…, backgroundcolor=…] … \\end{mdframed}; frametitlerule, frametitlebackgroundcolor, a left line only (hidealllines, leftline), fontcolor, nobreak; roundcorner and shadow with framemethod=TikZ. 56 templates.',
    ctan: ['mdframed'],
    features: ['framed', 'background', 'title-bar', 'rounded-corners', 'left-rule', 'breakable', 'shadow', 'colored'],
    params: {
      method: { type: 'enum', values: ['default', 'tikz'], default: 'default', compat: true, description: 'how frames are drawn: TeX rules, or TikZ (round corners and shadows); the package option framemethod' },
      title: { type: 'boolean', default: true, description: "the note's title in bold above its text (or as the box's title)" },
      lineColor: { type: 'color', default: '', description: "the line colour (linecolor=); ''; an xcolor colour; 'tone' stands for the note's tone colour (info blue, tip green, warning amber), also inside an expression (tone!10!white)" },
      backgroundColor: { type: 'color', default: '', description: "the back colour (backgroundcolor=); ''; an xcolor colour; 'tone' stands for the note's tone colour (info blue, tip green, warning amber), also inside an expression (tone!10!white)" },
      fontColor: { type: 'color', default: '', description: "the text colour (fontcolor=); ''; an xcolor colour; 'tone' stands for the note's tone colour (info blue, tip green, warning amber), also inside an expression (tone!10!white)" },
      lineWidth: { type: 'dimen', default: '', description: "the line's width (linewidth=); ''" },
      lines: { type: 'enum', values: ['all', 'left', 'none'], default: 'all', description: 'the lines drawn: all four, the left one only, or none' },
      titleRule: { type: 'boolean', default: false, description: 'a rule under the title (frametitlerule)' },
      titleBackground: { type: 'color', default: '', description: "the title band's colour (frametitlebackgroundcolor=); ''; an xcolor colour; 'tone' stands for the note's tone colour (info blue, tip green, warning amber), also inside an expression (tone!10!white)" },
      roundCorner: { type: 'dimen', default: '', description: "TikZ: the corners' radius (roundcorner=); ''" },
      shadow: { type: 'boolean', default: false, description: "TikZ: a drop shadow (shadow=true; TikZ's shadows library)" },
      breakable: { type: 'boolean', default: true, compat: true, description: 'the frame splits across pages; false keeps it on one page (nobreak=true)' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'mdframed', when: { method: 'default' } },
      { pkg: 'mdframed', options: ['framemethod=tikz'], when: { method: 'tikz' } },
      { pkg: 'xcolor' },
    ],
    gives: { floats: false, boxDepth: 1 },
    givesWhen: [
      { when: { breakable: false }, gives: { breakable: false } },
    ],
    // A frame as wide as \linewidth: below cols.vwcol, which fits only paragraph lines to its columns, it comes out 172.7
    // or 345.4pt over (copy batch-3b, oracle 4: 1 of 90 fit article.A branches with it below vwcol pass, report.A 1 of 93,
    // amsart.A 0 of 90; e.g. df73e4eb6224476778361 result 42098f42f8 l.62, 172.7pt).
    needs: { paragraph: true },
    zerotex: 'untested',
  }),
);
