import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { NUMBERING } from '../node.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'head.memoir-style',
    node: 'paragraph/heading',
    description:
      "memoir's own heading interface: \\chapterstyle{…} for chapter openings (default, section, hangnum, ell, veelo, madsen, pedersen, demo3, bianchi …), \\setsecheadstyle and its siblings with \\setbeforesecskip and \\setaftersecskip for the lower levels, \\chaptitlefont and \\parttitlefont for the top ones, \\hangsecnum, \\setsecnumdepth. memoir only. 15 templates.",
    writes: '\\section[…]{…} \\label{…}; \\chapterstyle{…} \\setsecheadstyle{…}',
    ctan: ['memoir'],
    features: ['chapter-opening', 'ruled', 'flush-right', 'colored', 'sans-serif', 'bold-head', 'italic-head', 'hang-head', 'compact-spacing', 'numbered'],
    params: {
      chapterStyle: { type: 'enum', values: ['class', 'default', 'section', 'hangnum', 'companion', 'article', 'bianchi', 'bringhurst', 'crosshead', 'dash', 'demo2', 'demo3', 'ell', 'komalike', 'madsen', 'pedersen', 'tandh', 'thatcher', 'veelo', 'wilsondob'], default: 'class', description: "memoir's chapter style (\\chapterstyle); class leaves the one memoir starts with" },
      font: { type: 'tex', default: '', description: 'family, series and shape of the level (with its size by the scale)' },
      scale: { type: 'enum', values: ['class', 'kernel', 'larger', 'smaller', 'text'], default: 'class', description: "each level's size: kernel the standard classes', larger or smaller one step, text the text size (chapters and parts stay large); class leaves the class's sizes" },
      color: { type: 'color', default: '', description: "an xcolor colour for the heading, or '' for none" },
      hangNumbers: { type: 'boolean', default: false, description: 'section numbers hang in the margin (\\hangsecnum)' },
      beforeSkip: { type: 'string', default: '', description: "space before the level's heads (\\setbeforesecskip, \\beforechapskip); '' keeps memoir's" },
      afterSkip: { type: 'string', default: '', description: "space after the level's heads (\\setaftersecskip, \\afterchapskip); '' keeps memoir's" },
      ...NUMBERING,
    },
    presets: PRESETS,
    loads: [
      { pkg: 'xcolor' },
      // veelo and pedersen size the chapter number with \resizebox (memoir.dtx: "requires the graphicx package").
      { pkg: 'graphicx', when: { chapterStyle: ['veelo', 'pedersen'] } },
    ],
    requires: [
      'counter:{kind}',
    ],
    only: ['class.memoir'],
    // Below cols.vwcol a heading comes out at the full text width (172.7pt over in a 0.5 column): 0 of 561 library headings there pass but
    // head.sectsty@smallcaps's \subparagraph (55 of 59), run-in titles that never print (their footnote sibling's sentinel is missing).
    // Copy batch-3b, 5 pairs; e.g. d165d94f2adcdc3093699 result 82adbd1a35 l.150, an unmarked \section* 172.7pt over.
    needs: { paragraph: true },
    targetEngine: 'untested',
  }),
);
