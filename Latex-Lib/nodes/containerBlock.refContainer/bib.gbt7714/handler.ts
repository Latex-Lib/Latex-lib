/**
 * bib.gbt7714: a GB/T 7714 reference list with BibTeX under the ctex classes: \usepackage{gbt7714} (which loads natbib),
 * \bibliographystyle{gbt7714-numerical} (or gbt7714-author-year) and \bibliography{\jobname}, as the Chinese thesis classes
 * write it (cqjtuthesis.cls l.654, dgut config.cls l.1013-1016, xduts.dtx l.5816-5817); \citestyle{numbers} for numbers
 * on the line rather than superscript; \bibsep and the list's heading (\refname, \bibname). Once per document, as every
 * BibTeX way (`printedOnce`, `nociteOnce`, `bibFile`, ../node.ts).
 *
 * The package's versions differ. Measured on the engine, gbt7714 2026-09-15 v3.1.0, ctexart [fontset=fandol], 2026-11-07
 * (class-examples typeset-dir probes; the \ifNAT@super and \ifNAT@numbers flags typed out after \begin{document}):
 * - v1.x (2019/03/21 v1.1.1, bundled by buptthesis: Source/0624-houluy-buptemplate/gbt7714.sty l.46-77) calls
 *   \bibliographystyle itself from its options ([super] by default), so a second one of the document's stops BibTeX
 *   ("Illegal, another \bibstyle command"); the way never ships that file, and the engine's own copy is v3.
 * - v3.1.0 calls none: [super]{gbt7714} with no \bibliographystyle left "No file main.bbl." and every citation undefined
 *   (probe-legacy-nostyle), so the way always writes one. The names gbt7714-numerical and gbt7714-author-year are kept (v3
 *   warns they are deprecated for gbt7714-numeric and gbt7714-authoryear, and builds): they are what the templates write and
 *   what v2 knows.
 * - The style names the citation mode at \begin{document} (\bibstyle@gbt7714-numerical is super, -author-year author-year,
 *   read back from the .aux), so the [numbers] option alone still gave superscripts (\ifNAT@super true, probe-numbers);
 *   \citestyle{numbers} in the preamble is taken first and kept (\ifNAT@super false, probe-citestyle).
 * Legacy option (buptthesis.cls l.175, \RequirePackage[super]{gbt7714}) prints the mode as the package's option too, as the
 * older templates load it; v3 takes it silently and the lines above still decide.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { bibFile, headingLines, nociteOnce, printedOnce } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const mode = param(p, 'citeStyle', 'super');
  const bst = mode === 'authoryear' ? 'gbt7714-author-year' : 'gbt7714-numerical';
  const declarations = [
    ...(mode === 'numbers' ? ['\\citestyle{numbers}'] : []),
    ...headingLines(param(p, 'heading')),
    ...(param(p, 'bibsep') === '' ? [] : [`\\setlength{\\bibsep}{${param(p, 'bibsep')}}`]),
    nociteOnce,
  ];
  const pkg = p['legacyOption'] === true ? `\\usepackage[${mode}]{gbt7714}` : '\\usepackage{gbt7714}';
  return {
    preamble: (_params, _parentType, _node, content) => ({ packages: [pkg], beforeDocument: bibFile(content), declarations }),
    // Once per document: BibTeX takes one \bibstyle, \bibdata and \citation{*} (printedOnce, ../node.ts).
    emit: () => printedOnce(`\\nocite{*}\n\\bibliographystyle{${bst}}\n\\bibliography{\\jobname}`),
  };
};

export default realize;
