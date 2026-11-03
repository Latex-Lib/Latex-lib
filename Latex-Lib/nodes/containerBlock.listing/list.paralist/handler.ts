/**
 * list.paralist: the lists in paralist's forms. compactitem, compactenum,
 * compactdesc; inparaitem, inparaenum (run into the paragraph); asparaitem,
 * asparaenum, asparadesc (each item a paragraph); a label template for
 * numbered lists ([(a)]); \setdefaultenum and \setdefaultleftmargin.
 * CTAN: https://ctan.org/pkg/paralist
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { nested, styleOf } from '../node.ts';
import key from './key.ts';

const FORMS: { readonly [form: string]: { readonly [style: string]: string } } = {
  compact: { itemize: 'compactitem', enumerate: 'compactenum', description: 'compactdesc' },
  inline: { itemize: 'inparaitem', enumerate: 'inparaenum', description: 'compactdesc' },
  aspara: { itemize: 'asparaitem', enumerate: 'asparaenum', description: 'asparadesc' },
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = [
    ...(param(p, 'defaultEnum') === '' ? [] : [`\\setdefaultenum${param(p, 'defaultEnum')}`]),
    ...(param(p, 'defaultMargins') === '' ? [] : [`\\setdefaultleftmargin${param(p, 'defaultMargins')}`]),
  ];
  return {
    preamble: () => ({ packages: ['\\usepackage{paralist}'], ...(declarations.length === 0 ? {} : { declarations }) }),
    emit: (node, content) => {
      const style = styleOf(node);
      const env = (FORMS[param(p, 'form', 'compact')] ?? FORMS['compact'] ?? {})[style] ?? 'compactitem';
      const label = style === 'enumerate' && param(p, 'label') !== '' ? `[${param(p, 'label')}]` : '';
      return nested(content, () => `\\begin{${env}}${label}`, () => `\\end{${env}}`);
    },
  };
};

export default realize;
