/**
 * fig.graphicx: \includegraphics[width=…]{file} in a figure float
 * (\begin{figure}[placement] … \caption … \label … \end{figure}), or alone
 * in the text; figure* across both columns; \graphicspath for a folder;
 * keepaspectratio under a height limit. Alone in the text and flush
 * (`\noindent`), a head still waiting there (a statement's above it) is first
 * set on its own line (`\LatexLibHeadOwnLine`, protocol.ts): beside an image a
 * line wide it ran past the line by its width (run 41584963423: 975 not-denied
 * branches failed on that alone, all @inline). A float leaves the head to the
 * next line, and a centred image lets it end its own line. [F3]
 * describe: acmart's \Description{…} after the caption, before the label (acmart.dtx l.1460-1480, 4134): the node's
 * data.description (Flouest has no such field yet: read when present), else the caption, which is already LaTeX. Nothing
 * else changes, so the other presets print as before.
 * numberInline: false: an inline image with no label at all, for the letter class, which has no figure counter
 * (\refstepcounter{figure} stops at "No counter 'figure' defined"; Letter.md l.110-116, 196).
 * CTAN: https://ctan.org/pkg/graphicx
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { HEAD_OWN_LINE, escapeText, field, headOwnLine, labelKey, param } from '../../protocol.ts';
import { inFloat, inlineLabel, pathLines, pathOf, placementOf, widthOf } from '../node.ts';
import key from './key.ts';

/** The caption, acmart's \Description and the label, each on its own line; a part with no text is left out. */
const describedLines = (node: Subject, caption: string | undefined): string => {
  const text = caption?.trim() ?? '';
  const description = escapeText(field(node, 'description')) || text;
  const label = labelKey(field(node, 'label'));
  return `${text === '' ? '' : `\n\\caption{${text}}`}${description === '' ? '' : `\n\\Description{${description}}`}${label === '' ? '' : `\n\\label{${label}}`}`;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = [...pathLines(param(p, 'graphicsPath')), ...(p['float'] === false && p['center'] === false ? [HEAD_OWN_LINE] : [])];
  return {
    preamble: () => ({ packages: ['\\usepackage{graphicx}'], ...(declarations.length === 0 ? {} : { declarations }) }),
    emit: (node, content, context) => {
      if (pathOf(node) === '') return '';
      const height = param(p, 'maxHeight');
      const image = `\\includegraphics[width=${widthOf(node, param(p, 'unit', 'linewidth'))}${height === '' ? '' : `,height=${height},keepaspectratio`}]{${pathOf(node)}}`;
      const label = p['numberInline'] === false ? '' : inlineLabel(node);
      if (p['float'] === false && p['center'] === false) return headOwnLine(`\\noindent${image}${label}\n\n`);
      if (p['float'] === false) return `\\begin{center}\n${image}\n\\end{center}${label}\n\n`;
      const env = p['span'] === true ? 'figure*' : 'figure';
      const placement = placementOf(node, 'h!', param(p, 'placement', 'htbp'));
      if (p['describe'] === true) {
        const lines = describedLines(node, context);
        const above = p['captionAbove'] === true;
        return `\\begin{${env}}${placement === '' ? '' : `[${placement}]`}${p['center'] !== false ? '\n\\centering' : ''}${above ? lines : ''}\n${image}${above ? '' : lines}\n\\end{${env}}\n\n`;
      }
      return inFloat(env, placement, p['center'] !== false, image, node, context, p['captionAbove'] === true);
    },
  };
};

export default realize;
