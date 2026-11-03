/**
 * thm.amsthm: `\theoremstyle` and `\newtheorem` per kind; a style of its own
 * through `\newtheoremstyle` (Flouest's `amsthmStyleDeclaration`, `Packages/amsthm.ts`).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { amsStyleOf, declarations, displayName, elementOf, environmentOf, numberingOf, statementIn, text, withinArgument, type Element } from '../statement.ts';
import key from './key.ts';

const CUSTOM = 'libcustom';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const params = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const style = text(params, 'style', 'ams');
  const styleOf = (element: Element): string => (style === 'custom' ? CUSTOM : style === 'ams' ? amsStyleOf(element) : style);
  const numbering = numberingOf(params);
  const color = text(params, 'headColor', '');
  const headFont = `${text(params, 'headFont', '\\bfseries')}${color === '' ? '' : `\\color{${color}}`}`;
  const custom = `\\newtheoremstyle{${CUSTOM}}{${text(params, 'spaceAbove', '\\topsep')}}{${text(params, 'spaceBelow', '\\topsep')}}{${text(params, 'bodyFont', '\\itshape')}}{${text(params, 'indent', '')}}{${headFont}}{${text(params, 'headPunct', '.')}}{${text(params, 'headSpace', '.5em')}}{${text(params, 'headSpec', '')}}`;
  const qed = text(params, 'qedSymbol', '');
  return {
    preamble: (_p, _parent, node) => {
      const packages = ['\\usepackage{amsthm}', ...(style === 'custom' && color !== '' ? ['\\usepackage{xcolor}'] : [])];
      if (node === undefined) return { packages };
      return {
        packages,
        declarations: [
          ...(style === 'custom' ? [custom] : []),
          ...(qed === '' ? [] : [`\\renewcommand{\\qedsymbol}{${qed}}`]),
          ...declarations(elementOf(node), numbering, (env, element, counter) =>
            [`\\theoremstyle{${styleOf(element)}}`, 'shared' in counter ? `\\newtheorem{${env}}[${counter.shared}]{${displayName(element)}}` : `\\newtheorem{${env}}{${displayName(element)}}${withinArgument(counter.within)}`].join('\n'),
          ),
        ],
      };
    },
    emit: (node, content, note) => statementIn(environmentOf(elementOf(node), numbering.rename === 'yes'), node, content, note),
  };
};

export default realize;
