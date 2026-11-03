/**
 * list.scrextend: KOMA's labeling environment for descriptions,
 * \begin{labeling}[separator]{widest pattern}, the labels in a column; the
 * labelinglabel font element; other lists stay the kernel's. A KOMA class
 * has the environment and the font element itself and leaves scrextend
 * unversioned if it is loaded there, which caption then refuses ("we need at
 * least version 2002/07/01 v3.0 of package scrextend"), so it is loaded only
 * under another class.
 * CTAN: https://ctan.org/pkg/koma-script
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { nested, styleOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const separator = param(p, 'separator') === '' ? '' : `[${param(p, 'separator')}]`;
  const declarations = param(p, 'labelFont') === '' ? [] : [`\\setkomafont{labelinglabel}{${param(p, 'labelFont')}}`];
  return {
    preamble: () => ({ packages: ['\\ifdefined\\KOMAClassName\\else\\usepackage{scrextend}\\fi'],...(declarations.length === 0 ? {} : { declarations }) }),
    emit: (node, content) =>
      nested(
        content,
        () => (styleOf(node) === 'description' ? `\\begin{labeling}${separator}{${param(p, 'widest', 'Description')}}` : `\\begin{${styleOf(node)}}`),
        () => (styleOf(node) === 'description' ? '\\end{labeling}' : `\\end{${styleOf(node)}}`),
      ),
  };
};

export default realize;
