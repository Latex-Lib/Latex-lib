/**
 * bib.tikzposter-block: a poster's reference list in its own tikzposter \block[options]{title}{…}: natbib with
 * [square,numbers], and inside the block a smaller font, \nocite{*}, \bibliographystyle{unsrtnat} and
 * \bibliography{\jobname} (the entries written to \jobname.bib), the list in a multicols when asked, as the landscape poster
 * spreads it over four. natbib's thebibliography heads the list with \bibsection (\section*{\refname}), so the block's own title is
 * empty in the template; the heading through \refname.
 * Source: Latex Related Research/Latex-lib-main/Source/0368-sjijon-tex-templates/Tikzposter posters/Simple poster/
 * simple-poster.tex l.4, 222-228; Simple poster - Landscape/simple-poster-landscape.tex l.4, 8, 220-229.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, param } from '../../protocol.ts';
import { bibFile, headingLines, nociteOnce, printedOnce } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const columns = param(p, 'columns', '1');
  const multicol = columns !== '1';
  const options = param(p, 'blockOptions');
  const list = `\\nocite{*}\n\\bibliographystyle{${param(p, 'bst', 'unsrtnat')}}\n\\bibliography{\\jobname}`;
  const body = multicol ? `\\begin{multicols}{${columns}}\n${list}\n\\end{multicols}` : list;
  const declarations = [...headingLines(param(p, 'heading')), nociteOnce];
  return {
    preamble: (_params, _parentType, _node, content) => ({
      packages: ['\\usepackage[square,numbers]{natbib}', ...(multicol ? ['\\usepackage{multicol}'] : [])],
      beforeDocument: bibFile(content),
      declarations,
    }),
    // Once per document, the whole block (printedOnce, ../node.ts): BibTeX takes one \bibstyle, \bibdata and \citation{*}, and a
    // later list's block would otherwise be drawn empty.
    emit: () => printedOnce(`\\block${options === '' ? '' : `[${options}]`}{${escapeText(param(p, 'title'))}}{\\${param(p, 'font', 'small')}\n${body}\n}`),
  };
};

export default realize;
