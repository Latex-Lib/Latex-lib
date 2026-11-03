/**
 * bib.biblatex-biber: \usepackage[backend=biber, style=…, sorting=…, maxnames=…,
 * giveninits, backref]{biblatex}, the entries in \jobname.bib (filecontents*)
 * added by \addbibresource, printed by \printbibliography[title=…]; Biber runs outside TeX.
 * CTAN: https://ctan.org/pkg/biblatex
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { bibFile, styleOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const optionsFor = (style: string): string[] => [
    `style=${style}`,
    'backend=biber',
    ...(param(p, 'sorting', 'style') === 'style' ? [] : [`sorting=${param(p, 'sorting')}`]),
    ...(typeof p['maxnames'] === 'number' && p['maxnames'] > 0 ? [`maxbibnames=${p['maxnames']}`] : []),
    ...(p['giveninits'] === true ? ['giveninits=true'] : []),
    ...(p['backref'] === true ? ['backref=true'] : []),
  ];
  return {
    preamble: (_params, _parentType, node, content) => {
      if (node === undefined) return {};
      const style = param(p, 'style', 'node') === 'node' ? styleOf(node, 'biber') : param(p, 'style');
      return { packages: [`\\usepackage[${optionsFor(style).join(',')}]{biblatex}`], beforeDocument: bibFile(content), declarations: content === undefined ? [] : ['\\addbibresource{\\jobname.bib}'] };
    },
    emit: () => `\\nocite{*}\n\\printbibliography${param(p, 'heading') === '' ? '' : `[title={${param(p, 'heading')}}]`}\n\n`,
  };
};

export default realize;
