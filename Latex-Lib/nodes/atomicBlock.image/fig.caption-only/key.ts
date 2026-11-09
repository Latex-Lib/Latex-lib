import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fig.caption-only',
    node: 'atomicBlock/image',
    description:
      "PLOS's captioned figure with no graphic: \\begin{figure}[!h] \\caption{…} \\label{…} \\end{figure}, the figure's legend in the manuscript and its file uploaded apart, so no \\includegraphics is written and the image's file and width are not printed.",
    writes: '\\begin{figure}[!h] \\caption{…} \\label{…} \\end{figure}',
    ctan: ['latex-base'],
    features: ['floating', 'captioned', 'class-styled'],
    params: {
      placement: { type: 'string', default: '!h', description: "the float's placement letters (PLOS's template writes !h); a node marked fixed uses h!" },
    },
    presets: PRESETS,
    loads: [],
    requires: [
      'env:figure',
    ],
    only: ['class.plos'],
    // A figure float, so it needs a place that takes floats.
    needs: { floats: true },
    targetEngine: 'yes',
  }),
);
