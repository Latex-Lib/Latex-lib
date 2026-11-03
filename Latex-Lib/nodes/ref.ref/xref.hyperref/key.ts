import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'xref.hyperref',
    node: 'ref/ref',
    description:
      'hyperref: \\autoref{label} names and links the target (Figure 2); \\nameref{label} for its title; \\hyperref[label]{text} when the node gives its own name. 137 templates.',
    ctan: ['hyperref'],
    features: ['named-refs', 'linked'],
    params: {
      command: { type: 'enum', values: ['autoref', 'nameref', 'ref'], default: 'autoref', description: 'the reference command' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'hyperref' },
    ],
    zerotex: 'yes',
  }),
);
