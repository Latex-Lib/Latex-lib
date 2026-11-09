/**
 * bib.thebibliography: a hand-written \begin{thebibliography}{widest} with
 * one \bibitem{key} per entry, read from the entries' BibTeX source; its
 * size and item spacing, its heading through \refname or \bibname. Under
 * natbib each entry is \bibitem[{Author(Year)}]{key}, so natbib's
 * author-year mode accepts the list (`bibitemChooser`, ../node.ts).
 * The size is set inside the environment, which scopes it, never in braces
 * around it: revtex4-2's thebibliography cancels the notes bibliography the
 * class adds at \end{document} with an \aftergroup, which a group around the
 * environment undoes, so bibtex then meets a second \bibdata ("Illegal,
 * another \bibdata command").
 * Labels none empties \@biblabel inside the environment (by \csname, so no
 * \makeatletter is needed where the body is already read), after \list has
 * measured the widest label, as AISTATS's sample does; hang sets \itemindent
 * to -\leftmargin, so each entry starts at the margin and its later lines hang.
 * Labels natbib loads natbib (with longnamesfirst, sort) and sets \bibpunct and
 * \bibfont, as the Interact APA sample does; the \bibitem[{Author(Year)}]
 * labels then follow from `bibitemChooser`.
 * CTAN: https://ctan.org/pkg/latex-base, https://ctan.org/pkg/natbib
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { bibitemChooser, bibitems, headingLines } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const natbib = param(p, 'labels', 'number') === 'natbib';
  const natbibOptions = [...(p['longnamesfirst'] === true ? ['longnamesfirst'] : []), ...(p['natbibSort'] === true ? ['sort'] : [])];
  const natbibLines = natbib
    ? [...(param(p, 'bibpunct') === '' ? [] : [`\\bibpunct${param(p, 'bibpunct')}`]), ...(param(p, 'bibFont') === '' ? [] : [`\\renewcommand\\bibfont{${param(p, 'bibFont')}}`])]
    : [];
  const declarations = [...headingLines(param(p, 'heading')), ...natbibLines, bibitemChooser];
  const packages = natbib ? [`\\usepackage${natbibOptions.length === 0 ? '' : `[${natbibOptions.join(',')}]`}{natbib}`] : [];
  return {
    preamble: () => (packages.length === 0 ? { declarations } : { packages, declarations }),
    emit: (node, content) => {
      const items = bibitems(content);
      // No entry to print (paragraphs holding no BibTeX entry: plain-text references, a raw-LaTeX island): no list. An empty
      // thebibliography stops IEEEtran ("Something's wrong--perhaps a missing \item", IEEEtran.cls l.4515 \let\endthebibliography=\endlist:
      // db6ca77df7b299a1f1fcd in ieeetran-conference.A result 4de1022a2592 and ieeetran-journal.A 5ff7b173f198) and, repeated, revtex4-2
      // ("Output loop---100 consecutive dead cycles" in \bib@device, revtex4-2-aps.A 5be4754573e4); article only warns.
      if (items.length === 0) return '';
      const setup = [
        ...(param(p, 'font') === '' ? [] : [param(p, 'font')]),
        ...(param(p, 'itemsep') === '' ? [] : [`\\setlength{\\itemsep}{${param(p, 'itemsep')}}`]),
        ...(p['hang'] === true ? ['\\setlength{\\itemindent}{-\\leftmargin}'] : []),
        ...(param(p, 'labels', 'number') === 'none' ? ['\\expandafter\\renewcommand\\csname @biblabel\\endcsname[1]{}'] : []),
      ];
      return `\\begin{thebibliography}{${param(p, 'widest', '99')}}\n${[...setup, ...items].join('\n')}\n\\end{thebibliography}\n\n`;
    },
  };
};

export default realize;
