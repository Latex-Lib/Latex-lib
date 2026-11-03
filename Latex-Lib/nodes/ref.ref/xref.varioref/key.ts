import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'xref.varioref',
    node: 'ref/ref',
    description:
      'varioref: \\vref{label}, the number with its page when it is elsewhere (2 on the next page), or \\vpageref{label} for the page alone. 12 templates.',
    ctan: ['varioref'],
    features: ['page-refs'],
    params: {
      command: { type: 'enum', values: ['vref', 'vpageref'], default: 'vref', description: 'the reference command' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'varioref' },
    ],
    zerotex: 'untested',
  }),
);
