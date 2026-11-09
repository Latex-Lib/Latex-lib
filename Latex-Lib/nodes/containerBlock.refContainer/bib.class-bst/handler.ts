/**
 * bib.class-bst: BibTeX with the class's own style. The entries go to \jobname.bib (bibFile, ../node.ts); the body writes, once
 * per document, \nocite{*}, \bibliographystyle{<the class's .bst>} (none when bst is '', for a class that calls
 * \bibliographystyle itself: a second \bibstyle in main.aux makes BibTeX fail, "Illegal, another \bibstyle command") and
 * \bibliography{\jobname}. natbib is loaded only when asked, for a class that does not load it (aaai, cas, imsart): a class
 * that loads it would stop a second load with options at "Option clash for package natbib". The preamble adds acmart's
 * \citestyle and elsarticle's \biboptions when given; the body \backmatter, the CAS \printcredits, a \small group (CVPR) and
 * Tufte's \nobibliography.
 * CTAN: https://ctan.org/pkg/bibtex, https://ctan.org/pkg/natbib
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { bibFile, headingLines, nociteOnce, printedOnce } from '../node.ts';
import key from './key.ts';

const NATBIB: { readonly [form: string]: string } = {
  plain: '\\usepackage{natbib}',
  authoryear: '\\usepackage[authoryear]{natbib}',
  numbers: '\\usepackage[numbers]{natbib}',
  'authoryear-longnamesfirst': '\\usepackage[authoryear,longnamesfirst]{natbib}',
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  // A style name as BibTeX takes it: letters, digits, -, _, . and a folder's / (Definitions/mdpi).
  const bst = param(p, 'bst').replace(/[^\w./-]/gu, '');
  const size = param(p, 'size');
  const natbib = NATBIB[param(p, 'natbib', 'none')];
  const packages = [...(natbib === undefined ? [] : [natbib]), ...(p['cite'] === true ? ['\\usepackage{cite}'] : []), ...(p['hyperref'] === true ? ['\\usepackage{hyperref}'] : [])];
  const declarations = [
    ...headingLines(param(p, 'heading')),
    ...(param(p, 'citeStyle') === '' ? [] : [`\\citestyle{${param(p, 'citeStyle')}}`]),
    ...(param(p, 'bibOptions') === '' ? [] : [`\\biboptions{${param(p, 'bibOptions')}}`]),
    nociteOnce,
  ];
  const lines = [
    ...(p['backmatter'] === true ? ['\\backmatter'] : []),
    ...(p['printCredits'] === true ? ['\\printcredits'] : []),
    ...(p['nociteAll'] === false ? [] : ['\\nocite{*}']),
    ...(size === '' ? [] : [`{\\${size}`]),
    ...(bst === '' ? [] : [`\\bibliographystyle{${bst}}`]),
    p['noBibliography'] === true ? '\\nobibliography{\\jobname}' : '\\bibliography{\\jobname}',
    ...(size === '' ? [] : ['}']),
  ];
  return {
    preamble: (_params, _parentType, _node, content) => ({ ...(packages.length === 0 ? {} : { packages }), beforeDocument: bibFile(content), declarations }),
    // Once per document: BibTeX takes one \bibstyle, \bibdata and \citation{*} (printedOnce, ../node.ts).
    emit: () => printedOnce(lines.join('\n')),
  };
};

export default realize;
