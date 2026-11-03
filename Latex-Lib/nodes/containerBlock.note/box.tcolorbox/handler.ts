/**
 * box.tcolorbox: \begin{tcolorbox}[keys] … \end{tcolorbox}. Colours
 * (colback, colframe, coltitle), title and fonttitle, arc and boxrule,
 * sharp corners, a left bar (leftrule with the other rules at 0pt), a
 * filled panel; the breakable library to split across pages and the skins
 * library for enhanced and drop shadow. The box is \linewidth (or its width)
 * less a paragraph \leftskip, the line it starts on [W1].
 * CTAN: https://ctan.org/pkg/tcolorbox
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { colorFor, titleOf, toneDefinition } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const libraries = [...(p['breakable'] === true ? ['breakable'] : []), ...(p['shadow'] === true ? ['skins'] : [])];
  const colors = [param(p, 'colback'), param(p, 'colframe'), param(p, 'coltitle')];
  return {
    preamble: (_params, _parentType, node) => {
      const tone = toneDefinition(colors, node);
      return {
        packages: ['\\usepackage{tcolorbox}', ...(tone.length === 0 ? [] : ['\\usepackage{xcolor}'])],
        declarations: [...(libraries.length === 0 ? [] : [`\\tcbuselibrary{${libraries.join(',')}}`]), ...tone],
      };
    },
    emit: (node, content) => {
      const style = param(p, 'style', 'framed');
      const colframe = style === 'filled' ? param(p, 'colback') : param(p, 'colframe');
      const keys = [
        ...(p['title'] === false || titleOf(node) === '' ? [] : [`title={${titleOf(node)}}`]),
        ...(param(p, 'colback') === '' ? [] : [`colback=${colorFor(param(p, 'colback'), node)}`]),
        ...(colframe === '' ? [] : [`colframe=${colorFor(colframe, node)}`]),
        ...(param(p, 'coltitle') === '' ? [] : [`coltitle=${colorFor(param(p, 'coltitle'), node)}`]),
        ...(param(p, 'titleFont') === '' ? [] : [`fonttitle=${param(p, 'titleFont')}`]),
        ...(style === 'left-bar' ? [`boxrule=0pt`, `leftrule=${param(p, 'barWidth', '3pt')}`, 'sharp corners'] : param(p, 'boxrule') === '' ? [] : [`boxrule=${param(p, 'boxrule')}`]),
        ...(style !== 'left-bar' && param(p, 'corners', 'rounded') === 'sharp' ? ['sharp corners'] : style !== 'left-bar' && param(p, 'arc') !== '' ? [`arc=${param(p, 'arc')}`] : []),
        ...(p['shadow'] === true ? ['enhanced', 'drop shadow'] : []),
        ...(p['breakable'] === true ? ['breakable'] : []),
        ...(param(p, 'width') === '' ? [] : [`width=${param(p, 'width')}`]),
        // The line it starts on: KOMA-Script indents a footnote's text by \leftskip (thm.tcolorbox's handler). [W1]
        'add to width=-\\leftskip',
      ];
      return `\\begin{tcolorbox}${keys.length === 0 ? '' : `[${keys.join(', ')}]`}\n${content.trim() || '\\mbox{}'}\n\\end{tcolorbox}\n\n`;
    },
  };
};

export default realize;
