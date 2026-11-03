/**
 * bib.biblatex-bibtex (cite/cite): biblatex's citation commands: \autocite{key} as the style formats it, \parencite, \textcite, \footcite, \supercite.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { footnoteCite, param, textOf } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    emit: (node, _content, _context, parentType, location) => (textOf(node) === '' ? '' : `\\${footnoteCite(param(p, 'command', 'autocite'), parentType, location)}{${textOf(node)}}`),
  };
};

export default realize;
