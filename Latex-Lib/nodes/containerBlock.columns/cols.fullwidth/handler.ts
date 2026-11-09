/**
 * cols.fullwidth: Tufte-LaTeX's full-width area, \begin{fullwidth} … \end{fullwidth}, text that runs over the wide margin as
 * well as the text block (the class's adjustwidth with the margin's overhang, tufte-common.def; xtufte-common.def l.1293-1300).
 * It is the form of a one-column columns node: the block spans the page's whole width. A node of two or three columns prints
 * one full-width column by default (the class has no columns of its own); `split: 'multicol'` sets them with multicol, which the
 * class loads itself, inside the full-width area, the gap from the node in \columnsep, as cols.multicol does.
 * Source: Source/0793-xtufte/latex/xtufte-common.def l.1293-1300; sample-handout.tex l.267-274.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { afterOptional, countOf, gapOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const multi = param(p, 'split', 'one') === 'multicol';
  return {
    preamble: () => (multi ? { packages: ['\\usepackage{multicol}'] } : {}),
    emit: (node, content) => {
      const n = countOf(node);
      if (!multi || n === 1) return `\n\\begin{fullwidth}\n${content.trim()}\n\\end{fullwidth}\n\n`;
      return `\n\\begin{fullwidth}\n\\setlength{\\columnsep}{${gapOf(node)}}\n\\begin{multicols}{${n}}\n${afterOptional(content.trim())}\n\\end{multicols}\n\\end{fullwidth}\n\n`;
    },
  };
};

export default realize;
