import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'math.kernel',
    node: 'inlineMath/inlineMath',
    description:
      'Inline maths: $…$ or \\( … \\), with a \\label after it when the node has one.',
    ctan: ['latex-base'],
    features: [],
    params: {
      delimiters: { type: 'enum', values: ['dollar', 'paren'], default: 'dollar', description: "dollar signs, or the kernel's \\( \\)" },
    },
    presets: PRESETS,
    zerotex: 'untested',
  }),
);
