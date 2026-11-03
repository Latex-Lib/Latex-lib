import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { CONTENTS } from '../node.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'toc.kernel',
    node: 'atomicBlock/tableContents',
    description:
      "The kernel's \\tableofcontents, with \\listoffigures and \\listoftables after it when asked; \\tocdepth, \\contentsname and a break after each. 389 templates.",
    ctan: ['latex-base'],
    features: ['lists-of-floats', 'flat-contents', 'odd-page'],
    params: {
      ...CONTENTS,
    },
    presets: PRESETS,
    requires: [
      'cmd:\\tableofcontents',
    ],
    zerotex: 'untested',
  }),
);
