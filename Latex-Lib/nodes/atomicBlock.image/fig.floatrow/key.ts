import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fig.floatrow',
    node: 'atomicBlock/image',
    description:
      "A caption beside the image: sidecap's \\begin{SCfigure}[factor] … \\end{SCfigure} (leftcaption, rightcaption, outercaption, innercaption; the caption's width as a factor of the image's; \\sidecaptionvpos), or floatrow's \\fcapside under \\floatsetup[figure]{capposition=beside,capbesideposition=…}. sidecap's image is at most half the line wide, so the caption keeps the other half less the separation. floatrow sets \\textwidth to \\columnwidth inside every figure and table, and LaTeX can ship a page from there, so with floatrow \\@outputdblcol builds a two-column page with the widths around the float. 11 templates.",
    writes: '\\begin{SCfigure}[…][…] \\centering \\includegraphics[width=…]{…} \\caption{…} \\label{…} \\end{SCfigure}',
    ctan: ['sidecap', 'floatrow'],
    features: ['side-caption', 'floating', 'captioned', 'scaled'],
    params: {
      engine: { type: 'enum', values: ['sidecap', 'floatrow'], default: 'sidecap', compat: true, description: "sidecap's SCfigure, or floatrow's \\fcapside" },
      position: { type: 'enum', values: ['outer', 'inner', 'left', 'right'], default: 'outer', description: 'which side the caption goes' },
      vpos: { type: 'enum', values: ['t', 'c', 'b'], default: 'b', description: 'the caption at the top, centre or bottom of the image' },
      relWidth: { type: 'number', default: 1, description: "sidecap: the caption's width as a factor of the image's, SCfigure's first optional argument (1 = as wide); sidecap cuts it to what the line leaves, so a large factor gives the caption the rest" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'graphicx' },
      { pkg: 'sidecap', when: { engine: 'sidecap', position: 'outer' } },
      { pkg: 'sidecap', options: ['innercaption'], when: { engine: 'sidecap', position: 'inner' } },
      { pkg: 'sidecap', options: ['leftcaption'], when: { engine: 'sidecap', position: 'left' } },
      { pkg: 'sidecap', options: ['rightcaption'], when: { engine: 'sidecap', position: 'right' } },
      { pkg: 'floatrow', when: { engine: 'floatrow' } },
    ],
    requires: [
      'env:figure',
    ],
    deny: [
      { class: 'class.beamer', reason: 'beamer ignores float placement; figure is a centre environment', evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '85' }] },
    ],
    // A figure float in every preset (SCfigure, or figure with \fcapside), so it needs a place that takes floats: "Not in outer par mode"
    // in a box (c609cddf12, article.A run: General's tcolorbox statement > fig.floatrow@sidecap-left, l.422; 04b32896a8: note.marginpar >
    // list > fig.floatrow@floatrow-top-left, l.288). A member with no file prints nothing (the host skips it).
    needs: { floats: true },
    targetEngine: 'untested',
  }),
);
