import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'abs.kernel',
    node: 'containerBlock/abstract',
    description:
      "The class's abstract environment: \\begin{abstract} … \\end{abstract} (article, report and most journal classes; not book); \\abstractname renamed, the first-line indent dropped. 155 templates.",
    ctan: ['latex-base'],
    features: ['small-type', 'indented', 'centered'],
    params: {
      name: { type: 'string', default: '', description: "the heading (\\renewcommand{\\abstractname}{…}); ''" },
      noindent: { type: 'boolean', default: false, description: 'no first-line indent (\\noindent, \\parindent 0pt)' },
    },
    presets: PRESETS,
    requires: [
      'env:abstract',
    ],
    zerotex: 'untested',
  }),
);
