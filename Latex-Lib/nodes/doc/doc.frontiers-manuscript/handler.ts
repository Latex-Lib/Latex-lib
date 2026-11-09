/**
 * doc.frontiers-manuscript (doc). Frontiers' manuscript form: one column from the first page and the first page's number, as the
 * template writes them right after \begin{document} (frontiers.tex l.45-46: \onecolumn, \firstpage{1}). FrontiersinHarvard.cls
 * ends with \twocolumn (l.903); its \firstpage{n} raises the page counter to n and keeps n for the page range (l.266-275).
 * A Flouest template carries only preamble lines, so both go into one \AtBeginDocument: a preamble's hook code (label top-level)
 * runs after the class's own \AtBeginDocument, whose \pagenumbering{arabic} resets the page counter to 1 (l.277-283, 308-310),
 * so \firstpage still finds the counter at 1. With the defaults (two columns, no first page) it prints nothing.
 * Class files: FrontiersinHarvard.cls v2.6 (Source/0757-frontiers).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const first = typeof p['firstPage'] === 'number' && Number.isInteger(p['firstPage']) && (p['firstPage'] as number) > 0 ? (p['firstPage'] as number) : 0;
  const body = `${param(p, 'columns', 'two') === 'one' ? '\\onecolumn' : ''}${first > 0 ? `\\firstpage{${first}}` : ''}`;
  return {
    preamble: () => (body === '' ? {} : { declarations: [`\\AtBeginDocument{${body}}`] }),
    emit: () => '',
  };
};

export default realize;
