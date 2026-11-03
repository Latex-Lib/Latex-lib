import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'box.fancybox',
    node: 'containerBlock/note',
    description:
      "The note in a framed paragraph box: fancybox's \\shadowbox, \\doublebox, \\ovalbox or \\Ovalbox (\\shadowsize, \\cornersize), or the kernel's \\fbox and xcolor's \\colorbox and \\fcolorbox, which the research counts with them; \\fboxsep and \\fboxrule. None breaks across pages. 165 templates.",
    ctan: ['fancybox'],
    features: ['framed', 'background', 'shadow', 'rounded-corners', 'colored', 'centered'],
    params: {
      frame: { type: 'enum', values: ['shadowbox', 'doublebox', 'ovalbox', 'Ovalbox', 'fbox', 'colorbox', 'fcolorbox'], default: 'shadowbox', description: "the frame: fancybox's four, or the kernel and xcolor boxes" },
      width: { type: 'string', default: '0.9\\linewidth', description: "the paragraph box's width" },
      center: { type: 'boolean', default: true, description: 'centred (center environment), or flush with \\noindent' },
      background: { type: 'color', default: '', description: "colorbox and fcolorbox: the back colour; an xcolor colour; 'tone' stands for the note's tone colour (info blue, tip green, warning amber), also inside an expression (tone!10!white)" },
      frameColor: { type: 'color', default: '', description: "fcolorbox: the frame colour; an xcolor colour; 'tone' stands for the note's tone colour (info blue, tip green, warning amber), also inside an expression (tone!10!white)" },
      sep: { type: 'dimen', default: '', description: "\\fboxsep, frame to text; ''" },
      rule: { type: 'dimen', default: '', description: "\\fboxrule, the frame's width; ''" },
      shadowSize: { type: 'dimen', default: '', description: "shadowbox: \\shadowsize (4pt); ''" },
      cornerSize: { type: 'dimen', default: '', description: "ovalbox and Ovalbox: the corners' diameter (\\cornersize*); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'fancybox', when: { frame: ['shadowbox', 'doublebox', 'ovalbox', 'Ovalbox'] } },
      { pkg: 'xcolor', when: { frame: ['colorbox', 'fcolorbox'] } },
    ],
    // A footnote in it is lost: the note is a \parbox (a \vbox) in the frame's \hbox, and the insert stays there (GitHub run
    // 41584963423: 0 of 92 not-denied branches with General's footnote anchor below it pass, 88 never ship the text, e.g. aa.A
    // dc33c32dbf8153dbecd7e result d96f8218ca, branch b5c7f2b2488c7acd6a1da). [OV2]
    gives: { floats: false, breakable: false, footnotes: false, boxDepth: 1 },
    zerotex: 'untested',
  }),
);
