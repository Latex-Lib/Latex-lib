/**
 * list.enumitem: the kernel lists with key-value options, per list
 * (\begin{itemize}[nosep]) or once for the document's first level
 * (\setlist[itemize,1]{…});
 * nosep, noitemsep, itemsep, leftmargin (* fits the widest label),
 * labelindent, label (\alph*) for numbers), style=nextline for descriptions.
 * CTAN: https://ctan.org/pkg/enumitem
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { nested, styleOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const optionsFor = (style: string): string[] => [
    ...(param(p, 'spacing', 'class') === 'class' ? [] : [param(p, 'spacing')]),
    ...(param(p, 'itemsep') === '' ? [] : [`itemsep=${param(p, 'itemsep')}`]),
    ...(param(p, 'leftmargin') === '' ? [] : [`leftmargin=${param(p, 'leftmargin')}`]),
    ...(param(p, 'labelindent') === '' ? [] : [`labelindent=${param(p, 'labelindent')}`]),
    ...(style === 'itemize' && param(p, 'label') !== '' ? [`label=${param(p, 'label')}`] : []),
    ...(style === 'enumerate' && param(p, 'enumLabel') !== '' ? [`label=${param(p, 'enumLabel')}`] : []),
    ...(style === 'description' && param(p, 'descriptionStyle', 'standard') !== 'standard' ? [`style=${param(p, 'descriptionStyle')}`] : []),
  ];
  const document = param(p, 'scope', 'list') === 'document';
  return {
    preamble: (_params, _parentType, node) => {
      const packages = ['\\usepackage{enumitem}'];
      if (!document || node === undefined) return { packages };
      const style = styleOf(node);
      const options = optionsFor(style);
      return options.length === 0 ? { packages } : { packages, declarations: [`\\setlist[${style},1]{${options.join(', ')}}`] };
    },
    emit: (node, content) => {
      const style = styleOf(node);
      const options = document ? [] : optionsFor(style);
      return nested(content, () => `\\begin{${style}}${options.length === 0 ? '' : `[${options.join(', ')}]`}`, () => `\\end{${style}}`);
    },
  };
};

export default realize;
