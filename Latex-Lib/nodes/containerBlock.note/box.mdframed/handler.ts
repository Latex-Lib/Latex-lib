/**
 * box.mdframed: \begin{mdframed}[keys] … \end{mdframed}, a frame that
 * splits across pages. linecolor, backgroundcolor, linewidth, fontcolor,
 * frametitle with frametitlerule and frametitlebackgroundcolor, the lines
 * shown (hidealllines, leftline), nobreak; roundcorner and shadow with
 * framemethod=TikZ (shadows with TikZ's shadows library).
 * CTAN: https://ctan.org/pkg/mdframed (sections 3, 4 and 6)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { colorFor, titleOf, toneDefinition } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const tikz = param(p, 'method', 'default') === 'tikz';
  const colors = [param(p, 'lineColor'), param(p, 'backgroundColor'), param(p, 'fontColor'), param(p, 'titleBackground')];
  return {
    preamble: (_params, _parentType, node) => {
      const tone = toneDefinition(colors, node);
      // A TikZ shadow needs TikZ's shadows library, which the user loads (manual, 6.5).
      const declarations = [...(tikz && p['shadow'] === true ? ['\\usetikzlibrary{shadows}'] : []), ...tone];
      return {
        packages: [tikz ? '\\usepackage[framemethod=tikz]{mdframed}' : '\\usepackage{mdframed}', ...(tone.length === 0 && colors.every((c) => c === '') ? [] : ['\\usepackage{xcolor}'])],
        ...(declarations.length === 0 ? {} : { declarations }),
      };
    },
    emit: (node, content) => {
      const color = (name: string, keyName: string): string[] => (param(p, name) === '' ? [] : [`${keyName}=${colorFor(param(p, name), node)}`]);
      const keys = [
        ...(p['title'] === false || titleOf(node) === '' ? [] : [`frametitle={${titleOf(node)}}`]),
        ...(p['titleRule'] === true ? ['frametitlerule=true'] : []),
        ...color('titleBackground', 'frametitlebackgroundcolor'),
        ...color('lineColor', 'linecolor'),
        ...color('backgroundColor', 'backgroundcolor'),
        ...color('fontColor', 'fontcolor'),
        ...(param(p, 'lineWidth') === '' ? [] : [`linewidth=${param(p, 'lineWidth')}`]),
        ...(param(p, 'lines', 'all') === 'left' ? ['hidealllines=true', 'leftline=true'] : param(p, 'lines', 'all') === 'none' ? ['hidealllines=true'] : []),
        ...(tikz && param(p, 'roundCorner') !== '' ? [`roundcorner=${param(p, 'roundCorner')}`] : []),
        ...(tikz && p['shadow'] === true ? ['shadow=true'] : []),
        ...(p['breakable'] === false ? ['nobreak=true'] : []),
      ];
      return `\\begin{mdframed}${keys.length === 0 ? '' : `[${keys.join(', ')}]`}\n${content.trim() || '\\mbox{}'}\n\\end{mdframed}\n\n`;
    },
  };
};

export default realize;
