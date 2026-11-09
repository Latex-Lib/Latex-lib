/**
 * bib.class-bst (cite/cite): the citation against bib.class-bst's list, \<command>{keys} with the class's own command (\cite,
 * natbib's \citep or \citet, revtex's \onlinecite, ascelike's \citeN...), joined to the text by a tie when asked.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param, textOf } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    // \leavevmode before the tie, as bib.bibtex-bst's citation writes it: amsart-like classes make ~ \unskip\nobreak\ , which stops
    // in vertical mode where the citation opens a heading.
    emit: (node) => (textOf(node) === '' ? '' : `${p['tie'] === true ? '\\leavevmode~' : ''}\\${param(p, 'command', 'cite')}{${textOf(node)}}`),
  };
};

export default realize;
