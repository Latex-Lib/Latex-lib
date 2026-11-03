import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fig.wrapfig',
    node: 'atomicBlock/image',
    description:
      'wrapfig: the text wraps round the image, \\begin{wrapfigure}[lines]{placement}[overhang]{width} … \\end{wrapfigure}; placement r, l, i or o (upper case lets it float). Not in lists, columns or boxes. 43 templates.',
    ctan: ['wrapfig'],
    features: ['wrapped', 'captioned', 'scaled'],
    params: {
      side: { type: 'enum', values: ['r', 'l', 'i', 'o', 'R', 'L', 'I', 'O'], default: 'r', description: 'right, left, inner or outer edge; upper case may float to a later paragraph' },
      width: { type: 'string', default: '0.45\\linewidth', description: "the wrapped column's width" },
      lines: { type: 'number', default: 0, description: 'the number of narrowed lines; 0 lets wrapfig count' },
      overhang: { type: 'dimen', default: '', description: "how far it reaches into the margin; ''" },
      raise: { type: 'dimen', default: '', description: "pulls the image up against the text above (\\vspace{-…}); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'graphicx' },
      { pkg: 'wrapfig' },
    ],
    requires: [
      'env:figure',
    ],
    deny: [
      { class: 'class.beamer', reason: "beamer's figure is a centre environment placed where it starts; there is no paragraph to wrap round it", evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '85' }] },
    ],
    needs: { paragraph: true, columns: false },
    zerotex: 'untested',
  }),
);
