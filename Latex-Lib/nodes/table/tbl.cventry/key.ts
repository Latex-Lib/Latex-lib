import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.cventry',
    node: 'table',
    description:
      "moderncv's CV entries from a table's rows: each body row one entry command with its cells as the arguments, the command picked by the column count (\\cvlistitem, \\cvitem, \\cvitemwithcomment, \\cvdoubleitem, \\cventry with years, title, institution, city, grade and the last cell as the description) or fixed (\\cvtripleitem; the skill matrix's \\cvskillhead and \\cvskillentry with a 0-5 rating); header rows dropped, no float, tabular or caption. moderncv only.",
    writes: '\\cvlistitem{…} \\cvitem{…}{…} \\cvitemwithcomment{…}{…}{…} \\cvdoubleitem{…}{…}{…}{…} \\cventry{…}{…}{…}{…}{…}{…}',
    ctan: ['moderncv'],
    features: ['class-styled'],
    params: {
      entry: {
        type: 'enum',
        values: ['auto', 'cventry', 'cvitem', 'cvitemwithcomment', 'cvdoubleitem', 'cvtripleitem', 'cvskillentry'],
        default: 'auto',
        description:
          "the entry command each body row becomes: auto by the column count (1 \\cvlistitem, 2 \\cvitem, 3 \\cvitemwithcomment, 4 \\cvdoubleitem, 5 or more \\cventry), or one fixed command, the cells fitted to its arguments (padded empty, extras joined into the last with \\newline{}); under cventry the last cell is the description; cvskillentry prints a header row as \\cvskillhead",
      },
      spacing: { type: 'dimen', default: '', description: "the space after each entry, the commands' optional first argument (.25em in the class's bodies); '' leaves the class's" },
      skillLegend: { type: 'boolean', default: false, description: "with cvskillentry, the legend of the five skill levels first (\\cvskilllegend*[1em]{}, template.tex:206)" },
    },
    presets: PRESETS,
    // The commands auto can print, all moderncv's own (moderncv.cls:566-592, given their bodies by the style's moderncvbody*.sty).
    requires: ['cmd:\\cventry', 'cmd:\\cvitem', 'cmd:\\cvitemwithcomment', 'cmd:\\cvdoubleitem', 'cmd:\\cvlistitem'],
    requiresWhen: [
      { when: { entry: 'cvtripleitem' }, requires: ['cmd:\\cvtripleitem'] },
      // The skill matrix comes with every moderncv body style (moderncvbodyi.sty:21 \RequirePackage[moderncvbodyi]{moderncvskillmatrix}).
      { when: { entry: 'cvskillentry' }, requires: ['cmd:\\cvskillentry', 'cmd:\\cvskillhead'] },
      { when: { entry: 'cvskillentry', skillLegend: true }, requires: ['cmd:\\cvskilllegend'] },
    ],
    only: ['class.moderncv'],
    // Each cell is an argument of a \newcommand* entry, set in a tabular p-column or a minipage (moderncvbodyi.sty:91-136): a
    // verbatim child cannot sit in it, a \footnote there loses its text, and nothing below it floats.
    gives: { floats: false, argument: true, footnotes: false },
    // Typeset ok under moderncv's six styles (classic, casual, banking, oldstyle, fancy, contemporary) with every preset over one to
    // seven columns, a spanning cell, a list and paragraphs in the description, \& and \% in cells, and spacing 1em (scratch build
    // work/tbl.cventry/<style>/main.tex). A list or a paragraph break in a cventry title, institution, city or grade cell still stops
    // under banking (tabular* l and r cells, moderncvbodyiii.sty:182-198); oldstyle's own skill legend runs 113pt past the line.
    targetEngine: 'yes',
  }),
);
