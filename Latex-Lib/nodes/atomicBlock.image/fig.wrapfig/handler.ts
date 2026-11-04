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
 * The cap also keeps 120pt of text beside the figure (the line less `\columnsep` less 120pt), but never goes below a
 * quarter of the line (FIGBOX-W2, b26). In llncs.B's 168.6pt column 0.35 left 99.6pt beside the figure, and llncs's 12pt
 * bold "Acknowledgements" head (111.7pt) overran by 12.10786pt on all 51 rows that W1 fixed in the other .B pairs (run
 * r5-ec4a757, d9e41854a76a0a8cc63e9); a quarter (42.1pt) leaves 116.4pt. Wherever the line is 200pt or more (every
 * one-column page, and the .B columns of article, book, report, memoir, exam, elsarticle and KOMA-Script) the room term
 * is at least 0.35 of the line, so the figure is as W1 printed it; narrower lines (amsart.B's 175pt column, notes,
 * nested columns) get a figure between a quarter and 0.35 of the line.
 * Widths given as a share of the line (`right` 0.25, `left` 0.45) are printed as before.
 * CTAN: https://ctan.org/pkg/wrapfig (the package's usage notes)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { captionLines, pathOf } from '../node.ts';
import key from './key.ts';

/**
 * `\LatexLibWrapWidth{w}`: `\LatexLibWrapW` = w, or the room when that is less (FIGBOX-W1, W2). The room
 * (`\LatexLibWrapRoom`) is the line less `\columnsep` less 120pt, at most 0.35\linewidth and at least 0.25\linewidth;
 * primitive register arithmetic (each step ends in `\relax`, so no `plus` keyword scan expands the next `\ifdim`), so it
 * reads the same with or without calc.
 */
export const WRAP_WIDTH = String.raw`\ifdefined\LatexLibWrapW\else\newlength\LatexLibWrapW\fi\ifdefined\LatexLibWrapRoom\else\newlength\LatexLibWrapRoom\fi\providecommand*\LatexLibWrapWidth[1]{\setlength\LatexLibWrapW{#1}\LatexLibWrapRoom\linewidth\relax\advance\LatexLibWrapRoom-\columnsep\relax\advance\LatexLibWrapRoom-120pt\relax\ifdim\LatexLibWrapRoom>0.35\linewidth\LatexLibWrapRoom0.35\linewidth\relax\fi\ifdim\LatexLibWrapRoom<0.25\linewidth\LatexLibWrapRoom0.25\linewidth\relax\fi\ifdim\LatexLibWrapW>\LatexLibWrapRoom\LatexLibWrapW\LatexLibWrapRoom\relax\fi}`;

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
