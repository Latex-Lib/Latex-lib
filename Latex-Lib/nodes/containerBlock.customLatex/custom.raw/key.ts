import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'custom.raw',
    node: 'containerBlock/customLatex',
    description:
      'A block of raw LaTeX the author wrote, with its preamble (data.preamble) when it has one.',
    ctan: ['latex-base'],
    features: [],
    presets: PRESETS,
    zerotex: 'untested',
  }),
);
