import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'math.amsmath',
    node: 'paragraph/mathPara',
    description:
      "One line of display maths, in amsmath's split or gathered when its data.latexStyle asks, with its \\label.",
    writes: '\\begin{split} … \\end{split} \\label{…}, \\begin{gathered} … \\end{gathered} \\label{…}',
    ctan: ['amsmath'],
    features: ['aligned'],
    presets: PRESETS,
    loads: [
      { pkg: 'amsmath' },
    ],
    targetEngine: 'yes',
  }),
);
