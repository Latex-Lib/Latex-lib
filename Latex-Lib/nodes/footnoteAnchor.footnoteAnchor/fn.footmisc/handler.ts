/**
 * fn.footmisc: the footnotes' layout by package options, the footnotes
 * themselves still \footnote: hang, flushmargin, para, side; bottom,
 * perpage, symbol or symbol*, stable, norule; \footnotemargin for the mark's
 * room.
 * CTAN: https://ctan.org/pkg/footmisc
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

const LAYOUT: { readonly [l: string]: readonly string[] } = { class: [], hang: ['hang'], flushmargin: ['flushmargin'], 'hang-flushmargin': ['hang', 'flushmargin'], para: ['para'], side: ['side'] };

export const optionsOf = (p: { readonly [name: string]: unknown }): string[] => [
  ...(p['bottom'] === true ? ['bottom'] : []),
  ...(LAYOUT[param(p, 'layout', 'class')] ?? []),
  ...(p['perpage'] === true ? ['perpage'] : []),
  ...(param(p, 'symbols', 'none') === 'none' ? [] : [param(p, 'symbols')]),
  ...(p['stable'] === true ? ['stable'] : []),
  ...(p['rule'] === false ? ['norule'] : []),
];

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const options = optionsOf(p);
  const margin = param(p, 'margin');
  return {
    preamble: () => ({ packages: [`\\usepackage${options.length === 0 ? '' : `[${options.join(',')}]`}{footmisc}`], ...(margin === '' ? {} : { declarations: [`\\setlength{\\footnotemargin}{${margin}}`] }) }),
    emit: (node, content) => content,
  };
};

export default realize;
