import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'list.item',
    node: 'paragraph/lstParagraph',
    description:
      "A list item: the line Flouest's list ways read, \\<level>[label] text, the level from the item's indent; the list prints it as \\item[label] text.",
    ctan: ['latex-base'],
    features: [],
    presets: PRESETS,
    // An item puts its list in the place it sits: below cols.vwcol, which fits only paragraph lines to its columns, the list's
    // \@item and \@setpar replace vwcol's \everypar and \par, so its lines take the full \linewidth, as the five list ways'
    // (they need paragraph since batch 6). Its list ways are denied there already; under General's list, which prints a list
    // only around its items, 11 of 94 list.item branches below vwcol passed in run 41584963423 (each where vwcol's second
    // column came out empty or the box went to another branch), the other 83 failed, 345pt over in A (article.A
    // d4a6ab8630456acbcdcf5 result 147722ffaa l.199).
    // General's item has the same need (`GENERAL_NEEDS`). [b22 O7]
    needs: { paragraph: true },
    zerotex: 'untested',
  }),
);
