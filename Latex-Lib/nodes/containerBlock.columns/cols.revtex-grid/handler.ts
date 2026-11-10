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

/**
 * Every grid switch is a message to the output routine (\do@output@MVL): the output routine runs and ships no page, which TeX
 * counts as a dead cycle and resets only at a \shipout. A block costs about 9 of them on a two-column (reprint) page, where the
 * switches change nothing, and about 17 on a one-column page, widetext and a float more, so a page of short blocks stopped at
 * "Output loop---100 consecutive dead cycles" (revtex4-2's \maxdeadcycles; 200 in an aastex701 document), TeX shipped \box255
 * itself and the grid's state broke ("Argument of \adj@page has an extra }"). Batch 4 round 2: 49 cells, 20 documents, 801
 * failing branches in aastex.A/B and revtex4-2-aip/aps.A, the first error at a block's \twocolumngrid or text (revtex4-2-aip.A
 * dc85487eb1d726330e93f result cc6c561ba1, l.190, 46 of 46 branches; revtex4-2-aps.A ddc6537e375052fd77a12 result ccd837f1ec,
 * nine blocks and \end{document}). Reproduced with the class's own commands and no other package (ZeroTeX-NG, compat cases,
 * 2026-11-10): \deadcycles after each one-line \LibGridSave \twocolumngrid … \LibGridBack block climbs 6, 15, 24 … under
 * [aps,reprint] and 10, 27, 44 … under aastex701, so 20 blocks stop under either, as do 20 plain \twocolumngrid … \onecolumngrid
 * pairs; with the limit raised, 60 blocks with a widetext every third ship 3 pages with no error under [aps,reprint] and
 * [aip,jcp,reprint], and 40 blocks each holding a table float in a list ship under aastex701 and [aps,reprint]. TeX's own advice:
 * raise \maxdeadcycles; only raised, never lowered, as note.marginpar raises it. 10000, mdpi.cls's own value, since a page of
 * blocks passes 1000 under aastex701 (60 blocks: "Output loop---1000"). A real loop still stops: on a one-column page (aastex701,
 * revtex4-2 preprint) about 44 consecutive one-line two-column segments that reach the page's foot loop with \maxdeadcycles 10000
 * too, with plain \twocolumngrid … \onecolumngrid as with this way's blocks (an ltxgrid limit, not this way's; not fixed).
 */
const DEAD_CYCLES = '\\ifnum\\maxdeadcycles<10000 \\maxdeadcycles=10000 \\fi';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const mode = param(p, 'mode', 'auto');
  const wide = mode !== 'twocolumngrid';
  const grid = mode !== 'widetext';
  return {
    // widetext switches the grid through the output routine too (revtex4-2.cls l.7399-7470), so both modes raise the limit.
    preamble: () => ({ declarations: grid ? [DEAD_CYCLES, SAVE] : [DEAD_CYCLES] }),
    emit: (node, content) => {
      const body = content.trim();
      if (countOf(node) === 1) return wide ? `\n\\begin{widetext}\n${body}\n\\end{widetext}\n\n` : `${body}\n\n`;
      return grid ? `\n\\LibGridSave\n\\twocolumngrid\n${body}\n\n\\LibGridBack\n\n` : `${body}\n\n`;
    },
  };
};

export default realize;
