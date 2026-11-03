/**
 * note.marginnote: \marginnote[left]{right}[voffset], a margin note that is
 * not a float. The package options (fulladjust, heightadjust, depthadjust,
 * noadjust), \marginfont, \raggedleftmarginnote and \raggedrightmarginnote,
 * \marginnotevadjust, \reversemarginpar.
 * CTAN: https://ctan.org/pkg/marginnote (sections 1 and 2)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { titled } from '../node.ts';
import key from './key.ts';

const ALIGN: { readonly [align: string]: readonly string[] } = {
  package: [],
  justified: ['\\renewcommand*{\\raggedleftmarginnote}{}', '\\renewcommand*{\\raggedrightmarginnote}{}'],
  center: ['\\renewcommand*{\\raggedleftmarginnote}{\\centering}', '\\renewcommand*{\\raggedrightmarginnote}{\\centering}'],
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const adjust = param(p, 'adjust', 'package');
  const color = param(p, 'color');
  const packages = [adjust === 'package' ? '\\usepackage{marginnote}' : `\\usepackage[${adjust}]{marginnote}`, ...(color === '' ? [] : ['\\usepackage{xcolor}'])];
  const font = `${param(p, 'font')}${color === '' ? '' : `\\color{${color}}`}`;
  const declarations = [
    ...(font === '' ? [] : [`\\renewcommand*{\\marginfont}{${font}}`]),
    ...(ALIGN[param(p, 'align', 'package')] ?? []),
    ...(param(p, 'vadjust') === '' ? [] : [`\\renewcommand*{\\marginnotevadjust}{${param(p, 'vadjust')}}`]),
    ...(param(p, 'side', 'outer') === 'reverse' ? ['\\reversemarginpar'] : []),
    ...(param(p, 'width') === '' ? [] : [`\\setlength{\\marginparwidth}{${param(p, 'width')}}`]),
  ];
  const offset = param(p, 'offset');
  return {
    preamble: () => ({ packages, ...(declarations.length === 0 ? {} : { declarations }) }),
    emit: (node, content) => `\n\\marginnote{${p['title'] === false ? content.trim() || '\\mbox{}' : titled(node, content)}}${offset === '' ? '' : `[${offset}]`}\n`,
  };
};

export default realize;
