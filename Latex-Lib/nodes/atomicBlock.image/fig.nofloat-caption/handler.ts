/**
 * fig.nofloat-caption: a captioned image where the class has no figure float, one form per preset:
 * - tikzfigure: tikzposter's \begin{tikzfigure}[caption] … \end{tikzfigure}, the caption the optional argument, numbered by
 *   the class and safe inside a \block's argument, where a float stops at "Not in outer par mode" (poster.tex l.11, 229-256,
 *   286-325);
 * - handset: the minimal class's hand-numbered caption under a centred image, \begin{center}\includegraphics…\par
 *   \smallskip{\small Figure~\thefigure: …\par}\end{center} (class.minimal/main.tex l.223-227): minimal has no figure
 *   environment, no \caption and no figure counter (minimal.cls l.33-42), so the preamble makes the counter where it is
 *   missing and provides \small as the template does (main.tex l.47), and the label follows \refstepcounter{figure}.
 * With no caption, the tikzfigure has no optional argument, and the handset image keeps only its numbered label.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { field, labelKey, param } from '../../protocol.ts';
import { pathOf, widthOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const form = param(p, 'form', 'tikzfigure');
  const size = param(p, 'captionSize', '\\small');
  const declarations =
    form === 'handset'
      ? ['\\makeatletter\\@ifundefined{c@figure}{\\newcounter{figure}}{}\\makeatother', ...(size === '\\small' ? ['\\providecommand{\\small}{\\fontsize{9}{11}\\selectfont}'] : [])]
      : [];
  return {
    preamble: () => ({ packages: ['\\usepackage{graphicx}'], ...(declarations.length === 0 ? {} : { declarations }) }),
    emit: (node, content, context) => {
      if (pathOf(node) === '') return '';
      const image = `\\includegraphics[width=${widthOf(node)}]{${pathOf(node)}}`;
      const caption = (context ?? '').trim();
      const label = labelKey(field(node, 'label'));
      if (form === 'handset') {
        const mark = `\\refstepcounter{figure}${label === '' ? '' : `\\label{${label}}`}`;
        const line = caption === '' ? (label === '' ? '' : `\n{${mark}}`) : `\n\\smallskip\n{${size}${mark}${param(p, 'name', 'Figure')}~\\thefigure: ${caption}\\par}`;
        return `\\begin{center}\n${image}\\par${line}\n\\end{center}\n\n`;
      }
      return `\\begin{tikzfigure}${caption === '' ? '' : `[${caption}]`}${label === '' ? '' : `\n\\label{${label}}`}\n${image}\n\\end{tikzfigure}\n\n`;
    },
  };
};

export default realize;
