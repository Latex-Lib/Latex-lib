/**
 * cols.twocolumn-cmd: the kernel's \twocolumn and \onecolumn, each starting
 * a new page; \columnsep for the gap and \columnseprule for a rule, set
 * before the switch.
 * CTAN: https://ctan.org/pkg/latex-base (usrguide, \twocolumn)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { afterOptional, gapOf } from '../node.ts';
import key from './key.ts';

/**
 * The column mode, gap and rule the block found, saved when it starts: \LibColsBack gives them back after it, \onecolumn only where
 * the page was one column. Under a two-column class (IEEEtran, elsarticle's 5p) or setup B the old \onecolumn left the rest of the
 * document in one column, and the block's \columnsep and \columnseprule held for every later two-column page and multicols block.
 */
const SAVE = '\\makeatletter\\providecommand*{\\LibColsSave}{\\xdef\\LibColsBack{\\if@twocolumn\\else\\noexpand\\onecolumn\\fi\\noexpand\\setlength{\\noexpand\\columnsep}{\\the\\columnsep}\\noexpand\\setlength{\\noexpand\\columnseprule}{\\the\\columnseprule}}}\\makeatother';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const back = p['returnToOne'] !== false;
  return {
    preamble: () => (back ? { declarations: [SAVE] } : {}),
    emit: (node, content) => {
      const setup = [`\\setlength{\\columnsep}{${gapOf(node)}}`, ...(param(p, 'rule') === '' ? [] : [`\\setlength{\\columnseprule}{${param(p, 'rule')}}`])];
      return `\n${back ? '\\LibColsSave\n' : ''}${setup.join('\n')}\n\\twocolumn\n${afterOptional(content.trim())}\n${back ? '\\LibColsBack\n' : ''}`;
    },
  };
};

export default realize;
