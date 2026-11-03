/**
 * code.minted: \begin{minted}{language} … \end{minted}, highlighted by
 * Pygments; \usemintedstyle{…} and \setminted{frame, fontsize, linenos,
 * breaklines, bgcolor, autogobble, tabsize}. Needs shell escape and Python,
 * which ZeroTeX-NG does not have.
 * CTAN: https://ctan.org/pkg/minted
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { codeText, languageOf, plainCaption } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const keys = [
    ...(param(p, 'frame', 'none') === 'none' ? [] : [`frame=${param(p, 'frame')}`]),
    ...(param(p, 'fontsize') === '' ? [] : [`fontsize=${param(p, 'fontsize')}`]),
    ...(p['linenos'] === true ? ['linenos'] : []),
    ...(p['breaklines'] === false ? [] : ['breaklines']),
    ...(param(p, 'background') === '' ? [] : [`bgcolor=${param(p, 'background')}`]),
    ...(p['autogobble'] === true ? ['autogobble'] : []),
    ...(typeof p['tabsize'] === 'number' && p['tabsize'] !== 8 ? [`tabsize=${p['tabsize']}`] : []),
  ];
  const declarations = [...(param(p, 'style', 'default') === 'default' ? [] : [`\\usemintedstyle{${param(p, 'style')}}`]), ...(keys.length === 0 ? [] : [`\\setminted{${keys.join(', ')}}`])];
  return {
    preamble: () => ({ packages: ['\\usepackage{minted}', ...(param(p, 'background') === '' ? [] : ['\\usepackage{xcolor}'])], ...(declarations.length === 0 ? {} : { declarations }) }),
    emit: (node, content, context) => `\\begin{minted}{${languageOf(node) === '' ? 'text' : languageOf(node).toLowerCase()}}\n${codeText(content, () => '')}\n\\end{minted}\n${plainCaption(context)}\n`,
  };
};

export default realize;
