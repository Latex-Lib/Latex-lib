/**
 * abs.abstract-pkg: the abstract package over the class's abstract;
 * \abstractnamefont and \abstracttextfont for its fonts, \absleftindent and
 * \absrightindent for its width, the runin and addtotoc options.
 * CTAN: https://ctan.org/pkg/abstract
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { abstractBody } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const options = [...(p['runIn'] === true ? ['runin'] : []), ...(p['inContents'] === true ? ['addtotoc'] : [])];
  const indent = param(p, 'indent');
  const declarations = [
    `\\renewcommand{\\abstractnamefont}{${param(p, 'nameFont', '\\normalfont\\small\\bfseries')}}`,
    `\\renewcommand{\\abstracttextfont}{${param(p, 'textFont', '\\normalfont\\small')}}`,
    ...(indent === '' ? [] : [`\\setlength{\\absleftindent}{${indent}}`, `\\setlength{\\absrightindent}{${indent}}`]),
  ];
  return {
    preamble: () => ({ packages: [`\\usepackage${options.length === 0 ? '' : `[${options.join(',')}]`}{abstract}`], declarations }),
    emit: (node, content) => `\\begin{abstract}\n${abstractBody(node, content)}\n\\end{abstract}\n\n`,
  };
};

export default realize;
