import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'xref.kernel',
    node: 'ref/ref',
    description:
      "The kernel's \\ref{label}, the number only, after its name when the node gives one (Figure~\\ref{…}). 392 templates.",
    ctan: ['latex-base'],
    features: ['named-refs'],
    params: {
      name: { type: 'boolean', default: true, description: "the node's name before the number, tied to it" },
    },
    presets: PRESETS,
    zerotex: 'untested',
  }),
);
