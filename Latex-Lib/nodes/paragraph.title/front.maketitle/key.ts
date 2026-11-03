import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.maketitle',
    node: 'paragraph/title',
    description:
      'The kernel title block: \\title{…}, \\author{…} (several joined by \\and) and \\date{…} just before \\maketitle, where the title stands; \\date{} for no date line. 440 templates.',
    ctan: ['latex-base'],
    features: ['centered'],
    params: {
      date: { type: 'enum', values: ['given', 'today', 'none'], default: 'given', description: "the date line: the node's date (the kernel prints today's when there is none), \\today explicitly, or none (\\date{})" },
    },
    presets: PRESETS,
    requires: [
      'cmd:\\maketitle',
    ],
    zerotex: 'untested',
  }),
);
