/**
 * fig.svg: \includesvg[width=…]{file} in a figure float; Inkscape converts
 * the file during the compile (shell escape, which ZeroTeX-NG does not
 * have). inkscapelatex=false keeps the drawing's own text, \svgpath a folder.
 * CTAN: https://ctan.org/pkg/svg
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { inFloat, pathOf, placementOf, widthOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const dir = param(p, 'svgPath');
  return {
    preamble: () => ({ packages: ['\\usepackage{svg}'], ...(dir === '' ? {} : { declarations: [`\\svgpath{{${dir.endsWith('/') ? dir : `${dir}/`}}}`] }) }),
    emit: (node, content, context) =>
      pathOf(node) === '' ? '' : inFloat('figure', placementOf(node, 'h!', 'htbp'), true, `\\includesvg[width=${widthOf(node)}${p['latexText'] === false ? ',inkscapelatex=false' : ''}]{${pathOf(node)}}`, node, context),
  };
};

export default realize;
