/**
 * bib.named (cite/cite): the IJCAI style's named.sty citation commands (ijcai26.sty l.286-291): \cite{key} as [Author, Year],
 * \shortcite{key} as [Year] after the authors named in the sentence ("Gottlob~\shortcite{…}", ijcai26.tex l.258, 392),
 * \citeauthor{key} the authors alone and \citeyear{key} the year alone, without brackets; tied to the word before when asked.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param, textOf } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    // The kernel's ~ is \nobreakspace (\leavevmode\nobreak\ ) under article, which ijcai is, and named.sty's \@icite and \@nbcite
    // begin with \leavevmode themselves, so a citation that opens a paragraph needs nothing more.
    // \protect: named.sty's commands are \def'd macros (\citeauthor ->\def \citeauthoryear ##1##2{##1}\@nbcite), fragile in a moving
    // argument: in a heading they stopped at "Undefined control sequence" or "Illegal parameter number in definition of \reserved@a"
    // (batch 4 round 2, ijcai.A: document dbe162d42eebc6f24eb66, result a8ec93c2d78d; document daed8cedc364c5fe1bf86, result
    // fe3dd2559250, l.71). Protected, \cite, \shortcite, \citeauthor and \citeyear pass in a numbered and a starred heading under
    // the ijcai setting (ZeroTeX-NG through compat cases, 2026-11-10); in text \protect is \relax.
    emit: (node) => (textOf(node) === '' ? '' : `${p['tie'] === true ? '~' : ''}\\protect\\${param(p, 'command', 'cite')}{${textOf(node)}}`),
  };
};

export default realize;
