import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'math.kernel',
    node: 'containerBlock/blockMath',
    description:
      'Display maths without amsmath: \\[ … \\] for one unnumbered row, equation for a numbered one, eqnarray for several; \\counterwithin{equation}{section} for numbers within a section. 194 templates.',
    ctan: ['latex-base'],
    features: ['numbered', 'unnumbered', 'numbered-within', 'aligned', 'multiline'],
    params: {
      numberWithin: { type: 'enum', values: ['none', 'section', 'chapter'], default: 'none', description: 'equations numbered within this level (\\counterwithin)' },
    },
    presets: PRESETS,
    gives: { math: true },
    zerotex: 'untested',
  }),
);
