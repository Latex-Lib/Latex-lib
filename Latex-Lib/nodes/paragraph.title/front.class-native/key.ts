import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.class-native',
    node: 'paragraph/title',
    description:
      "The class's own title block: \\title, \\author, \\date and \\maketitle as the class lays them out (acmart, llncs and IEEEtran restyle \\maketitle themselves). 393 templates.",
    ctan: ['latex-base'],
    features: ['class-styled'],
    presets: PRESETS,
    requires: [
      'cmd:\\maketitle',
    ],
    zerotex: 'untested',
  }),
);
