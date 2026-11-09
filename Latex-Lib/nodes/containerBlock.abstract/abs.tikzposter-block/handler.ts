/**
 * abs.tikzposter-block (containerBlock/abstract). The abstract as one of tikzposter's blocks: \block[options]{Abstract}{…}, the
 * class's titled box (title bar and body drawn with TikZ in the current column, or across the poster outside \begin{columns}), as
 * posters write their first block (0707-tu-delft-poster/main.tex l.52, \block{Introduction}{…}; 0436-jacobs-landscape-poster
 * l.28, \block{Motivation}{…}). The block's options are the ones posters give a block: titleleft and roundedcorners=…
 * (simple-poster.tex l.83). tikzposter has no abstract environment of its own (its profile defines none).
 * CTAN: https://ctan.org/pkg/tikzposter
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { abstractBody } from '../node.ts';
import key from './key.ts';

/** The \block options the parameters set, in simple-poster.tex's order (l.83: titleleft,roundedcorners=16); unset ones are left out. */
const optionsOf = (p: { readonly [name: string]: unknown }): string[] => [
  ...(p['titleleft'] === true ? ['titleleft'] : []),
  ...(param(p, 'roundedcorners', '') !== '' ? [`roundedcorners=${param(p, 'roundedcorners', '')}`] : []),
  ...(param(p, 'linewidth', '') !== '' ? [`linewidth=${param(p, 'linewidth', '')}`] : []),
];

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const options = optionsOf(p);
  return {
    preamble: () => ({}),
    // The body is \block's third argument (\long, so its paragraphs stand), set in a TikZ node: no verbatim, no float, no footnote
    // (the key's gives). A body opening with a list starts its paragraph first (abstractBody).
    emit: (node, content) => `\\block${options.length === 0 ? '' : `[${options.join(',')}]`}{${param(p, 'name', 'Abstract')}}{\n${abstractBody(node, content)}\n}\n\n`,
  };
};

export default realize;
