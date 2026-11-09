/**
 * math.linenomath (containerBlock/blockMath): amsmath's displays (`amsDisplay`, as math.amsmath prints them) inside lineno's
 * linenomath* environment, which numbers a display's lines with the running text (AGU, agujournaltemplate.tex l.208-214);
 * \linenumbers in the preamble when `lineNumbers` asks.
 * CTAN: https://ctan.org/pkg/lineno (linenomath, linenomath*)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { amsDisplay, TABLE_CELLS } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({ packages: ['\\usepackage{amsmath}', '\\usepackage{lineno}'], ...(p['lineNumbers'] === true ? { declarations: ['\\linenumbers'] } : {}) }),
    emit: (node, content, _context, parentType) => {
      const display = amsDisplay(node, content, param(p, 'multiline', 'auto'), parentType);
      // Nothing to wrap, or a table cell's inline island (`cellDisplay`): no display there, so no display lines to number.
      if (display === '' || TABLE_CELLS.has(parentType ?? '')) return display;
      return `\\begin{linenomath*}\n${display.trimEnd()}\n\\end{linenomath*}\n\n`;
    },
  };
};

export default realize;
