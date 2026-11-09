/**
 * bib.biblatex-bibtex: \usepackage[backend=bibtex, style=…, sorting=…, maxnames=…,
 * giveninits, backref]{biblatex}, the entries in \jobname.bib (filecontents*)
 * added by \addbibresource, printed by \printbibliography[title=…]; BibTeX sorts them.
 * headingForm plain redefines biblatex's 'bibliography' heading as a bold line
 * (\defbibheading, after biblatex loads), for a class with no \section (letter,
 * minimal, scrlttr2); none and bibintoc are \printbibliography's own headings.
 * load false prints no \usepackage: the class loads biblatex (elegantpaper,
 * whose backend and styles are its own), and only \addbibresource and the list
 * are written.
 * CTAN: https://ctan.org/pkg/biblatex
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { bibFile, citedOnce, nociteOnce, styleOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const optionsFor = (style: string): string[] => [
    `style=${style}`,
    'backend=bibtex',
    ...(param(p, 'sorting', 'style') === 'style' ? [] : [`sorting=${param(p, 'sorting')}`]),
    ...(typeof p['maxnames'] === 'number' && p['maxnames'] > 0 ? [`maxbibnames=${p['maxnames']}`] : []),
    ...(p['giveninits'] === true ? ['giveninits=true'] : []),
    ...(p['backref'] === true ? ['backref=true'] : []),
  ];
  return {
    preamble: (_params, _parentType, node, content) => {
      if (node === undefined) return {};
      const style = param(p, 'style', 'node') === 'node' ? styleOf(node) : param(p, 'style');
      const plain = param(p, 'headingForm', 'default') === 'plain' ? ['\\defbibheading{bibliography}[\\refname]{\\par\\noindent\\textbf{#1}\\par\\medskip}'] : [];
      const declarations = content === undefined ? [...plain, nociteOnce] : ['\\addbibresource{\\jobname.bib}', ...plain, nociteOnce];
      return { ...(p['load'] === false ? {} : { packages: [`\\usepackage[${optionsFor(style).join(',')}]{biblatex}`] }), beforeDocument: bibFile(content), declarations };
    },
    // BibTeX takes one \citation{*} (citedOnce, ../node.ts); biblatex prints the list at every block, as General's lists do.
    emit: () => {
      const form = param(p, 'headingForm', 'default');
      const options = [...(form === 'none' || form === 'bibintoc' ? [`heading=${form}`] : []), ...(param(p, 'heading') === '' ? [] : [`title={${param(p, 'heading')}}`])];
      return `${citedOnce}\\printbibliography${options.length === 0 ? '' : `[${options.join(',')}]`}\n\n`;
    },
  };
};

export default realize;
