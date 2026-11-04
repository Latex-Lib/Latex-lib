/**
 * fig.wrapfig: \begin{wrapfigure}[lines]{placement}[overhang]{width} …
 * \end{wrapfigure}, the text wrapping round the image; placement r, l, i, o
 * (upper case lets it float). Not in lists, columns or boxes.
 * A figure without a caption whose width is a length, not a share of the line (the `outer-raised` preset's 40mm), is capped
 * at 0.35 of the line it stands in: `\LatexLibWrapWidth{40mm}` sets `\LatexLibWrapW` before the environment, and wrapfig sets
 * its box with `\setlength\hsize{\LatexLibWrapW}`, a plain register, so calc's \setlength reads it too. 40mm (113.8pt) is wider
 * than 0.35 of a line only below 325pt, so every one-column page keeps 40mm; in a column of a two-column page (amsart.B's
 * 175pt) or in a note it left 50pt or less beside the figure, and the lines there (the next headings and listings as well,
 * while the figure still hangs) overran by 10 to 65pt (FIGBOX-W1, b25: GitHub run r4-d5cf4a6, amsart.B d9e41854a76a0a8cc63e9
 * l.225, the "Acknowledgements" head 48.17pt too wide beside the figure, 55 times; probe b25-1: all 55 gone at 0.35, still
 * 13.11pt at 0.45, the amsart.A control unchanged). A captioned figure keeps its length: in a framed box in a column its
 * caption set in 0.35 of the line overran on 42 lines, up to 70pt, against one 20.5pt line at 40mm (probe b25-1,
 * scrreprt.B d6adb999483bbcde157df), and the narrower `right` preset's captions already fail more often than outer-raised's.
 * Widths given as a share of the line (`right` 0.25, `left` 0.45) are printed as before.
 * CTAN: https://ctan.org/pkg/wrapfig (the package's usage notes)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { captionLines, pathOf } from '../node.ts';
import key from './key.ts';

/** `\LatexLibWrapWidth{w}`: `\LatexLibWrapW` = w, or 0.35\linewidth when that is less (FIGBOX-W1). */
export const WRAP_WIDTH = String.raw`\ifdefined\LatexLibWrapW\else\newlength\LatexLibWrapW\fi\providecommand*\LatexLibWrapWidth[1]{\setlength\LatexLibWrapW{#1}\ifdim\LatexLibWrapW>0.35\linewidth\setlength\LatexLibWrapW{0.35\linewidth}\fi}`;

/** A width given as a share of the line (`0.45\linewidth`, `\linewidth`), which needs no cap. */
const ofLine = (width: string): boolean => /^\s*(\d*\.?\d+)?\s*\\(linewidth|hsize|columnwidth|textwidth)\s*$/.test(width);

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const lines = typeof p['lines'] === 'number' && p['lines'] > 0 ? `[${p['lines']}]` : '';
  const overhang = param(p, 'overhang') === '' ? '' : `[${param(p, 'overhang')}]`;
  const raise = param(p, 'raise') === '' ? '' : `\\vspace{-${param(p, 'raise')}}\n`;
  const width = param(p, 'width', '0.45\\linewidth');
  // The declaration goes with every length width (the preamble does not see the node); only a figure without a caption uses it.
  const capped = !ofLine(width);
  return {
    preamble: () => ({ packages: ['\\usepackage{graphicx}', '\\usepackage{wrapfig}'], ...(capped ? { declarations: [WRAP_WIDTH] } : {}) }),
    emit: (node, content, context) => {
      if (pathOf(node) === '') return '';
      const caption = captionLines(node, context);
      const wrap = capped && !caption.includes('\\caption{');
      return `${wrap ? `\\LatexLibWrapWidth{${width}}\n` : ''}\\begin{wrapfigure}${lines}{${param(p, 'side', 'r')}}${overhang}{${wrap ? '\\LatexLibWrapW' : width}}\n\\centering\n${raise}\\includegraphics[width=\\linewidth]{${pathOf(node)}}${caption}\n\\end{wrapfigure}\n`;
    },
  };
};

export default realize;
