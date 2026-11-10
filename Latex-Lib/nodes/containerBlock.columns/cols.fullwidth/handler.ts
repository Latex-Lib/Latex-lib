/**
 * cols.fullwidth: Tufte-LaTeX's full-width area, \begin{fullwidth} … \end{fullwidth}, text that runs over the wide margin as
 * well as the text block (the class's adjustwidth with the margin's overhang, tufte-common.def; xtufte-common.def l.1293-1300).
 * It is the form of a one-column columns node: the block spans the page's whole width. A node of two or three columns prints
 * one full-width column by default (the class has no columns of its own); `split: 'multicol'` sets them with multicol, which the
 * class loads itself, inside the full-width area, the gap from the node in \columnsep, as cols.multicol does.
 * Source: Source/0793-xtufte/latex/xtufte-common.def l.1293-1300; sample-handout.tex l.267-274.
 *
 * The area is changepage's adjustwidth, a list of one `\item[]` (its label empty, 0pt wide), so the label waits (\if@inlabel)
 * until the first paragraph. A block that opens the area (a tcolorbox, a statement, a table) opened with that label still
 * waiting, and a list-based environment inside a box there stopped at "Something's wrong--perhaps a missing \item": General's
 * boxed statement first in the area failed in 160 of 161 branches (batch 4 round 2, tufte-handout.A, 470 of the way's 1,672
 * branches failing, e.g. d7101e84ed51c42727b06 result 6f9ebb3ab4 l.68; reproduced, ZeroTeX-NG, and under article with
 * `\begin{list}{}{}\item[]` and a tcolorbox holding an amsthm statement). When the area's text opens with a block, the empty
 * label is let go first (`\LatexLibNoEmptyLabel`): it prints nothing, and the block opens as it would outside a list. Text
 * keeps the label, so its first paragraph stays unindented, as before.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { afterOptional, countOf, gapOf } from '../node.ts';
import key from './key.ts';

/** Lets go of a list label that waits and is empty (0pt wide), as adjustwidth's `\item[]` is. */
const NO_EMPTY_LABEL = String.raw`\makeatletter\providecommand*\LatexLibNoEmptyLabel{\if@inlabel\ifdim\wd\@labels=\z@\global\@inlabelfalse\global\@newlistfalse\global\setbox\@labels\box\voidb@x\fi\fi}\makeatother`;

/** Text that opens with a block: an environment, a box way's `\LatexLibHeadOwnLine`, or a group (General's list). */
const BLOCK_FIRST = /^(\\begin\{|\\LatexLibHeadOwnLine|\{)/u;

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const multi = param(p, 'split', 'one') === 'multicol';
  return {
    preamble: () => ({ ...(multi ? { packages: ['\\usepackage{multicol}'] } : {}), declarations: [NO_EMPTY_LABEL] }),
    emit: (node, content) => {
      const n = countOf(node);
      if (!multi || n === 1) return `\n\\begin{fullwidth}${BLOCK_FIRST.test(content.trim()) ? '\\LatexLibNoEmptyLabel' : ''}\n${content.trim()}\n\\end{fullwidth}\n\n`;
      return `\n\\begin{fullwidth}\n\\setlength{\\columnsep}{${gapOf(node)}}\n\\begin{multicols}{${n}}\n${afterOptional(content.trim())}\n\\end{multicols}\n\\end{fullwidth}\n\n`;
    },
  };
};

export default realize;
