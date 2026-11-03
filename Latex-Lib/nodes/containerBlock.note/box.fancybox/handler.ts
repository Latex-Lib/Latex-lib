/**
 * box.fancybox: the note in a paragraph box inside a frame. fancybox's
 * \shadowbox, \doublebox, \ovalbox and \Ovalbox (\shadowsize, \cornersize),
 * or the kernel's \fbox and xcolor's \colorbox and \fcolorbox; \fboxsep and
 * \fboxrule for every one. None breaks across pages.
 * CTAN: https://ctan.org/pkg/fancybox (section 1, Fancy frames)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { colorFor, titled, toneDefinition } from '../node.ts';
import key from './key.ts';

export const FANCY = ['shadowbox', 'doublebox', 'ovalbox', 'Ovalbox'];

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const frame = param(p, 'frame', 'shadowbox');
  const colored = frame === 'colorbox' || frame === 'fcolorbox';
  const lengths = [
    ...(param(p, 'sep') === '' ? [] : [`\\setlength{\\fboxsep}{${param(p, 'sep')}}`]),
    ...(param(p, 'rule') === '' ? [] : [`\\setlength{\\fboxrule}{${param(p, 'rule')}}`]),
    ...(frame === 'shadowbox' && param(p, 'shadowSize') !== '' ? [`\\setlength{\\shadowsize}{${param(p, 'shadowSize')}}`] : []),
    ...(frame.toLowerCase() === 'ovalbox' && param(p, 'cornerSize') !== '' ? [`\\cornersize*{${param(p, 'cornerSize')}}`] : []),
  ];
  return {
    preamble: (_params, _parentType, node) => {
      const tone = colored ? toneDefinition([param(p, 'background'), param(p, 'frameColor')], node) : [];
      const packages = [...(FANCY.includes(frame) ? ['\\usepackage{fancybox}'] : []), ...(colored ? ['\\usepackage{xcolor}'] : [])];
      const declarations = [...lengths, ...tone];
      return { ...(packages.length === 0 ? {} : { packages }), ...(declarations.length === 0 ? {} : { declarations }) };
    },
    emit: (node, content) => {
      const inner = `\\parbox{${param(p, 'width', '0.9\\linewidth')}}{${titled(node, content)}}`;
      const box =
        frame === 'colorbox' ? `\\colorbox{${colorFor(param(p, 'background', 'gray!15'), node)}}{${inner}}`
        : frame === 'fcolorbox' ? `\\fcolorbox{${colorFor(param(p, 'frameColor', 'black'), node)}}{${colorFor(param(p, 'background', 'white'), node)}}{${inner}}`
        : `\\${frame}{${inner}}`;
      return p['center'] === false ? `\\noindent${box}\n\n` : `\\begin{center}\n${box}\n\\end{center}\n\n`;
    },
  };
};

export default realize;
