/**
 * bib.bibtex-bst (cite/cite): The kernel's \cite{key}, the label as the .bst style makes it, joined to the text by a tie when asked.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param, textOf } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    // \leavevmode before the tie: amsart makes ~ \unskip\nobreak\ (amsart.cls l.1415-1416), and \unskip in vertical mode stops at
    // "You can't use `\unskip' in vertical mode" where the citation opens a title set in vertical mode (General's titlesec
    // headings; run 41584963423: amsart.A d4887d710be5a47eb9754 result 992975133b l.175, 6 branches). The kernel's ~ starts the
    // paragraph itself (\nobreakspace is \leavevmode\nobreak\ ), so nothing changes elsewhere, nor after a word.
    emit: (node) => (textOf(node) === '' ? '' : `${p['tie'] === true ? '\\leavevmode~' : ''}\\${param(p, 'command', 'cite')}{${textOf(node)}}`),
  };
};

export default realize;
