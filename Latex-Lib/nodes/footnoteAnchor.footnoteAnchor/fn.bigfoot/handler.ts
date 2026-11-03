/**
 * fn.bigfoot: footnotehyper (footnote's hyperref-safe fork): footnotes in
 * environments that would lose them are saved and printed afterwards,
 * \makesavenoteenv{tabular} for each environment named.
 * CTAN: https://ctan.org/pkg/footnotehyper
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const environments = param(p, 'environments').split(',').map((e) => e.trim()).filter(Boolean);
  return {
    preamble: () => ({ packages: ['\\usepackage{footnotehyper}'], ...(environments.length === 0 ? {} : { declarations: environments.map((e) => `\\makesavenoteenv{${e}}`) }) }),
    emit: (node, content) => content,
  };
};

export default realize;
