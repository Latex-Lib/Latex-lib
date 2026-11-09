import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fig.adjustbox',
    node: 'atomicBlock/image',
    description:
      'adjustbox: the image sized and placed by keys, \\adjustimage{width=…,center}{file}: width, max width or scale, fbox for a frame, bgcolor for a ground; in a figure float or alone. 35 templates.',
    writes: '\\begin{figure}[…] \\adjustimage{width=…,center}{…} \\caption{…} \\label{…} \\end{figure}',
    ctan: ['adjustbox'],
    features: ['floating', 'here', 'centered', 'captioned', 'scaled', 'framed', 'background'],
    params: {
      sizing: { type: 'enum', values: ['width', 'max-width', 'scale'], default: 'width', description: "the node's width (width=), at most that (max width=), or a scale factor" },
      scale: { type: 'number', default: 1, description: 'scale: the factor' },
      frame: { type: 'string', default: '', description: "a frame (fbox=1.5pt, or rule, sep and margin); ''" },
      background: { type: 'color', default: '', description: "a ground colour (bgcolor=); ''" },
      center: { type: 'boolean', default: true, description: 'the image centred (\\centering)' },
      float: { type: 'boolean', default: true, compat: true, description: 'in a figure float; false sets it in the text, uncaptioned' },
      placement: { type: 'string', default: 'htbp', description: "the float's placement letters (h, t, b, p, !); a node marked fixed uses h! (H with fig.float)" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'adjustbox' },
      { pkg: 'xcolor' },
    ],
    requires: [
      'env:figure',
    ],
    // In a figure float unless float: false, and there it needs a place that takes floats: "Not in outer par mode" in columns cut from a
    // box (b9890eec60, article.A run: cols.vwcol@equal > General's amsthm statement > fig.adjustbox@max-width, l.312); @on-white fails
    // 0 of 497 directly under General's tcolorbox statement.
    needsWhen: [{ when: { float: true }, needs: { floats: true } }],
    targetEngine: 'yes',
  }),
);
