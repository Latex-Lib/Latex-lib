/**
 * code.tcblisting: tcolorbox's listings library, \begin{tcblisting}{listing
 * only, title={…}, colback, colframe, left, width, listing options={…}} …
 * \end{tcblisting}; breakable through the breakable library.
 * CTAN: https://ctan.org/pkg/tcolorbox
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { codeText, listingsLanguage } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const libraries = ['listings', ...(p['breakable'] === true ? ['breakable'] : [])];
  return {
    preamble: () => ({ packages: ['\\usepackage{tcolorbox}'], declarations: [`\\tcbuselibrary{${libraries.join(',')}}`] }),
    emit: (node, content, context) => {
      const lang = listingsLanguage(node);
      const listing = [`basicstyle=${param(p, 'font', '\\ttfamily\\small')}`, 'breaklines=true', ...(lang === undefined ? [] : [`language=${lang}`]), ...(param(p, 'numbers', 'none') === 'none' ? [] : [`numbers=${param(p, 'numbers')}`, 'numberstyle=\\tiny'])];
      const keys = [
        'listing only',
        ...(context !== undefined && context.trim() !== '' ? [`title={${context.trim()}}`] : []),
        ...(param(p, 'colback') === '' ? [] : [`colback=${param(p, 'colback')}`]),
        ...(param(p, 'colframe') === '' ? [] : [`colframe=${param(p, 'colframe')}`]),
        ...(param(p, 'left') === '' ? [] : [`left=${param(p, 'left')}`]),
        ...(param(p, 'width') === '' ? [] : [`width=${param(p, 'width')}`, 'center']),
        ...(param(p, 'corners', 'rounded') === 'sharp' ? ['sharp corners'] : []),
        ...(p['breakable'] === true ? ['breakable'] : []),
        `listing options={${listing.join(', ')}}`,
      ];
      return `\\begin{tcblisting}{${keys.join(', ')}}\n${codeText(content, () => '')}\n\\end{tcblisting}\n\n`;
    },
  };
};

export default realize;
