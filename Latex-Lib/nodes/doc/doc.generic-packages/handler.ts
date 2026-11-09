/**
 * doc.generic-packages (doc). Generic preamble packages a template switches on under any class: geometry with the template's
 * keys, lineno and \linenumbers, setspace at a spacing, and hyperref's pdfinfo entries. Each prints only when its parameter is
 * set, so the defaults print nothing.
 * CTAN: https://ctan.org/pkg/geometry, https://ctan.org/pkg/lineno, https://ctan.org/pkg/setspace, https://ctan.org/pkg/hyperref
 *
 * Not here: microtype (Frontiers loads it, frontiers.tex l.20), which has no facts in packages/ yet, so a key loading it would
 * not validate; it joins this way once packages/microtype.ts exists.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { PreambleRequirement, Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const packages: string[] = [];
  const declarations: string[] = [];
  if (p['geometry'] === true) {
    const options = param(p, 'geometryOptions').trim();
    packages.push(`\\usepackage${options === '' ? '' : `[${options}]`}{geometry}`);
  }
  const lineno = param(p, 'lineno', 'none');
  if (lineno !== 'none') {
    packages.push(`\\usepackage${lineno === 'plain' ? '' : `[${lineno}]`}{lineno}`);
    // \linenumbers in the preamble, as ijcai26.tex (l.31) and frontiers.tex (l.23) have it: it sets the numbering switch, which
    // holds from the first paragraph of the body.
    if (p['linenumbers'] !== false) declarations.push('\\linenumbers');
  }
  const setspace = param(p, 'setspace', 'none');
  if (setspace !== 'none') packages.push(`\\usepackage${setspace === 'plain' ? '' : `[${setspace}]`}{setspace}`);
  const pdfinfo = param(p, 'pdfinfo').trim();
  // IJCAI writes \pdfinfo{/TemplateVersion (IJCAI.2026.0)} (ijcai26.tex l.70-72), pdfTeX's primitive, which XeTeX lacks and
  // ijcai26.sty does not define. hyperref's pdfinfo key writes the same entry under every engine; it is set at \begin{document},
  // after every package has loaded, and only where hyperref is loaded, so a template without it prints no error.
  if (pdfinfo !== '') declarations.push(`\\AtBeginDocument{\\ifdefined\\hypersetup\\hypersetup{pdfinfo={${pdfinfo}}}\\fi}`);
  const out: PreambleRequirement = {
    ...(packages.length > 0 ? { packages } : {}),
    ...(declarations.length > 0 ? { declarations } : {}),
  };
  return {
    preamble: () => out,
    // A document-level way prints nothing in the body.
    emit: () => '',
  };
};

export default realize;
