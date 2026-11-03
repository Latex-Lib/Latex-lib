/**
 * thm.ntheorem: the style settings, then `\newtheorem`, as one preamble entry
 * per kind, since ntheorem applies the settings in force to each
 * `\newtheorem` that follows.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { declarations, displayName, elementOf, environmentOf, numberingOf, statementIn, text, withinArgument } from '../statement.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const params = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const numbering = numberingOf(params);
  const settings = [
    `\\theoremstyle{${text(params, 'style', 'plain')}}`,
    `\\theoremheaderfont{${text(params, 'headFont', '\\normalfont\\bfseries')}}`,
    `\\theorembodyfont{${text(params, 'bodyFont', '\\itshape')}}`,
    `\\theoremseparator{${text(params, 'separator', '')}}`,
    `\\theoremsymbol{${text(params, 'symbol', '')}}`,
  ].join('');
  return {
    preamble: (_p, _parent, node) => {
      const packages = ['\\usepackage[amsmath,thmmarks]{ntheorem}'];
      if (node === undefined) return { packages };
      return {
        packages,
        declarations: declarations(elementOf(node), numbering, (env, element, counter) =>
          [settings, 'shared' in counter ? `\\newtheorem{${env}}[${counter.shared}]{${displayName(element)}}` : `\\newtheorem{${env}}{${displayName(element)}}${withinArgument(counter.within)}`].join('\n'),
        ),
      };
    },
    emit: (node, content, note) => statementIn(environmentOf(elementOf(node), numbering.rename === 'yes'), node, content, note),
  };
};

export default realize;
