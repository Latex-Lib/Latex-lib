import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'tbl.tabbing',
    node: 'table',
    description:
      "The kernel's tabbing: columns at tab stops set by a first line ended with \\kill, cells separated by \\>, each field a ragged-right \\parbox[t] that wraps at its stop (a spanning cell one across its stops), no rules, no float, no caption. 3 templates.",
    ctan: ['latex-base'],
    features: ['tab-stops'],
    params: {
      firstStop: { type: 'dimen', default: '', description: "a fixed width for the first column (\\hspace*{5cm}\\=), at most 0.4\\linewidth; '' shares the line" },
    },
    presets: PRESETS,
    // Fields wrap at their stops, a robustness choice over the templates' run-on fields (owner decision O11, batch 4): a tabbing line
    // is \hbox to\linewidth{…\hss}, so a field longer than its stop ran over the next and past the line with no Overfull report
    // (article.A, oracle 4: 457 of 504 fit branches failed on a sentinel up to 1032pt right of the block, e.g. 5f08f5b4b9). A
    // \footnote in a field's \parbox loses its text (1 branch in that run).
    // Each field is a \parbox argument: no float, a footnote in it loses its text, and a verbatim child (a library code way)
    // cannot sit below it.
    gives: { floats: false, argument: true, footnotes: false },
    zerotex: 'untested',
  }),
);
