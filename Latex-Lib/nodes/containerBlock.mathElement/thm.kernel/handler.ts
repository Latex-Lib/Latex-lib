/**
 * thm.kernel: the kernel's `\newtheorem` per kind, no package.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { declarations, displayName, elementOf, environmentOf, numberingOf, statementIn, withinArgument } from '../statement.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const numbering = numberingOf(withDefaults(key.params, given as never));
  return {
    preamble: (_p, _parent, node) =>
      node === undefined
        ? {}
        : {
            declarations: declarations(elementOf(node), numbering, (env, element, counter) =>
              'shared' in counter ? `\\newtheorem{${env}}[${counter.shared}]{${displayName(element)}}` : `\\newtheorem{${env}}{${displayName(element)}}${withinArgument(counter.within)}`,
            ),
          },
    emit: (node, content, note) => statementIn(environmentOf(elementOf(node), numbering.rename === 'yes'), node, content, note),
  };
};

export default realize;
