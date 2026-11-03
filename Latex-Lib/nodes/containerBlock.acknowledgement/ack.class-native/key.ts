import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'ack.class-native',
    node: 'containerBlock/acknowledgement',
    description:
      "The class's own acknowledgements environment, acmart's \\begin{acks} … \\end{acks}.",
    ctan: ['acmart'],
    features: ['class-styled'],
    presets: PRESETS,
    requires: [
      'env:acks',
    ],
    only: ['class.acmart'],
    zerotex: 'untested',
  }),
);
