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
    zerotex: 'untested',
  }),
);
