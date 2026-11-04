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
import { FIT_NOTE_COLUMN, NOTE_WIDTH_GIVEN, titled } from '../node.ts';
import key from './key.ts';
import { keepingFootnotes } from '../node.ts';

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
    // A width of its own, the class's kept first for the fit, which keeps this one only on the paper (b23 MARGIN-1W).
    ...(param(p, 'width') === '' ? [] : [NOTE_WIDTH_GIVEN, `\\setlength{\\marginparwidth}{${param(p, 'width')}}`]),
    // The class's column fitted to the margin where it is under 2cm or runs off the paper (b22 MC1, `FIT_NOTE_COLUMN`).
    FIT_NOTE_COLUMN,
  ];
  const offset = param(p, 'offset');
  return {
    preamble: () => ({ packages, declarations }),
    // A footnote in the note reaches the page's foot: footnotehyper's \savenotes around it, its offset included (b22 OV2-alt).
    emit: (node, content) => keepingFootnotes(content, `\n\\marginnote{${p['title'] === false ? content.trim() || '\\mbox{}' : titled(node, content)}}${offset === '' ? '' : `[${offset}]`}\n`),
  };
};

export default realize;
