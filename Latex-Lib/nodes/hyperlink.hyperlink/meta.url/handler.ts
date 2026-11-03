/**
 * meta.url: \url{…}, the address typeset with breaks at its punctuation
 * (xurl breaks it anywhere); \urlstyle{tt|rm|sf|same} for its font; the
 * link's text, when it differs, before it in words.
 * CTAN: https://ctan.org/pkg/url, https://ctan.org/pkg/xurl
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { hrefOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const style = param(p, 'style', 'tt');
  return {
    preamble: () => ({ packages: ['\\usepackage{url}', ...(p['anywhere'] === true ? ['\\usepackage{xurl}'] : [])], ...(style === 'tt' ? {} : { declarations: [`\\urlstyle{${style}}`] }) }),
    emit: (node, content) => (hrefOf(node) === '' ? content : content.trim() === '' || content.trim() === hrefOf(node) ? `\\url{${hrefOf(node)}}` : `${content} (\\url{${hrefOf(node)}})`),
  };
};

export default realize;
