import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'custom.raw',
    node: 'paragraph/customLatexPara',
    description:
      'One line of raw LaTeX inside a raw block.',
    writes: '… (one line of the author\'s LaTeX, unchanged)',
    ctan: ['latex-base'],
    features: [],
    presets: PRESETS,
    targetEngine: 'untested',
  }),
);
