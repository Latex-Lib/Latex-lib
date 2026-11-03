/**
 * meta.hyperref: \href{url}{text}; the links' look through \hypersetup:
 * boxes (hyperref's own), colorlinks with linkcolor, citecolor and urlcolor,
 * or hidelinks.
 * CTAN: https://ctan.org/pkg/hyperref
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { hrefOf, hrefTextOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const look = param(p, 'look', 'boxed');
  const keys =
    look === 'hidden' ? ['hidelinks']
    : look === 'colored' ? ['colorlinks=true', ...(['linkColor', 'citeColor', 'urlColor'] as const).flatMap((k) => (param(p, k) === '' ? [] : [`${k.toLowerCase()}=${param(p, k)}`]))]
    : [];
  return {
    preamble: () => ({ packages: ['\\usepackage{hyperref}', ...(look === 'colored' ? ['\\usepackage{xcolor}'] : [])], ...(keys.length === 0 ? {} : { declarations: [`\\hypersetup{${keys.join(', ')}}`] }) }),
    // A link with no text prints its address, as General's does: \href{url}{} was an invisible link.
    emit: (node, content) => (hrefOf(node) === '' ? content : `\\href{${hrefOf(node)}}{${content.trim() === '' ? hrefTextOf(node) : content}}`),
  };
};

export default realize;
