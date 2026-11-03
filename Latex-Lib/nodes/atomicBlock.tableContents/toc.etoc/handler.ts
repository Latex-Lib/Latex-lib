/**
 * toc.etoc: \tableofcontents, or \localtableofcontents for the current
 * division's own entries; \etocsetnexttocdepth for the next list's depth.
 * CTAN: https://ctan.org/pkg/etoc
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { contentsBody, contentsDeclarations } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = contentsDeclarations(p);
  const depth = param(p, 'nextDepth', 'none') === 'none' ? '' : `\\etocsetnexttocdepth{${param(p, 'nextDepth')}}\n`;
  return {
    preamble: () => ({ packages: ['\\usepackage{etoc}'], ...(declarations.length === 0 ? {} : { declarations }) }),
    emit: () => `${depth}${contentsBody(p, param(p, 'scope', 'document') === 'local' ? '\\localtableofcontents' : '\\tableofcontents')}`,
  };
};

export default realize;
