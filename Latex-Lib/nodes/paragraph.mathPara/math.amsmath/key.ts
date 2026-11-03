import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'math.amsmath',
    node: 'paragraph/mathPara',
    description:
      "One line of display maths, in amsmath's split or gathered when its data.latexStyle asks, with its \\label.",
    ctan: ['amsmath'],
    features: ['aligned'],
    presets: PRESETS,
    loads: [
      { pkg: 'amsmath' },
    ],
    zerotex: 'yes',
  }),
);
