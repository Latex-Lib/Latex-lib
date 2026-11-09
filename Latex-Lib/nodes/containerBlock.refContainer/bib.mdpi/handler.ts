/**
 * bib.mdpi: MDPI's reference list as its template writes it (Source/0894-mdpi/template.tex l.473-516): the list set
 * out into the left margin column, \begin{adjustwidth}{-\extralength}{0cm} (changepage, which mdpi.cls loads; \extralength
 * is the class's own length, mdpi.cls l.1579-1580), its heading given with \reftitle{References} (a storing command,
 * mdpi.cls l.762-763), then the list. The class's own \thebibliography (mdpi.cls l.1857-1887) heads it \section*{\@reftitle},
 * adds it to the contents and sets it 9/11pt with zero list skips, so the way only names the heading and the list.
 *
 * Form thebibliography (the template's variant B, l.491-516): \begin{thebibliography}{999} with one \bibitem{key} per
 * entry, read from the entries' BibTeX source (`bibitems`, ../node.ts; \bibitem[{Author(Year)}]{key} under natbib, which
 * mdpi loads, l.337-341: in its numbers mode, \bibpunct{[}{]}{,}{n}{}{,} at l.380, natbib prints the number either way).
 * No entry to print gives no list, as bib.thebibliography.
 *
 * Form bibtex (variant A, l.486-489): \bibliography{\jobname} with no \bibliographystyle of its own, since mdpi.cls calls
 * \bibliographystyle{Definitions/mdpi} while it loads (l.373-382) and a second \bibstyle stops BibTeX ("Illegal, another
 * \bibstyle command", bib.natbib's mdpi deny). It needs Definitions/mdpi.bst beside the class, which the template ships
 * (Source/0894-mdpi/Definitions/mdpi.bst) and the testing pipeline's mdpi setting does not. Once per document, as every
 * BibTeX way (`printedOnce`, `nociteOnce`, `bibFile`, ../node.ts).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { bibFile, bibitemChooser, bibitems, nociteOnce, printedOnce } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const bibtex = param(p, 'form', 'thebibliography') === 'bibtex';
  const wide = p['wide'] !== false;
  const heading = param(p, 'heading');
  /** The list in the margin column, under its \reftitle heading. */
  const around = (list: string): string => {
    const inner = [...(heading === '' ? [] : [`\\reftitle{${heading}}`]), list].join('\n');
    return wide ? `\\begin{adjustwidth}{-\\extralength}{0cm}\n${inner}\n\\end{adjustwidth}` : inner;
  };
  return {
    preamble: (_params, _parentType, _node, content) => (bibtex ? { beforeDocument: bibFile(content), declarations: [nociteOnce] } : { declarations: [bibitemChooser] }),
    emit: (_node, content) => {
      if (bibtex) return printedOnce(around('\\nocite{*}\n\\bibliography{\\jobname}'));
      const items = bibitems(content);
      if (items.length === 0) return '';
      return `${around(`\\begin{thebibliography}{${param(p, 'widest', '999')}}\n${items.join('\n')}\n\\end{thebibliography}`)}\n\n`;
    },
  };
};

export default realize;
