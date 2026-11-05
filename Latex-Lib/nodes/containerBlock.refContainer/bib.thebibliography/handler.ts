/**
 * bib.thebibliography: a hand-written \begin{thebibliography}{widest} with
 * one \bibitem{key} per entry, read from the entries' BibTeX source; its
 * size and item spacing, its heading through \refname or \bibname. Under
 * natbib each entry is \bibitem[{Author(Year)}]{key}, so natbib's
 * author-year mode accepts the list (`bibitemChooser`, ../node.ts).
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { bibitemChooser, bibitems, headingLines } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = [...headingLines(param(p, 'heading')), bibitemChooser];
  return {
    preamble: () => ({ declarations }),
    emit: (node, content) => {
      const items = bibitems(content);
      // No entry to print (paragraphs holding no BibTeX entry: plain-text references, a raw-LaTeX island): no list. An empty
      // thebibliography stops IEEEtran ("Something's wrong--perhaps a missing \item", IEEEtran.cls l.4515 \let\endthebibliography=\endlist:
      // db6ca77df7b299a1f1fcd in ieeetran-conference.A result 4de1022a2592 and ieeetran-journal.A 5ff7b173f198) and, repeated, revtex4-2
      // ("Output loop---100 consecutive dead cycles" in \bib@device, revtex4-2-aps.A 5be4754573e4); article only warns.
      if (items.length === 0) return '';
      const setup = [...(param(p, 'itemsep') === '' ? [] : [`\\setlength{\\itemsep}{${param(p, 'itemsep')}}`])];
      const list = `\\begin{thebibliography}{${param(p, 'widest', '99')}}\n${[...setup, ...items].join('\n')}\n\\end{thebibliography}`;
      return param(p, 'font') === '' ? `${list}\n\n` : `{${param(p, 'font')}\n${list}\n}\n\n`;
    },
  };
};

export default realize;
