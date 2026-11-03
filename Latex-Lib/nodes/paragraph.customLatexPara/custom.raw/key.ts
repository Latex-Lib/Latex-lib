import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'custom.raw',
    node: 'paragraph/customLatexPara',
    description:
      'One line of raw LaTeX inside a raw block.',
    ctan: ['latex-base'],
    features: [],
    presets: PRESETS,
    zerotex: 'untested',
  }),
);
