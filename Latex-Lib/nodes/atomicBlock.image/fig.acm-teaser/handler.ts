/**
 * fig.acm-teaser: acmart's teaserfigure, \begin{teaserfigure} \includegraphics[width=\textwidth]{…} \caption{…}
 * \Description{…} \label{…} \end{teaserfigure}. The class collects the body (\Collect@Body\@saveteaser, acmart.dtx
 * l.6450-6458) and prints it between the authors and the abstract from \maketitle (\@mkteasers, l.6623, 7710-7721), with
 * \captionsetup{type=figure}, so the caption is a figure's; written after \maketitle it is lost. \Description (l.4134) only
 * sets the switch \@mkteasers reads to warn of an image without description; its text is the node's data.description
 * (Flouest has no such field yet: read when present), else the caption. The scaled preset centres the image at the node's
 * share of \textwidth.
 * Samples: samples.dtx l.375-389. CTAN: https://ctan.org/pkg/acmart
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { escapeText, field, labelKey } from '../../protocol.ts';
import { pathOf, widthOf } from '../node.ts';
import key from './key.ts';

/** The caption, \Description (when `describe`) and the label, each on its own line; a part with no text is left out. */
const describedLines = (node: Subject, caption: string | undefined, describe: boolean): string => {
  const text = caption?.trim() ?? '';
  const description = describe ? escapeText(field(node, 'description')) || text : '';
  const label = labelKey(field(node, 'label'));
  return `${text === '' ? '' : `\n\\caption{${text}}`}${description === '' ? '' : `\n\\Description{${description}}`}${label === '' ? '' : `\n\\label{${label}}`}`;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const scaled = p['scaled'] === true;
  return {
    preamble: () => ({ packages: ['\\usepackage{graphicx}'] }),
    emit: (node, _content, context) => {
      if (pathOf(node) === '') return '';
      const width = scaled ? widthOf(node, 'textwidth') : '\\textwidth';
      return `\\begin{teaserfigure}${scaled ? '\n\\centering' : ''}\n\\includegraphics[width=${width}]{${pathOf(node)}}${describedLines(node, context, p['describe'] !== false)}\n\\end{teaserfigure}\n\n`;
    },
  };
};

export default realize;
