import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'box.awesomebox',
    node: 'containerBlock/note',
    description:
      "awesomebox: an admonition block with a FontAwesome icon and a rule at its side; noteblock, tipblock or warningblock by the note's tone, cautionblock, importantblock, or an awesomeblock of its own (icon, colours, rule width, a title over a short or long line). Needs fontawesome5. 2 templates.",
    ctan: ['awesomebox'],
    features: ['icon', 'left-rule', 'colored', 'title-bar'],
    params: {
      block: { type: 'enum', values: ['tone', 'note', 'tip', 'warning', 'caution', 'important', 'custom'], default: 'tone', description: "the block: chosen by the note's tone, a named one, or custom (awesomeblock)" },
      icon: { type: 'tex', default: '\\faInfoCircle', description: 'custom: the FontAwesome 5 icon' },
      iconColor: { type: 'color', default: 'black', description: "custom: the icon's colour; an xcolor colour; 'tone' stands for the note's tone colour (info blue, tip green, warning amber), also inside an expression (tone!10!white)" },
      ruleColor: { type: 'color', default: 'black', description: "custom: the side rule's colour; an xcolor colour; 'tone' stands for the note's tone colour (info blue, tip green, warning amber), also inside an expression (tone!10!white)" },
      ruleWidth: { type: 'dimen', default: '2pt', description: "custom: the side rule's width" },
      hrule: { type: 'enum', values: ['none', 'short', 'long'], default: 'none', description: 'custom: a line under the title (\\abShortLine, \\abLongLine)' },
      leftMargin: { type: 'string', default: '', description: "the icon column's width (\\aweboxleftmargin; the content takes the rest); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'awesomebox' },
      { pkg: 'xcolor' },
    ],
    // A footnote in it is lost: awesomebox sets its text in a tabular p-cell (awesomebox.sty l.89-98, l.119-128), whose insert
    // stays in the tabular's box (GitHub run 41584963423: 0 of 94 not-denied branches with General's footnote anchor below it
    // pass, 90 never ship the text, e.g. aa.A d4375530296cc404593ab result d34edd6007, branch bc33630e0517c75793e58; under
    // revtex4-2-aps, whose footnotes were then bibliography notes (footinbib, until b22's nofootinbib), the text printed pages later). [OV2]
    // Since b22 the handler sets a block that holds a footnote inside footnotehyper's \savenotes … \spewnotes, what the package
    // is for (a tabular's footnotes), so the text is set after the block at the page's foot (`keepingFootnotes`), and the
    // footnote is no longer denied below it. [OV2-alt]
    // Its block is a tabular, which never breaks across pages (b23: tbl.longtable stays out of it).
    gives: { floats: false, breakable: false, boxDepth: 1 },
    // A block as wide as \linewidth: below cols.vwcol, which fits only paragraph lines to its columns, it comes out 172.7
    // or 345.4pt over (copy batch-3b, oracle 4: 0 of 30 fit article.A branches with it below vwcol pass, report.A 0 of 31,
    // amsart.A 0 of 30; e.g. d6284954b0b417341a525 result 3c462b887c l.404, 172.7pt).
    needs: { paragraph: true },
    zerotex: 'untested',
  }),
);
