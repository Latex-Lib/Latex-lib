/**
 * cols.revtex-grid: revtex4-2's and aastex701's page grid (ltxgrid), switched in place with no new page. A block of one column is
 * \begin{widetext} … \end{widetext}: across both columns on a two-column (reprint) page, with the class's rules above and below,
 * and a plain list on a one-column page (revtex4-2.cls l.7399-7470: widetext@grid or widetext@galley by \twocolumn@sw). A block
 * of two or three columns is \twocolumngrid … then the grid it found: \LibGridSave keeps the grid in force, \LibGridBack returns
 * to it (\onecolumngrid where the page was one column; on a page already two columns \twocolumngrid does nothing, "Already in page
 * grid", l.4418-4420, and so does the return). ltxgrid has one and two columns only, so three are two. The node's gap is not
 * printed: \columnsep is the society file's.
 * The mode param keeps one switch only, for a template whose own LaTeX uses one: widetext (a reprint template) or the grid
 * switch (a preprint template); the other count is then the content in the page's columns as they are.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { countOf } from '../node.ts';
import key from './key.ts';

/**
 * The page grid the block found, kept when it starts: \LibGridBack switches back to it after the block. ltxgrid keeps the grid in
 * force in \thepagegrid (one or mlt) and its columns in \pagegrid@col (revtex4-2.cls l.4430, 4457-4458, 4519-4520; aastex701.cls
 * the same code), and changes them only in the output routine, when the page builder next runs: \twocolumngrid and
 * \onecolumngrid send it a message (\do@output@MVL, l.4409-4417, 4307-4330). Read in the body, the grid is stale: right after
 * \twocolumngrid it is still one (ZeroTeX-NG, \typeout of \thepagegrid around the block under [aps,preprint] and aastex701:
 * one, one, then mlt after the return), so a block straight after another would keep the first block's two columns as the grid
 * to return to. Both are sent as messages too, so each runs in its turn: the grid is read after every switch before it, and the
 * return is \start@column, what \onecolumngrid and \twocolumngrid run (no action where the grid is already the one asked).
 */
const SAVE = [
  '\\makeatletter',
  '\\providecommand*{\\LibGridSave}{\\par\\do@output@MVL{\\xdef\\LibGridSaved{\\noexpand\\start@column{\\thepagegrid}{\\the\\pagegrid@col}}}}',
  '\\providecommand*{\\LibGridBack}{\\par\\do@output@MVL{\\LibGridSaved}}',
  '\\makeatother',
].join('');

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const mode = param(p, 'mode', 'auto');
  const wide = mode !== 'twocolumngrid';
  const grid = mode !== 'widetext';
  return {
    preamble: () => (grid ? { declarations: [SAVE] } : {}),
    emit: (node, content) => {
      const body = content.trim();
      if (countOf(node) === 1) return wide ? `\n\\begin{widetext}\n${body}\n\\end{widetext}\n\n` : `${body}\n\n`;
      return grid ? `\n\\LibGridSave\n\\twocolumngrid\n${body}\n\n\\LibGridBack\n\n` : `${body}\n\n`;
    },
  };
};

export default realize;
