/**
 * toc.titletoc: each section entry's format with
 * \titlecontents{section}[left]{above-code}{numbered}{numberless}{filler-and-page}:
 * \contentslabel{width} or \contentspush for the number, \titlerule*[pitch]{.}
 * for leaders, \contentspage for the page; \contentsmargin for the right
 * margin; then \tableofcontents.
 * CTAN: https://ctan.org/pkg/titlesec (titletoc, section 6)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { contentsBody, contentsDeclarations } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const label = p['push'] === true ? '\\contentspush{\\thecontentslabel\\quad}' : `\\contentslabel{${param(p, 'labelWidth', '1.5em')}}`;
  const filler = p['leaders'] === false ? '\\hfill\\contentspage' : `\\titlerule*[${param(p, 'pitch', '0.6pc')}]{.}\\contentspage`;
  const declarations = [
    ...contentsDeclarations(p),
    ...(param(p, 'margin') === '' ? [] : [`\\contentsmargin{${param(p, 'margin')}}`]),
    `\\titlecontents{section}[${param(p, 'indent', '0pt')}]{\\addvspace{1ex}${param(p, 'sectionFont', '\\bfseries')}}{${label}}{}{${filler}}`,
  ];
  return {
    preamble: () => ({ packages: ['\\usepackage{titletoc}'], declarations }),
    emit: () => contentsBody(p),
  };
};

export default realize;
