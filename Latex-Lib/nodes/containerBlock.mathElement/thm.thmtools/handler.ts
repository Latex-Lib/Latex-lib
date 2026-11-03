/**
 * thm.thmtools: one `\declaretheoremstyle` (and an upright twin), then
 * `\declaretheorem` per kind, numbered within a counter.
 *
 * In ZeroTeX-NG's TeX tree, thmtools breaks every theorem that shares
 * another's counter, its own `sibling=` and any `\newtheorem{kind}[theorem]`
 * after it alike ("Command \c@corollary already defined"; minimal documents
 * compiled 2026-10-31, with and without hyperref). So amsthm's `\newtheorem`
 * is kept across thmtools's load, for the other ways' statements in the
 * document, and a kind on the theorem's counter is declared on its own and
 * given the theorem's counter (`\let\c@corollary\c@theorem`, as aliascnt
 * does). Both compile there.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { amsStyleOf, declarations, displayName, elementOf, environmentOf, numberingOf, statementIn, text, type Element } from '../statement.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const params = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const numbering = numberingOf(params);
  const upright = params['uprightKinds'] !== false;
  const qed = text(params, 'qed', '');
  const style = (name: string, bodyFont: string): string =>
    `\\declaretheoremstyle[${[
      `spaceabove=${text(params, 'spaceAbove', '\\topsep')}`,
      `spacebelow=${text(params, 'spaceBelow', '\\topsep')}`,
      `headfont=${text(params, 'headFont', '\\bfseries')}`,
      `bodyfont=${bodyFont}`,
      `headpunct={${text(params, 'headPunct', '.')}}`,
      `postheadspace=${text(params, 'postHeadSpace', '.5em')}`,
      ...(qed === '' ? [] : [`qed={${qed}}`]),
    ].join(', ')}]{${name}}`;
  const styleOf = (element: Element): string => (upright && amsStyleOf(element) !== 'plain' ? 'libthmupright' : 'libthm');
  return {
    preamble: (_p, _parent, node) => {
      // amsthm's \newtheorem kept across thmtools's load (see the header). A coloured QED mark (the beauty preset's) needs xcolor,
      // which another way loads in most documents but not in all (key.ts loads).
      const packages = ['\\usepackage{amsthm}', '\\let\\libAmsNewtheorem\\newtheorem\\usepackage{thmtools}\\let\\newtheorem\\libAmsNewtheorem', ...(qed.includes('\\color') ? ['\\usepackage{xcolor}'] : [])];
      if (node === undefined) return { packages };
      return {
        packages,
        declarations: [
          style('libthm', text(params, 'bodyFont', '\\itshape')),
          ...(upright ? [style('libthmupright', '\\normalfont')] : []),
          ...declarations(elementOf(node), numbering, (env, element, counter) => {
            // On the theorem's counter: declared on its own, then given that counter, as one entry (see the header).
            if ('shared' in counter) {
              return `\\declaretheorem[style=${styleOf(element)}, name=${displayName(element)}]{${env}}\n\\makeatletter\\let\\c@${env}\\c@${counter.shared}\\let\\the${env}\\the${counter.shared}\\makeatother`;
            }
            const numbered = counter.within === 'none' ? [] : [`numberwithin=${counter.within}`];
            return `\\declaretheorem[${[`style=${styleOf(element)}`, `name=${displayName(element)}`, ...numbered].join(', ')}]{${env}}`;
          }),
        ],
      };
    },
    emit: (node, content, note) => statementIn(environmentOf(elementOf(node), numbering.rename === 'yes'), node, content, note),
  };
};

export default realize;
