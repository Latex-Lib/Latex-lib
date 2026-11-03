/**
 * toc.koma: KOMA-Script's contents options through \KOMAoptions:
 * toc=flat or graduated, and entries for the bibliography, the lists and the
 * index (toc=bibliography, toc=listof, toc=index); then \tableofcontents.
 * KOMA classes only.
 * CTAN: https://ctan.org/pkg/koma-script
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { contentsBody, contentsDeclarations } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const entries = param(p, 'entries').split(',').map((e) => e.trim()).filter(Boolean);
  const options = [`toc=${param(p, 'layout', 'flat')}`, ...entries.map((e) => `toc=${e}`)];
  return {
    preamble: () => ({ declarations: [`\\KOMAoptions{${options.join(',')}}`, ...contentsDeclarations(p)] }),
    emit: () => contentsBody(p),
  };
};

export default realize;
