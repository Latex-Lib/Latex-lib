import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'custom.raw',
    node: 'customLatex/customLatex',
    description:
      'Raw LaTeX the author wrote, inline, with its preamble line (attrs.preamble) when it has one.',
    writes: '… (the author\'s inline LaTeX, unchanged); … (attrs.preamble, unchanged)',
    ctan: ['latex-base'],
    features: [],
    presets: PRESETS,
    targetEngine: 'untested',
  }),
);
