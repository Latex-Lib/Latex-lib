/**
 * meta.hyperref: \href{url}{text}; the links' look through \hypersetup:
 * boxes (hyperref's own), colorlinks with linkcolor, citecolor and urlcolor
 * (or allcolors), hidelinks, or the class's own look.
 * The keys can instead all go in \usepackage[…]{hyperref} (keysIn: options), as
 * the CVPR author kit's \usepackage[pagebackref,breaklinks,colorlinks,allcolors=cvprblue]{hyperref}
 * after its \definecolor (Latex-Template-Examples/class.cvpr/main.tex l.72-75);
 * pagebackref, backref and breaklinks are hyperref's load-time options, so they
 * always go there. Under a class that loads hyperref itself (load false: MDPI's
 * \hyperrefpackage in begindocument/before, mdpi.cls l.442-522) nothing loads
 * it, and the look's keys, if any, wait for \begin{document}.
 * Two lines that load hyperref are kept apart by Flouest's verbatim merge: a
 * bare \usepackage{hyperref} from another way before this one's optioned line
 * stops at "Option clash for package hyperref" (the other order passes).
 * CTAN: https://ctan.org/pkg/hyperref
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { hrefOf, hrefTextOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const look = param(p, 'look', 'boxed');
  const load = p['load'] !== false;
  const asOptions = load && param(p, 'keysIn', 'hypersetup') === 'options';
  const allColor = param(p, 'allColor');
  const lookKeys =
    look === 'hidden' ? ['hidelinks']
    : look === 'colored' ? [asOptions ? 'colorlinks' : 'colorlinks=true', ...(allColor === '' ? [] : [`allcolors=${allColor}`]), ...(['linkColor', 'citeColor', 'urlColor'] as const).flatMap((k) => (param(p, k) === '' ? [] : [`${k.toLowerCase()}=${param(p, k)}`]))]
    : [];
  // Load-time options: hyperref disables them once loaded, so with load false they are dropped.
  const backref = param(p, 'backref', 'none');
  const loadKeys = load ? [...(backref === 'none' ? [] : [backref]), ...(p['breaklinks'] === true ? ['breaklinks'] : [])] : [];
  const options = asOptions ? [...loadKeys, ...lookKeys] : loadKeys;
  const setup = asOptions ? [] : lookKeys;
  const defineRgb = param(p, 'defineRgb');
  const define = look === 'colored' && allColor !== '' && defineRgb !== '' ? [`\\definecolor{${allColor}}{rgb}{${defineRgb}}`] : [];
  const declarations = [...define, ...(setup.length === 0 ? [] : [load ? `\\hypersetup{${setup.join(', ')}}` : `\\AtBeginDocument{\\hypersetup{${setup.join(', ')}}}`])];
  return {
    preamble: () => ({
      packages: [...(load ? [`\\usepackage${options.length === 0 ? '' : `[${options.join(',')}]`}{hyperref}`] : []), ...(look === 'colored' ? ['\\usepackage{xcolor}'] : [])],
      ...(declarations.length === 0 ? {} : { declarations }),
    }),
    // A link with no text prints its address, as General's does: \href{url}{} was an invisible link.
    emit: (node, content) => (hrefOf(node) === '' ? content : `\\href{${hrefOf(node)}}{${content.trim() === '' ? hrefTextOf(node) : content}}`),
  };
};

export default realize;
