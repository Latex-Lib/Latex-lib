import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'math.kernel',
    node: 'paragraph/mathPara',
    description:
      'One line of display maths as written, with its \\label.',
    ctan: ['latex-base'],
    features: [],
    presets: PRESETS,
    zerotex: 'untested',
  }),
);
